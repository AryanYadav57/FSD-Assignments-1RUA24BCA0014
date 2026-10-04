import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function main() {
  console.log(`Fetching models...`);
  const modelsRes = await openai.models.list();
  const allModels = modelsRes.data.map(m => m.id);
  
  // Filter models that might be good for coding/chat
  const candidates = allModels.filter(m => 
    m.includes('instruct') || 
    m.includes('coder') || 
    m.includes('flash') || 
    m.includes('llama') ||
    m.includes('mistral') ||
    m.includes('gemma') ||
    m.includes('yi')
  ).slice(0, 30); // Test up to 30

  console.log(`Testing ${candidates.length} candidate models...`);

  const working = [];

  for (const m of candidates) {
    try {
      const res = await openai.chat.completions.create({
        model: m,
        messages: [{ role: 'user', content: 'Say OK' }],
        max_tokens: 5,
      });
      console.log(`✅ ${m}`);
      working.push(m);
      if (working.length >= 5) break;
    } catch (err: any) {
      // console.log(`❌ ${m} - ${err?.status}`);
    }
  }

  console.log(`\nFound ${working.length} working models:`);
  console.log(working.join('\n'));
}

main();
