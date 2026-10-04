import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Animated, { cancelAnimation, Easing, interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { readSavedStudioTheme, STUDIO_THEMES, THEME_STORAGE_KEY, type StudioThemeId } from '../constants/studio-themes';
import { readSavedGames, saveGeneratedGame, type SavedGame } from '../data/game-library';
import { ContentVortex } from '../components/content-vortex';

const API_BASE = Platform.OS === 'web' ? 'http://localhost:3000/api' : 'http://10.0.2.2:3000/api';

const MODELS = [
  { id: 'moonshotai/kimi-k3', label: 'Kimi K3', badge: 'NVIDIA NIM', description: 'Kimi K3 · NVIDIA NIM' },
];

const SUGGESTIONS = [
  'Voxel survival',
  'Ink samurai duel',
  'Comic-book firefight',
  'Realistic battlefield',
  'Fight-first shooter',
  'Jungle expedition drive',
  'Sunny kingdom platformer',
];

type DesignQuestion = {
  dimension: string;
  question: string;
  options: { id: string; label: string; description: string }[];
};
type DesignAnswer = { dimension: string; question: string; label: string; description: string };

function BuildProgressBar({ theme }: { theme: typeof STUDIO_THEMES[number] }) {
  const trackWidth = useSharedValue(0);
  const position = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const shimmerStyle = useAnimatedStyle(() => {
    const segmentWidth = trackWidth.value * 0.34;
    return {
      width: reduceMotion ? trackWidth.value : segmentWidth,
      transform: [{ translateX: reduceMotion ? 0 : interpolate(position.value, [0, 1], [-segmentWidth, trackWidth.value]) }],
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      position.set(0);
      return;
    }
    position.set(withRepeat(withTiming(1, { duration: 1450, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(position);
  }, [position, reduceMotion]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Game generation in progress"
      onLayout={(event) => trackWidth.set(event.nativeEvent.layout.width)}
      style={[styles.progressTrack, { backgroundColor: theme.surfaceAlt }]}
    >
      <Animated.View style={[styles.progressFill, { backgroundColor: theme.accent }, shimmerStyle]} />
    </View>
  );
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export default function HomeScreen() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'designing' | 'building' | null>(null);
  const [loadingElapsed, setLoadingElapsed] = useState(0);
  const [clarifying, setClarifying] = useState(false);
  const [designQuestions, setDesignQuestions] = useState<DesignQuestion[]>([]);
  const [questionFallback, setQuestionFallback] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [designAnswers, setDesignAnswers] = useState<DesignAnswer[]>([]);
  const [flowStep, setFlowStep] = useState<'prompt' | 'questions' | 'review'>('prompt');
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [recentGames, setRecentGames] = useState<SavedGame[]>([]);
  const [themeId, setThemeId] = useState<StudioThemeId>(readSavedStudioTheme);
  const { width } = useWindowDimensions();
  const compact = width < 860;
  const router = useRouter();
  const theme = STUDIO_THEMES.find((item) => item.id === themeId) ?? STUDIO_THEMES[0];
  const activeModel = MODELS.find((item) => item.id === selectedModel) ?? MODELS[0];

  useEffect(() => {
    let mounted = true;
    void readSavedGames().then((games) => { if (mounted) setRecentGames(games.slice(0, 6)); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!loading) return;
    const startedAt = Date.now();
    setLoadingElapsed(0);
    const timer = setInterval(() => setLoadingElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [loading]);

  const openSavedGame = (game: SavedGame) => router.push({ pathname: '/player', params: {
    savedGameId: game.id,
    title: game.title,
    enrichedBrief: game.enrichedBrief,
    runtimeVersion: game.runtimeVersion,
  } });

  useEffect(() => {
    if (!modelPickerOpen || Platform.OS !== 'web') return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModelPickerOpen(false);
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      const picker = document.getElementById('ai-model-picker');
      if (!picker?.contains(event.target as Node)) setModelPickerOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('pointerdown', closeOnOutsidePress);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('pointerdown', closeOnOutsidePress);
    };
  }, [modelPickerOpen]);

  const selectTheme = (id: StudioThemeId) => {
    setThemeId(id);
    if (Platform.OS === 'web') {
      try { window.localStorage.setItem(THEME_STORAGE_KEY, id); } catch { /* Theme still applies for this visit. */ }
    }
  };

  const handlePrepareDesign = async (idea = prompt) => {
    if (!idea.trim()) {
      setError('Add a game idea first, or start with one of the examples.');
      return;
    }
    setError('');
    setPrompt(idea.trim());
    setClarifying(true);
    setDesignQuestions([]);
    setQuestionFallback(false);
    setDesignAnswers([]);
    setQuestionIndex(0);
    try {
      const response = await axios.post(`${API_BASE}/clarify`, {
        prompt: idea.trim(),
        modelId: selectedModel,
      }, { timeout: 80_000 });
      const questions = response.data?.questions;
      if (!Array.isArray(questions) || questions.length < 4 || questions.length > 5) {
        throw new Error('The studio could not prepare the design questions. Please try again.');
      }
      setDesignQuestions(questions);
      setQuestionFallback(response.data?.fallback === true);
      setFlowStep('questions');
    } catch (err: any) {
      setError(err.code === 'ECONNABORTED'
        ? 'These questions are taking longer than expected. Please try again.'
        : err.response?.data?.error || err.message || 'Could not prepare your game questions.');
    } finally {
      setClarifying(false);
    }
  };

  const handleChooseAnswer = (question: DesignQuestion, option: DesignQuestion['options'][number]) => {
    const nextAnswers = [...designAnswers.slice(0, questionIndex), {
      dimension: question.dimension,
      question: question.question,
      label: option.label,
      description: option.description,
    }];
    setDesignAnswers(nextAnswers);
    if (questionIndex + 1 >= designQuestions.length) {
      setFlowStep('review');
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (flowStep === 'review') {
      setQuestionIndex(Math.max(0, designQuestions.length - 1));
      setFlowStep('questions');
      return;
    }
    if (questionIndex === 0) {
      setFlowStep('prompt');
      return;
    }
    setQuestionIndex((index) => index - 1);
    setDesignAnswers((answers) => answers.slice(0, -1));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Add a game idea first, or start with one of the examples.');
      setFlowStep('prompt');
      return;
    }
    setError('');
    setLoading(true);
    setLoadingStage('designing');
    setLoadingElapsed(0);
    const stageTimer = setTimeout(() => setLoadingStage('building'), 6000);
    try {
      const response = await axios.post(`${API_BASE}/generate`, {
        prompt: prompt.trim(),
        modelId: selectedModel,
        clarifications: designAnswers,
      });
      const { html, enrichedBrief, runtimeVersion, qualityNotice } = response.data;
      if (html) {
        const savedGameId = await saveGeneratedGame({
          title: prompt.trim().slice(0, 60) || 'My game',
          html,
          enrichedBrief: enrichedBrief ?? '',
          runtimeVersion: runtimeVersion ? String(runtimeVersion) : '',
        });
        router.push({ pathname: '/player', params: {
          ...(savedGameId ? { savedGameId } : { html }),
          title: prompt.trim().slice(0, 60) || 'My game',
          enrichedBrief: enrichedBrief ?? '',
          runtimeVersion: runtimeVersion ? String(runtimeVersion) : '',
          ...(qualityNotice ? { qualityNotice: String(qualityNotice) } : {}),
        } });
      } else {
        setError('The studio did not receive a playable game. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || (err.code === 'ECONNABORTED'
        ? 'The connection ended before the game finished. Please try again.'
        : err.message || 'Could not reach the game studio. Check that the server is running.'));
    } finally {
      clearTimeout(stageTimer);
      setLoading(false);
      setLoadingStage(null);
    }
  };

  return (
    <View style={[styles.outer, { backgroundColor: theme.canvas }]}>
      <View style={[styles.canvas, { backgroundColor: theme.canvasDeep }]}>
        <View style={[styles.workspace, compact && styles.workspaceCompact]}>
          {!compact && flowStep !== 'prompt' && <View style={[styles.sidebar, { backgroundColor: theme.canvasDeep, borderRightColor: theme.surfaceAlt }]}>
            <View style={styles.sidebarBrandRow}><Text style={[styles.wordmark, { color: theme.ink }]}>spawn.gg <Text style={{ color: theme.accent }}>✳</Text></Text><Text style={[styles.brandCaption, { color: theme.muted }]}>YOUR GAME WORKSPACE</Text></View>
            <Pressable accessibilityRole="button" onPress={() => { setFlowStep('prompt'); setPrompt(''); setDesignQuestions([]); setDesignAnswers([]); setError(''); }} style={[styles.newGameItem, { backgroundColor: theme.surface, borderColor: theme.border }]}><Text style={[styles.sidebarIcon, { color: theme.accent }]}>＋</Text><Text style={[styles.sidebarText, { color: theme.ink }]}>New game</Text></Pressable>
            <View style={styles.recentsSection}>
              <Text style={[styles.sidebarEyebrow, { color: theme.muted }]}>RECENTS</Text>
              {recentGames.length ? recentGames.map((game) => <Pressable key={game.id} accessibilityRole="button" accessibilityLabel={`Open ${game.title}`} onPress={() => openSavedGame(game)} style={({ pressed }) => [styles.recentItem, pressed && styles.pressedControl]}><Text style={[styles.recentItemText, { color: theme.muted }]} numberOfLines={1}>{game.title}</Text></Pressable>) : <Text style={[styles.emptyRecents, { color: theme.muted }]}>Your recent games will show up here.</Text>}
              <Pressable accessibilityRole="button" onPress={() => router.push('/gallery' as never)} style={styles.allGamesLink}><Text style={[styles.allGamesText, { color: theme.accent }]}>All games <Text>↗</Text></Text></Pressable>
            </View>
            <View style={[styles.sidebarDivider, { backgroundColor: theme.border }]} />
            <Text style={[styles.sidebarEyebrow, { color: theme.muted }]}>COLOR THEME</Text>
            <View accessibilityLabel="Studio color themes" style={styles.sidebarSwatches}>
              {STUDIO_THEMES.map((item) => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Use ${item.name} theme`} accessibilityState={{ selected: item.id === themeId }} onPress={() => selectTheme(item.id)} style={({ pressed }) => [styles.swatch, styles.sidebarSwatch, { backgroundColor: item.swatch, borderColor: item.id === themeId ? theme.accent : theme.border }, pressed && styles.pressedControl]}><Text style={[styles.swatchCheck, { color: item.ink }]}>{item.id === themeId ? '✓' : ''}</Text></Pressable>)}
            </View>
            <View style={styles.sidebarFooter}>
              <Pressable accessibilityRole="button" onPress={() => router.push('/gallery' as never)} style={[styles.creditsRow, { borderTopColor: theme.border }]}><Text style={[styles.creditsText, { color: theme.muted }]}>◉　My games</Text><Text style={[styles.creditsCount, { color: theme.ink }]}>{recentGames.length}</Text></Pressable>
              <Text style={[styles.sidebarFoot, { color: theme.muted }]}>Keyboard controls come with every game.</Text>
            </View>
          </View>}

          <View style={[styles.mainArea, compact && styles.mainAreaCompact]}>
            <View style={[styles.nav, compact && styles.navCompact, flowStep === 'prompt' && styles.navPrompt, flowStep !== 'prompt' && styles.navFlow, { borderColor: theme.border, backgroundColor: theme.canvasDeep }]}>
              {flowStep === 'prompt' || compact ? <Text style={[styles.wordmark, { color: theme.ink }]}>spawn.gg <Text style={{ color: theme.accent }}>✳</Text></Text> : <View><Text style={[styles.navNote, { color: theme.muted }]}>WORKSPACE</Text><Text style={[styles.navTitle, { color: theme.ink }]}>Game studio</Text></View>}
              <View style={styles.navRight}>
                {!compact && <View style={styles.readyIndicator}><View style={[styles.readyDot, { backgroundColor: theme.accent }]} /><Text style={[styles.readyText, { color: theme.muted }]}>{flowStep === 'prompt' ? 'STUDIO READY' : 'Ready to create'}</Text></View>}
                <Pressable style={[styles.navButton, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]} onPress={() => router.push('/gallery' as never)}>
                  <Text style={[styles.navButtonText, { color: theme.ink }]}>My games ↗</Text>
                </Pressable>
              </View>
            </View>

            {flowStep === 'prompt' && <View style={[styles.signalTicker, compact && styles.signalTickerCompact, { backgroundColor: theme.canvasDeep, borderColor: theme.border }]}><Text style={[styles.signalTickerText, { color: theme.ink }]}>SPAWN.GG　✳　FROM YOUR IDEA TO A WORLD YOU CAN PLAY　✳　KEYBOARD CONTROLS INCLUDED　✳　</Text></View>}

            <ScrollView style={styles.mainScroll} contentContainerStyle={[styles.mainScrollContent, flowStep === 'prompt' && styles.mainScrollContentLanding, compact && styles.mainScrollContentCompact]} keyboardShouldPersistTaps="handled">
            <View style={[styles.chatWorkspace, flowStep !== 'prompt' && styles.flowWorkspace, flowStep === 'prompt' && styles.landingWorkspace, compact && styles.chatWorkspaceCompact, compact && flowStep !== 'prompt' && styles.flowWorkspaceCompact, compact && flowStep === 'prompt' && styles.landingWorkspaceCompact]}>
              {flowStep !== 'prompt' && <View style={[styles.chatHeader, styles.flowHeader]}>
                <View style={[styles.assistantMark, styles.flowAssistantMark]}><Text style={[styles.assistantMarkText, { color: theme.accent }]}>✳</Text></View>
                <View style={{ flex: 1 }}><Text style={[styles.chatEyebrow, { color: theme.muted }]}>SPAWN STUDIO　/　DESIGN</Text><Text accessibilityRole="header" style={[styles.chatTitle, styles.flowTitle, compact && styles.flowTitleCompact, { color: theme.ink }]}>{flowStep === 'questions' ? 'Let’s shape your game' : 'Your game plan'}</Text></View>
                <Pressable accessibilityRole="button" onPress={() => { setFlowStep('prompt'); setDesignQuestions([]); setDesignAnswers([]); setError(''); }} style={[styles.changeIdea, { borderColor: theme.border }]}><Text style={{ color: theme.muted, fontSize: 12, fontWeight: '700' }}>Start over</Text></Pressable>
              </View>}

              {flowStep === 'prompt' ? <View style={[styles.landingHero, compact && styles.landingHeroCompact]}>
                <View style={[styles.leftCircleField, compact && styles.leftCircleFieldCompact, { pointerEvents: 'none', backgroundImage: 'repeating-radial-gradient(circle at 44% 50%, transparent 0 38px, rgba(218, 225, 231, 0.1) 39px 40px, transparent 41px 67px)' } as any]} />
                <View style={[styles.landingContent, compact && styles.landingContentCompact]}>
                <View style={styles.kickerRow}><View style={[styles.kickerDot, { backgroundColor: theme.accent }]} /><Text style={[styles.kicker, { color: theme.muted }]}>A LITTLE STUDIO FOR BIG IDEAS</Text></View>
                <Text accessibilityRole="header" style={[styles.landingTitle, compact && styles.landingTitleCompact, { color: theme.ink }]}>Make a game.{ '\n' }Make it yours.</Text>
                <Text style={[styles.landingDescription, compact && styles.landingDescriptionCompact, { color: theme.muted }]}>Dream up a world, a character, a challenge. We’ll shape it together and make something you can play.</Text>
                <View style={[styles.promptPanel, styles.composerPanel]}>
                <Text style={[styles.fieldLabel, { color: theme.ink }]}>What should we make?</Text>
                <TextInput
                  accessibilityLabel="Describe the game you want to make"
                  value={prompt}
                  onChangeText={(value) => { setPrompt(value); setError(''); }}
                  placeholder="Describe the game you want to build…"
                  placeholderTextColor={`${theme.muted}aa`}
                  multiline
                  textAlignVertical="top"
                  style={[styles.promptInput, styles.composerInput, { color: theme.ink, backgroundColor: theme.input, borderColor: theme.border, outlineColor: theme.accent }] as any}
                />
                <View style={styles.composerBottom}>
                  <View nativeID="ai-model-picker" style={styles.modelWrap}>
                    <Pressable accessibilityRole="button" accessibilityLabel={`AI model: ${activeModel.label}`} accessibilityState={{ expanded: modelPickerOpen }} onPress={() => setModelPickerOpen((open) => !open)} style={[styles.modelButton, styles.modelButtonCompact, { borderColor: theme.border, backgroundColor: theme.surfaceAlt }]}>
                      <Text style={[styles.modelBadge, { color: theme.accent }]}>{activeModel.badge}</Text><Text style={[styles.modelName, { color: theme.ink }]} numberOfLines={1}>{activeModel.label}</Text><Text style={[styles.caret, { color: theme.ink }]}>{modelPickerOpen ? '⌃' : '⌄'}</Text>
                    </Pressable>
                    {modelPickerOpen && <View style={[styles.modelMenu, styles.modelMenuComposer, { backgroundColor: theme.surface, borderColor: theme.border }]}>{MODELS.map((model) => <Pressable key={model.id} onPress={() => { setSelectedModel(model.id); setModelPickerOpen(false); }} style={[styles.modelOption, { borderBottomColor: theme.border }, model.id === selectedModel && { backgroundColor: theme.surfaceAlt }]}><View style={{ flex: 1 }}><Text style={[styles.modelOptionName, { color: theme.ink }]}>{model.label}</Text><Text style={[styles.modelOptionDesc, { color: theme.muted }]}>{model.description}</Text></View>{model.id === selectedModel && <Text style={{ color: theme.accent, fontWeight: '800' }}>✓</Text>}</Pressable>)}<View accessibilityLabel="Other providers locked while NVIDIA NIM is active" style={[styles.modelOption, { borderBottomWidth: 0, borderBottomColor: theme.border, opacity: 0.62 }]}><View style={{ flex: 1 }}><Text style={[styles.modelOptionName, { color: theme.muted }]}>Other providers · locked</Text><Text style={[styles.modelOptionDesc, { color: theme.muted }]}>NVIDIA NIM is the only active provider</Text></View><Text style={{ color: theme.muted, fontSize: 9, fontWeight: '800' }}>LOCKED</Text></View></View>}
                  </View>
                  <Pressable accessibilityRole="button" accessibilityLabel="Continue to game questions" onPress={() => { void handlePrepareDesign(); }} disabled={clarifying || !prompt.trim()} style={({ pressed }) => [styles.generateButton, styles.prepareButton, { backgroundColor: theme.accent, opacity: clarifying ? 0.65 : pressed ? 0.84 : !prompt.trim() ? 0.45 : 1 }]}>
                    {clarifying ? <ActivityIndicator color={theme.buttonText} /> : <Text style={[styles.generateText, styles.sendArrow, { color: theme.buttonText }]}>↑</Text>}
                  </Pressable>
                </View>
                <Text style={[styles.helper, styles.composerFootnote, { color: theme.muted }]}>A short idea is enough. We’ll ask a few quick questions before building.</Text>
                {clarifying && <Text style={[styles.progressLabel, { color: theme.muted, marginTop: 10 }]}>Thinking of a few choices for your idea…</Text>}
                <View style={styles.examples}>
                  {SUGGESTIONS.map((idea) => <Pressable key={idea} accessibilityRole="button" onPress={() => { void handlePrepareDesign(idea); }} style={({ pressed }) => [styles.example, { borderColor: theme.border, backgroundColor: theme.surfaceAlt }, pressed && styles.pressedControl]}><Text style={[styles.exampleText, { color: theme.ink }]} numberOfLines={1}>{idea}</Text></Pressable>)}
                </View>
                {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
                </View>
                {!compact && <View style={[styles.buildNote, { borderColor: theme.border }]}><Text style={[styles.buildNoteIndex, { color: theme.accent }]}>01</Text><Text style={[styles.buildNoteText, { color: theme.muted }]}>A few quick choices help us get the game feeling right. Then we build and check it before you play.</Text></View>}
                </View>
                <View style={[styles.artColumn, compact && styles.artColumnCompact, { backgroundColor: theme.canvasDeep }]}>
                  <View style={[styles.artLabel, { backgroundColor: theme.canvasDeep, borderColor: theme.border }]}><Text style={[styles.artLabelText, { color: theme.muted }]}>✳  A WORLD OF YOUR OWN</Text></View>
                  <View style={styles.artFrame}><ContentVortex color={theme.ink} accent={theme.accent} background={theme.canvasDeep} phrase="THE GAME IS YOURS · IMAGINE IT · PLAY IT · SPAWN.GG · " /></View>
                  <View style={[styles.artCaption, { backgroundColor: theme.canvasDeep, borderColor: theme.border }]}><Text style={[styles.captionTitle, { color: theme.ink }]}>Dream it up.</Text><Text style={[styles.captionText, { color: theme.muted }]}>Then press play.</Text></View>
                  <Text style={[styles.artIndex, { color: theme.muted }]}>IDEA　●　DESIGN　●　PLAY</Text>
                </View>
              </View> : <View style={[styles.conversation, !compact && styles.flowConversation, { borderColor: theme.border }]}>
                <View style={styles.userMessageRow}><View style={[styles.userMessage, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}><Text style={[styles.messageText, { color: theme.ink }]}>{prompt}</Text></View></View>
                {flowStep === 'questions' && designAnswers.map((answer, index) => <View key={`${answer.dimension}-${index}`} style={styles.answerBlock}>
                  <View style={styles.assistantMessageRow}><View style={[styles.tinyMark, { backgroundColor: theme.surfaceAlt }]}><Text style={{ color: theme.accent, fontSize: 12 }}>✳</Text></View><Text style={[styles.transcriptQuestion, { color: theme.muted }]}>{answer.question}</Text></View>
                  <View style={styles.userMessageRow}><View style={[styles.answerPill, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}><Text style={[styles.answerText, { color: theme.ink }]}>{answer.label}</Text></View></View>
                </View>)}

                {flowStep === 'questions' && designQuestions[questionIndex] && <View style={[styles.questionCard, styles.questionCardOpen, { backgroundColor: 'transparent', borderColor: theme.border }]}>
                  <View style={styles.questionTop}><Text style={[styles.questionStep, { color: theme.accent }]}>QUESTION {questionIndex + 1} OF {designQuestions.length}</Text><View style={[styles.questionTrack, { backgroundColor: theme.surfaceAlt }]}><View style={[styles.questionTrackFill, { backgroundColor: theme.accent, width: `${((questionIndex + 1) / designQuestions.length) * 100}%` }]} /></View></View>
                  <Text accessibilityRole="header" style={[styles.questionTitle, { color: theme.ink }]}>{designQuestions[questionIndex].question}</Text>
                  {questionFallback && questionIndex === 0 ? <Text style={[styles.answerOptionDescription, { color: theme.muted, marginBottom: 8 }]}>Quick-start questions are being used. You can still shape your game and continue.</Text> : null}
                  <View style={styles.answerOptions}>{designQuestions[questionIndex].options.map((option) => <Pressable key={option.id} accessibilityRole="button" onPress={() => handleChooseAnswer(designQuestions[questionIndex], option)} style={({ pressed }) => [styles.answerOption, { borderColor: theme.border, backgroundColor: theme.surfaceAlt }, pressed && { borderColor: theme.accent, backgroundColor: `${theme.accent}18` }]}><View style={{ flex: 1 }}><Text style={[styles.answerOptionTitle, { color: theme.ink }]}>{option.label}</Text><Text style={[styles.answerOptionDescription, { color: theme.muted }]}>{option.description}</Text></View><Text style={[styles.optionArrow, { color: theme.accent }]}>↗</Text></Pressable>)}</View>
                  <Pressable accessibilityRole="button" onPress={handlePreviousQuestion} style={styles.backLink}><Text style={[styles.backLinkText, { color: theme.muted }]}>← {questionIndex === 0 ? 'Change my idea' : 'Previous question'}</Text></Pressable>
                </View>}

                {flowStep === 'review' && <View style={[styles.questionCard, styles.reviewCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={styles.reviewHeader}><Text style={[styles.questionStep, { color: theme.accent }]}>GAME PLAN</Text><Text style={[styles.reviewCount, { color: theme.muted }]}>{designAnswers.length} decisions made</Text></View>
                  <Text accessibilityRole="header" style={[styles.questionTitle, styles.reviewTitle, { color: theme.ink }]}>Ready to build your game?</Text><Text style={[styles.reviewCopy, { color: theme.muted }]}>Here’s what we’ll make from your idea.</Text>
                  <View style={styles.reviewAnswers}>{designAnswers.map((answer, index) => <View key={`${answer.dimension}-${index}`} style={[styles.reviewRow, { borderBottomColor: theme.border }]}><Text style={[styles.reviewDimension, { color: theme.muted }]}>{answer.dimension}</Text><Text style={[styles.reviewChoice, { color: theme.ink }]}>{answer.label}</Text></View>)}</View>
                  <View style={styles.reviewActions}><Pressable accessibilityRole="button" onPress={handlePreviousQuestion} style={[styles.changeIdea, styles.editAnswersButton, { borderColor: theme.border }]}><Text style={{ color: theme.muted, fontSize: 12, fontWeight: '700' }}>← Edit answers</Text></Pressable><Pressable accessibilityRole="button" onPress={handleGenerate} disabled={loading} style={({ pressed }) => [styles.generateButton, styles.reviewGenerate, { backgroundColor: theme.accent, opacity: loading ? 0.65 : pressed ? 0.84 : 1 }]}>{loading ? <ActivityIndicator color={theme.buttonText} /> : <Text style={[styles.generateText, { color: theme.buttonText }]}>Build my game <Text style={styles.arrow}>↗</Text></Text>}</Pressable></View>
                  {loading && <View style={styles.progress}>
                    <View style={styles.progressMeta}>
                      <Text style={[styles.progressLabel, { color: theme.ink }]}>{loadingStage === 'designing' ? '01  Shaping your game plan' : '02  Building and checking your game'}</Text>
                      <Text style={[styles.progressElapsed, { color: theme.muted }]}>Elapsed {formatElapsed(loadingElapsed)}</Text>
                    </View>
                    <BuildProgressBar theme={theme} />
                    <Text style={[styles.progressHint, { color: theme.muted }]}>{loadingElapsed < 180 ? 'Estimated 1–3 minutes · detailed games can take longer' : 'Taking longer than estimated · the build continues beyond the 3-minute mark'}</Text>
                  </View>}
                  {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
                </View>}
              </View>}

              {flowStep !== 'prompt' && !compact && <View style={[styles.flowArtwork, { backgroundColor: 'transparent' }]}>
                <View style={styles.artFrame}><ContentVortex color={theme.ink} accent={theme.accent} background={theme.canvasDeep} phrase="YOUR IDEA · TAKING SHAPE · SPAWN.GG · DESIGN · PLAY · " /></View>
                <View style={[styles.artLabel, { backgroundColor: theme.canvasDeep }]}><Text style={[styles.artLabelText, { color: theme.muted }]}>✳  A WORLD IN THE MAKING</Text></View>
                <View style={[styles.artCaption, { backgroundColor: theme.canvasDeep }]}><Text style={[styles.captionTitle, { color: theme.ink }]}>Made around your idea.</Text><Text style={[styles.captionText, { color: theme.muted }]}>One choice at a time.</Text></View>
                <Text style={[styles.artIndex, { color: theme.muted }]}>DESIGN　●　BUILD　●　PLAY</Text>
              </View>}

            </View>
            {(compact || flowStep === 'prompt') && <View style={[styles.mobilePalette, styles.landingPalette, { borderTopColor: theme.border }]}><View style={{ flex: 1 }}><Text style={[styles.themeTitle, { color: theme.ink }]}>Pick your studio palette</Text><Text style={[styles.themeSub, { color: theme.muted }]}>Choose a shade for your world</Text></View><View accessibilityLabel="Studio color themes" style={styles.swatches}>{STUDIO_THEMES.map((item) => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Use ${item.name} theme`} accessibilityState={{ selected: item.id === themeId }} onPress={() => selectTheme(item.id)} style={({ pressed }) => [styles.swatch, styles.mobileSwatch, { backgroundColor: item.swatch, borderColor: item.id === themeId ? theme.accent : theme.border }, pressed && styles.pressedControl]}><Text style={[styles.swatchCheck, { color: item.ink }]}>{item.id === themeId ? '✓' : ''}</Text></Pressable>)}</View></View>}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, height: '100vh' as any, minHeight: '100vh' as any, backgroundColor: '#171918' },
  canvas: { flex: 1, width: '100%', minHeight: '100vh' as any, overflow: 'hidden' },
  workspace: { flex: 1, minHeight: 0, flexDirection: 'row' },
  workspaceCompact: { flexDirection: 'column' },
  mainArea: { flex: 1, minWidth: 0 },
  mainAreaCompact: { width: '100%' },
  mainScroll: { flex: 1 },
  mainScrollContent: { flexGrow: 1, paddingHorizontal: 42, paddingBottom: 28 },
  mainScrollContentLanding: { paddingHorizontal: 0, paddingBottom: 0 },
  mainScrollContentCompact: { paddingHorizontal: 18, paddingBottom: 18, justifyContent: 'flex-start' },
  nav: { width: '100%', maxWidth: 680, minHeight: 62, marginTop: 13, marginHorizontal: 'auto' as any, paddingHorizontal: 17, borderWidth: 1, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 },
  navPrompt: { borderWidth: 0, minHeight: 58 },
  navFlow: { borderWidth: 0, minHeight: 58 },
  navHidden: { display: 'none' },
  navCompact: { width: 'auto' as any, maxWidth: '100%', minHeight: 56, marginTop: 12, marginHorizontal: 14, paddingHorizontal: 14, alignSelf: 'stretch' },
  navTitle: { fontSize: 15, fontWeight: '750' as any, marginTop: 3 },
  wordmark: { fontSize: 22, fontWeight: '900', letterSpacing: -1.4 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  navNote: { fontSize: 9, letterSpacing: 1.35, fontWeight: '700' },
  navButton: { minHeight: 38, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  navButtonText: { fontSize: 12, fontWeight: '700' },
  readyIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 3, paddingVertical: 7 },
  readyDot: { width: 7, height: 7, borderRadius: 4 },
  readyText: { fontSize: 11, fontWeight: '600' },
  sidebar: { width: 224, flexShrink: 0, paddingHorizontal: 15, paddingTop: 20, paddingBottom: 15, borderRightWidth: 0, alignSelf: 'stretch' },
  sidebarBrandRow: { minHeight: 46, marginBottom: 17 },
  brandCaption: { fontSize: 8, letterSpacing: 1.15, fontWeight: '800', marginTop: 5 },
  sidebarEyebrow: { fontSize: 9, letterSpacing: 1.25, fontWeight: '800', marginBottom: 9 },
  newGameItem: { minHeight: 44, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 22 },
  sidebarIcon: { fontSize: 18, width: 20, textAlign: 'center', fontWeight: '700' },
  sidebarText: { fontSize: 12, fontWeight: '650' as any },
  sidebarDivider: { height: 1, marginVertical: 17 },
  recentsSection: { gap: 2 },
  recentItem: { minHeight: 38, paddingHorizontal: 10, justifyContent: 'center', borderRadius: 7 },
  recentItemText: { fontSize: 13, fontWeight: '500' },
  emptyRecents: { paddingHorizontal: 10, paddingVertical: 7, fontSize: 11, lineHeight: 16 },
  allGamesLink: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 10 },
  allGamesText: { fontSize: 11, fontWeight: '700' },
  sidebarSwatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 3 },
  sidebarSwatch: { width: 31, height: 31, borderRadius: 16, borderWidth: 1 },
  sidebarFooter: { marginTop: 'auto' },
  creditsRow: { minHeight: 46, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  creditsText: { fontSize: 12, fontWeight: '650' as any },
  creditsCount: { fontSize: 12, fontWeight: '700' },
  sidebarFoot: { paddingTop: 10, fontSize: 10, lineHeight: 16 },
  chatWorkspace: { width: '100%', maxWidth: 1000, alignSelf: 'center', paddingTop: 34, paddingBottom: 20 },
  flowWorkspace: { width: '100%', maxWidth: 1540, maxHeight: 'none' as any, minHeight: 'calc(100vh - 160px)' as any, alignSelf: 'stretch', position: 'relative', paddingHorizontal: 'clamp(28px, 4vw, 68px)' as any, paddingTop: 'clamp(24px, 4vh, 48px)' as any, paddingBottom: 28 },
  flowWorkspaceCompact: { maxHeight: 'none' as any, minHeight: 0, paddingHorizontal: 0, paddingTop: 22, paddingBottom: 12 },
  landingWorkspace: { flexGrow: 1, flexShrink: 0, flexBasis: 'auto', width: '100%', maxWidth: '100%', minHeight: 'calc(100vh - 154px)' as any, justifyContent: 'center', paddingTop: 0, paddingBottom: 0 },
  landingWorkspaceCompact: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', minHeight: 0, paddingTop: 0, paddingBottom: 0 },
  landingContent: { flex: 1.03, minWidth: 0, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 'clamp(28px, 5.2vw, 96px)' as any, paddingVertical: 'clamp(30px, 6vh, 68px)' as any, zIndex: 2 },
  landingMark: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  landingMarkText: { fontSize: 29, fontWeight: '800' },
  landingTitle: { maxWidth: 690, fontSize: 'clamp(50px, 4.5vw, 72px)' as any, letterSpacing: -3.8, lineHeight: '1.02' as any, fontWeight: '800' as any, textAlign: 'left', marginBottom: 18 },
  landingDescription: { maxWidth: 555, fontSize: 17, lineHeight: 25, textAlign: 'left', marginBottom: 24 },
  chatWorkspaceCompact: { maxWidth: 720, paddingTop: 22, paddingBottom: 12 },
  chatHeader: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 22 },
  flowHeader: { width: '63%', marginBottom: 28, alignItems: 'center' },
  assistantMark: { width: 36, height: 36, borderWidth: 1, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  flowAssistantMark: { width: 36, height: 36, borderWidth: 0, borderRadius: 18, backgroundColor: 'transparent' },
  assistantMarkText: { fontSize: 22, fontWeight: '800' },
  chatEyebrow: { fontSize: 9, letterSpacing: 1.6, fontWeight: '800', marginBottom: 3 },
  chatTitle: { fontSize: 26, letterSpacing: -0.7, fontWeight: '800' },
  flowTitle: { fontSize: 46, lineHeight: 52, letterSpacing: -2, fontWeight: '800' },
  flowTitleCompact: { fontSize: 29, lineHeight: 34, letterSpacing: -1 },
  changeIdea: { minHeight: 40, paddingHorizontal: 13, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  composerPanel: { width: '100%', padding: 0, maxWidth: 760, borderWidth: 0, borderRadius: 0, backgroundColor: 'transparent' },
  assistantWelcome: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  welcomeHelper: { fontSize: 14, lineHeight: 20, marginBottom: 18, maxWidth: 640 },
  composerInput: { minHeight: 76, fontSize: 15, lineHeight: 23, borderRadius: 9, borderWidth: 1, backgroundColor: 'transparent', padding: 12 },
  composerBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 5, paddingHorizontal: 4 },
  modelButtonCompact: { minHeight: 44, borderRadius: 10 },
  modelMenuComposer: { bottom: 50, zIndex: 20 },
  prepareButton: { minWidth: 46, width: 46, minHeight: 46, height: 46, borderRadius: 12, paddingHorizontal: 0 },
  sendArrow: { fontSize: 25, lineHeight: 29 },
  composerFootnote: { fontSize: 11, marginTop: 9, marginBottom: 0, paddingHorizontal: 3 },
  conversation: { width: '100%', paddingVertical: 4 },
  flowConversation: { width: '63%', paddingVertical: 0, position: 'relative', zIndex: 1 },
  userMessageRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 18 },
  userMessage: { maxWidth: '86%', borderWidth: 1, borderRadius: 14, borderTopRightRadius: 5, paddingHorizontal: 14, paddingVertical: 11 },
  messageText: { fontSize: 14, lineHeight: 20 },
  answerBlock: { marginBottom: 11 },
  assistantMessageRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginBottom: 4 },
  tinyMark: { width: 24, height: 24, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  transcriptQuestion: { flex: 1, fontSize: 13, lineHeight: 19, paddingTop: 2 },
  answerPill: { maxWidth: '86%', borderWidth: 1, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 9 },
  answerText: { fontSize: 12, fontWeight: '700' },
  questionCard: { borderWidth: 1, borderRadius: 14, padding: 19, marginTop: 2 },
  questionCardOpen: { borderWidth: 0, borderRadius: 0, padding: 0, marginTop: 2 },
  questionTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 15 },
  questionStep: { fontSize: 9, letterSpacing: 1.2, fontWeight: '800' },
  questionTrack: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  questionTrackFill: { height: '100%', borderRadius: 2 },
  questionTitle: { fontSize: 20, lineHeight: 27, letterSpacing: -0.3, fontWeight: '800', marginBottom: 14 },
  answerOptions: { gap: 8 },
  answerOption: { minHeight: 62, borderWidth: 0, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  answerOptionTitle: { fontSize: 13, fontWeight: '700' },
  answerOptionDescription: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  optionArrow: { fontSize: 16, fontWeight: '800', paddingHorizontal: 2 },
  backLink: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center', paddingHorizontal: 2, marginTop: 7 },
  backLinkText: { fontSize: 12, fontWeight: '700' },
  reviewCard: { padding: 20 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  reviewCount: { fontSize: 11, fontWeight: '600' },
  reviewTitle: { fontSize: 23, lineHeight: 29, marginBottom: 4 },
  reviewCopy: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  reviewAnswers: { marginBottom: 16 },
  reviewRow: { minHeight: 42, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  reviewDimension: { width: 88, fontSize: 11, textTransform: 'capitalize' },
  reviewChoice: { flex: 1, fontSize: 13, fontWeight: '700' },
  reviewActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  editAnswersButton: { borderRadius: 9, minHeight: 44 },
  reviewGenerate: { minWidth: 188, minHeight: 46, borderRadius: 9 },
  mobilePalette: { borderTopWidth: 1, paddingTop: 15, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  mobileSwatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2 },
  hero: { flex: 1, minHeight: 570, flexDirection: 'row', alignItems: 'center', gap: 22, paddingTop: 24, paddingBottom: 32 },
  heroCompact: { flexDirection: 'column', alignItems: 'stretch', minHeight: 0, paddingTop: 48, paddingBottom: 30, gap: 24 },
  copyColumn: { flex: 1.05, zIndex: 2 },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  kickerDot: { width: 8, height: 8, borderRadius: 4 },
  kicker: { fontSize: 10, letterSpacing: 1.6, fontWeight: '700' },
  headline: { fontSize: 82, lineHeight: 83, letterSpacing: -5.2, fontWeight: '900', marginBottom: 16 },
  headlineCompact: { fontSize: 48, lineHeight: 49, letterSpacing: -2.6 },
  intro: { fontSize: 17, lineHeight: 25, maxWidth: 520, marginBottom: 22 },
  promptPanel: { width: '100%', borderWidth: 1, borderRadius: 14, padding: 20, maxWidth: 780 },
  fieldLabel: { fontSize: 14, fontWeight: '800', marginBottom: 9 },
  promptInput: { width: '100%', minHeight: 88, borderWidth: 1, borderRadius: 9, backgroundColor: 'transparent', padding: 14, fontSize: 16, lineHeight: 23, outlineWidth: 2 as any } as any,
  helper: { fontSize: 12, marginTop: 8, marginBottom: 12, lineHeight: 18 },
  examples: { width: '100%', maxWidth: 760, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 7, marginTop: 14, marginBottom: 0 },
  example: { maxWidth: '100%', minHeight: 40, paddingHorizontal: 12, borderWidth: 0, borderRadius: 12, justifyContent: 'center' },
  exampleText: { fontSize: 11, fontWeight: '600' },
  modelAndGo: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  modelWrap: { flex: 1, position: 'relative' },
  modelLabel: { fontSize: 9, letterSpacing: 1.3, fontWeight: '800', marginBottom: 5 },
  modelButton: { minHeight: 48, paddingHorizontal: 11, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  modelBadge: { fontSize: 9, letterSpacing: 0.6, fontWeight: '900' },
  modelName: { flex: 1, fontSize: 12, fontWeight: '700' },
  caret: { fontSize: 15 },
  modelMenu: { position: 'absolute', zIndex: 10, left: 0, right: 0, bottom: 54, borderWidth: 1, borderRadius: 13, overflow: 'hidden' },
  modelOption: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, borderBottomWidth: 1 },
  modelOptionName: { fontSize: 12, fontWeight: '800' },
  modelOptionDesc: { fontSize: 10, marginTop: 2 },
  generateButton: { minHeight: 50, minWidth: 150, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  generateText: { fontSize: 14, fontWeight: '800' },
  arrow: { fontSize: 17 },
  progress: { marginTop: 16, padding: 13, borderRadius: 12, gap: 10 },
  progressMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  progressLabel: { flex: 1, fontSize: 12, fontWeight: '700' },
  progressElapsed: { fontSize: 10, fontVariant: ['tabular-nums'] },
  progressTrack: { height: 7, borderRadius: 4, overflow: 'hidden' },
  progressFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 4 },
  progressHint: { fontSize: 10, lineHeight: 15 },
  error: { fontSize: 13, color: '#992f28', backgroundColor: '#f7d5ce', borderWidth: 1, borderColor: '#d99085', borderRadius: 10, padding: 10, marginTop: 12 },
  landingHero: { flex: 1, width: '100%', minHeight: 'calc(100vh - 188px)' as any, flexDirection: 'row', alignItems: 'stretch', gap: 0, position: 'relative' },
  landingHeroCompact: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', minHeight: 0, flexDirection: 'column', alignItems: 'stretch', gap: 0 },
  leftCircleField: { position: 'absolute', top: 0, bottom: 0, left: 0, width: '56%', zIndex: 0, opacity: 0.48, overflow: 'hidden' },
  leftCircleFieldCompact: { width: '100%', opacity: 0.2 },
  landingContentCompact: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', width: '100%', alignItems: 'stretch', paddingHorizontal: 0, paddingVertical: 31 },
  landingTitleCompact: { fontSize: 39, lineHeight: 42, letterSpacing: -1.8, maxWidth: 540 },
  landingDescriptionCompact: { fontSize: 14, lineHeight: 21 },
  signalTicker: { width: '100%', maxWidth: 680, minHeight: 27, marginHorizontal: 'auto' as any, marginTop: 4, paddingHorizontal: 10, borderWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  signalTickerCompact: { width: 'auto' as any, maxWidth: '100%', minHeight: 26, marginHorizontal: 14, marginTop: 0 },
  signalTickerText: { fontSize: 8, letterSpacing: 1.05, fontWeight: '800' },
  buildNote: { maxWidth: 690, width: '100%', minHeight: 46, marginTop: 14, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 10 },
  buildNoteIndex: { fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  buildNoteText: { maxWidth: 530, fontSize: 11, lineHeight: 17 },
  artColumn: { flex: 0.97, minWidth: 0, minHeight: 'calc(100vh - 188px)' as any, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  flowArtwork: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '35%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  artColumnCompact: { height: 'min(78vw, 440px)' as any, minHeight: 290, flexGrow: 0, flexShrink: 0, flexBasis: 'auto', width: '100%', marginBottom: 0 },
  artFrame: { width: '100%', height: '100%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  artCrosshair: { position: 'absolute', inset: 12 as any, borderWidth: 1, pointerEvents: 'none' as any },
  artIndex: { position: 'absolute', right: 0, bottom: 5, fontSize: 8, letterSpacing: 1, fontWeight: '700' },
  artLabel: { position: 'absolute', right: 22, top: 22, zIndex: 2, minHeight: 34, borderWidth: 0, borderRadius: 18, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  artLabelText: { fontSize: 9, letterSpacing: 1.2, fontWeight: '700' },
  artLabelMark: { fontSize: 10 },
  artCaption: { position: 'absolute', left: 22, bottom: 22, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 11, borderWidth: 0 },
  captionTitle: { fontSize: 13, fontWeight: '800' },
  captionText: { fontSize: 11, marginTop: 2 },
  bottomBar: { minHeight: 80, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 18, paddingTop: 17 },
  bottomBarCompact: { alignItems: 'flex-start', flexDirection: 'column', gap: 12, paddingTop: 16, paddingBottom: 4 },
  themeTitle: { fontSize: 12, fontWeight: '800' },
  themeSub: { fontSize: 10, marginTop: 3 },
  swatches: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  swatch: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  swatchCheck: { fontSize: 13, fontWeight: '900' },
  bottomHint: { marginLeft: 'auto', fontSize: 10, textAlign: 'right' },
  bottomHintCompact: { marginLeft: 0, textAlign: 'left' },
  landingPalette: { width: '100%', maxWidth: 1240, minHeight: 82, alignSelf: 'center', marginTop: 0, paddingHorizontal: 0 },
  outerFooter: { width: '100%', maxWidth: 1840, minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  outerFooterCompact: { flexWrap: 'wrap', justifyContent: 'flex-start', columnGap: 18, rowGap: 8, paddingVertical: 12 },
  pressedControl: { opacity: 0.82, transform: [{ scale: 0.97 }] },
  footerBrand: { color: '#eff2ed', fontSize: 12, fontWeight: '800' },
  footerText: { color: '#929b96', fontSize: 11 },
});
