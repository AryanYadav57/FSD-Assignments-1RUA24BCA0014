'use dom';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEffect, useCallback, useState } from 'react';

const lowlight = createLowlight(common);

// ─── Props (passed from React Native side) ─────────────────────────────────
interface TiptapEditorProps {
  initialContent: any; // Tiptap JSON or null
  placeholder?: string;
  onUpdate: (json: any, text: string) => void;
  onReady?: () => void;
  dom?: import('expo/dom').DOMProps;
}

// ─── Slash command menu state ────────────────────────────────────────────────
const SLASH_COMMANDS = [
  { label: 'Heading 1', icon: 'H1', run: (editor: any) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: 'Heading 2', icon: 'H2', run: (editor: any) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: 'Heading 3', icon: 'H3', run: (editor: any) => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  { label: 'Bullet List', icon: '•', run: (editor: any) => editor.chain().focus().toggleBulletList().run() },
  { label: 'Numbered List', icon: '1.', run: (editor: any) => editor.chain().focus().toggleOrderedList().run() },
  { label: 'Checklist', icon: '☑', run: (editor: any) => editor.chain().focus().toggleTaskList().run() },
  { label: 'Code Block', icon: '<>', run: (editor: any) => editor.chain().focus().toggleCodeBlock().run() },
  { label: 'Blockquote', icon: '"', run: (editor: any) => editor.chain().focus().toggleBlockquote().run() },
  { label: 'Divider', icon: '—', run: (editor: any) => editor.chain().focus().setHorizontalRule().run() },
];

export default function TiptapEditor({
  initialContent,
  placeholder = 'Start writing… type / for commands',
  onUpdate,
  onReady,
}: TiptapEditorProps) {
  const [slashMenu, setSlashMenu] = useState<{ open: boolean; filter: string; index: number }>({
    open: false,
    filter: '',
    index: 0,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We use CodeBlockLowlight instead
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: 'synapse-link' },
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: initialContent || '',
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'synapse-editor',
        spellcheck: 'true',
      },
      handleKeyDown: (view, event) => {
        // Handle slash command keyboard
        if (slashMenu.open) {
          if (event.key === 'ArrowDown') {
            setSlashMenu((prev) => ({ ...prev, index: (prev.index + 1) % filteredCommands(prev.filter).length }));
            return true;
          }
          if (event.key === 'ArrowUp') {
            setSlashMenu((prev) => ({
              ...prev,
              index: Math.max(0, prev.index - 1),
            }));
            return true;
          }
          if (event.key === 'Enter') {
            return true; // handled in onKeyDown below
          }
          if (event.key === 'Escape') {
            setSlashMenu({ open: false, filter: '', index: 0 });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const text = editor.getText();
      onUpdate(json, text);

      // Check for slash command trigger
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(Math.max(0, from - 30), from, '\n', '\n');
      const slashIdx = textBefore.lastIndexOf('/');

      if (slashIdx !== -1) {
        const filter = textBefore.slice(slashIdx + 1);
        if (!filter.includes(' ') && !filter.includes('\n')) {
          setSlashMenu({ open: true, filter, index: 0 });
          return;
        }
      }
      setSlashMenu({ open: false, filter: '', index: 0 });
    },
  });

  useEffect(() => {
    if (editor && onReady) onReady();
  }, [editor]);

  // Update content if it changes externally (e.g., switching notes)
  useEffect(() => {
    if (editor && initialContent && JSON.stringify(editor.getJSON()) !== JSON.stringify(initialContent)) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent]);

  const filteredCommands = useCallback(
    (filter: string) =>
      SLASH_COMMANDS.filter((cmd) =>
        cmd.label.toLowerCase().startsWith(filter.toLowerCase())
      ),
    []
  );

  const runSlashCommand = useCallback(
    (cmd: (typeof SLASH_COMMANDS)[number]) => {
      if (!editor) return;
      // Delete the slash + filter text
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(
        Math.max(0, from - slashMenu.filter.length - 1),
        from
      );
      const deleteCount = slashMenu.filter.length + 1; // +1 for '/'
      editor
        .chain()
        .focus()
        .deleteRange({ from: from - deleteCount, to: from })
        .run();
      cmd.run(editor);
      setSlashMenu({ open: false, filter: '', index: 0 });
    },
    [editor, slashMenu.filter]
  );

  const cmds = filteredCommands(slashMenu.filter);

  return (
    <>
      <style>{EDITOR_STYLES}</style>

      {/* Formatting Toolbar */}
      {editor && <Toolbar editor={editor} />}

      {/* Editor */}
      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>

      {/* Slash Command Menu */}
      {slashMenu.open && cmds.length > 0 && (
        <div className="slash-menu">
          <div className="slash-menu-header">Insert block</div>
          {cmds.map((cmd, i) => (
            <button
              key={cmd.label}
              className={`slash-item ${i === slashMenu.index ? 'slash-item-active' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                runSlashCommand(cmd);
              }}
            >
              <span className="slash-item-icon">{cmd.icon}</span>
              <span>{cmd.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Formatting Toolbar ───────────────────────────────────────────────────────
function Toolbar({ editor }: { editor: any }) {
  const buttons = [
    { label: 'B', title: 'Bold', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { label: 'I', title: 'Italic', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { label: 'U', title: 'Underline', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { label: 'S', title: 'Strikethrough', action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { label: '|', title: '', action: () => {}, active: false, divider: true },
    { label: 'H1', title: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { label: 'H2', title: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { label: 'H3', title: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { label: '|', title: '', action: () => {}, active: false, divider: true },
    { label: '•', title: 'Bullet List', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { label: '1.', title: 'Numbered List', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { label: '☑', title: 'Checklist', action: () => editor.chain().focus().toggleTaskList().run(), active: editor.isActive('taskList') },
    { label: '|', title: '', action: () => {}, active: false, divider: true },
    { label: '<>', title: 'Code Block', action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock') },
    { label: '"', title: 'Blockquote', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { label: '—', title: 'Divider', action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
  ];

  return (
    <div className="toolbar">
      {buttons.map((btn, i) =>
        btn.divider ? (
          <div key={i} className="toolbar-divider" />
        ) : (
          <button
            key={i}
            title={btn.title}
            className={`toolbar-btn ${btn.active ? 'toolbar-btn-active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              btn.action();
            }}
          >
            {btn.label}
          </button>
        )
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const EDITOR_STYLES = `
  :root {
    --bg:       #EBE9E1;
    --surface:  rgba(255,255,255,0.5);
    --border:   rgba(0,0,0,0.07);
    --text:     #1C1C1C;
    --muted:    #6B6A65;
    --accent:   #FF6B35;
    --gold:     #D4A336;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg:       #141210;
      --surface:  rgba(255,255,255,0.04);
      --border:   rgba(255,255,255,0.08);
      --text:     #F0EDE6;
      --muted:    #8C8A84;
      --accent:   #FF7A47;
      --gold:     #E0B347;
    }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--text);
    padding: 0;
    transition: background 0.2s, color 0.2s;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 8px 16px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    gap: 2px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .toolbar-btn {
    padding: 4px 8px;
    border-radius: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    transition: background 0.15s, color 0.15s;
    min-width: 28px;
    text-align: center;
  }
  .toolbar-btn:hover { background: var(--border); color: var(--text); }
  .toolbar-btn-active { background: var(--text) !important; color: var(--bg) !important; }
  .toolbar-divider { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }

  .editor-container {
    padding: 32px 48px;
    min-height: calc(100vh - 52px);
  }

  .synapse-editor {
    outline: none;
    min-height: 400px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text);
  }

  /* Placeholder */
  .synapse-editor p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    color: var(--muted);
    opacity: 0.5;
    pointer-events: none;
    float: left;
    height: 0;
  }

  /* Headings */
  .synapse-editor h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.25;
    margin: 1.5rem 0 0.75rem;
    color: var(--text);
  }
  .synapse-editor h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 1.25rem 0 0.5rem;
    color: var(--text);
  }
  .synapse-editor h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 1rem 0 0.4rem;
    color: var(--text);
  }

  /* Paragraphs */
  .synapse-editor p { margin: 0.5rem 0; }

  /* Lists */
  .synapse-editor ul, .synapse-editor ol { padding-left: 1.5rem; margin: 0.5rem 0; }
  .synapse-editor li { margin: 0.2rem 0; }

  /* Task list */
  .synapse-editor ul[data-type="taskList"] { list-style: none; padding-left: 0; }
  .synapse-editor ul[data-type="taskList"] li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 0.3rem 0;
  }
  .synapse-editor ul[data-type="taskList"] li > label {
    margin-top: 2px;
    flex-shrink: 0;
  }
  .synapse-editor ul[data-type="taskList"] li > label input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border: 1.5px solid var(--muted);
    border-radius: 4px;
    cursor: pointer;
    background-color: transparent;
    transition: all 0.2s ease;
    margin: 0;
    display: grid;
    place-content: center;
  }
  .synapse-editor ul[data-type="taskList"] li > label input[type="checkbox"]:hover {
    border-color: var(--text);
  }
  .synapse-editor ul[data-type="taskList"] li > label input[type="checkbox"]:checked {
    background-color: var(--accent);
    border-color: var(--accent);
  }
  .synapse-editor ul[data-type="taskList"] li > label input[type="checkbox"]::before {
    content: "";
    width: 9px;
    height: 9px;
    transform: scale(0);
    transition: 120ms transform cubic-bezier(0.4, 0, 0.2, 1);
    background-color: var(--bg);
    transform-origin: center;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }
  .synapse-editor ul[data-type="taskList"] li > label input[type="checkbox"]:checked::before {
    transform: scale(1);
  }
  .synapse-editor ul[data-type="taskList"] li > div { flex: 1; }
  .synapse-editor ul[data-type="taskList"] li[data-checked="true"] > div {
    text-decoration: line-through;
    color: var(--muted);
  }

  /* Code block */
  .synapse-editor pre {
    background: var(--surface);
    border-radius: 8px;
    padding: 16px;
    margin: 1rem 0;
    overflow-x: auto;
    border: 1px solid var(--border);
  }
  .synapse-editor pre code {
    font-family: 'JetBrains Mono', 'Fira Code', Menlo, monospace;
    font-size: 13px;
    color: var(--text);
    background: none;
    padding: 0;
  }
  .synapse-editor code {
    background: var(--surface);
    border-radius: 4px;
    padding: 2px 6px;
    font-family: monospace;
    font-size: 0.9em;
    border: 1px solid var(--border);
  }

  /* Blockquote */
  .synapse-editor blockquote {
    border-left: 3px solid var(--gold);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--muted);
    font-style: italic;
  }

  /* Horizontal rule */
  .synapse-editor hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 2rem 0;
  }

  /* Links */
  .synapse-link {
    color: var(--accent);
    text-decoration: underline;
    cursor: pointer;
  }

  /* Slash Command Menu */
  .slash-menu {
    position: fixed;
    z-index: 100;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 6px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.20);
    min-width: 200px;
    bottom: 20px;
    left: 48px;
  }
  .slash-menu-header {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    font-weight: 600;
    padding: 4px 10px 8px;
  }
  .slash-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 7px 10px;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    color: var(--text);
    text-align: left;
    transition: background 0.1s;
  }
  .slash-item:hover, .slash-item-active { background: var(--border); }
  .slash-item-icon {
    width: 24px;
    height: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: var(--muted);
    flex-shrink: 0;
  }

  /* Syntax highlighting */
  .hljs-comment, .hljs-quote { color: var(--muted); }
  .hljs-keyword, .hljs-selector-tag { color: var(--accent); font-weight: 600; }
  .hljs-string, .hljs-attr { color: var(--gold); }
  .hljs-number, .hljs-literal { color: var(--text); font-weight: 600; }
  .hljs-built_in { color: var(--muted); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  /* Selection */
  ::selection { background: rgba(255,107,53,0.20); }

  /* Focus ring */
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
`;
