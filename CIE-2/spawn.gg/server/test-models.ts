import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Test the models visible in the browser
const MODELS = [
  'deepseek-ai/deepseek-v4.1-flash',
  'deepseek-ai/deepseek-v4-pro-0813',  // you had this open in browser
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'mistralai/mistral-large-2-instruct',
  'nvidia/nemotron-4-340b-instruct',
];

async function test(id: string) {
  try {
    const res = await openai.chat.completions.create({
      model: id,
      messages: [{ role: 'user', content: 'Reply with only the word: OK' }],
      max_tokens: 10,
    });
    const reply = res.choices[0]?.message?.content?.trim();
    console.log(`✅  WORKING: ${id}  →  "${reply}"`);
    return true;
  } catch (err: any) {
    const status = err?.status ?? '???';
    let detail = '';
    try { detail = err?.message?.slice(0, 60) ?? ''; } catch {}
    console.log(`❌  [${status}] ${id}  ${detail}`);
    return false;
  }
}

async function main() {
  console.log(`\n🔑 Key: ${process.env.NVIDIA_API_KEY?.slice(0, 25)}...\n`);
  
  const CANDIDATES = [
    'deepseek-ai/deepseek-v4.1-flash',
    'deepseek-ai/deepseek-coder-6.7b-instruct',
    'meta/codellama-70b',
    'meta/llama-3.1-405b-instruct', // might not exist
    'mistralai/mistral-large-2-instruct',
    'mistralai/codestral-22b-instruct-v0.1',
    'ibm/granite-34b-code-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'google/gemma-4-31b-it'
  ];

  for (const m of CANDIDATES) {
    try {
      const res = await openai.chat.completions.create({
        model: m,
        messages: [{ role: 'user', content: 'Write a 1-line HTML hello world.' }],
        max_tokens: 15,
      });
      console.log(`✅ ${m}`);
    } catch (err: any) {
      console.log(`❌ ${m} - ${err?.status} ${err?.message?.slice(0, 40)}`);
    }
  }
}
main();
