import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const candidates = [
  'deepseek-ai/deepseek-v4.1-flash',
  'mistralai/mistral-large-2-instruct',
  'meta/llama-3.1-70b-instruct',
  'google/gemma-3-12b-it',
  'nvidia/llama-3.1-nemotron-70b-instruct',
];

async function testModel(m: string) {
  try {
    const res = await openai.chat.completions.create({
      model: m,
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5,
    });
    console.log(`✅ ${m} - ${res.choices[0]?.message?.content}`);
    return true;
  } catch (err: any) {
    console.log(`❌ ${m} - ${err?.status} - ${err?.message?.slice(0, 50)}`);
    return false;
  }
}

async function main() {
  for (const m of candidates) {
    await testModel(m);
  }
}

main();
