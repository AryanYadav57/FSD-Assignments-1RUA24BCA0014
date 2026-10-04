import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "AQ.Ab8RN6K3dqwJlZL2ITw4h0wt_kMq7I1YbHysteNE5matE1ytNQ",
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

async function main() {
  try {
    const res = await openai.chat.completions.create({
      model: "gemini-3.8-flash",
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5,
    });
    console.log("✅ WORKING! " + res.choices[0].message.content);
  } catch (e: any) {
    console.error("❌ ERROR: ", e.message);
  }
}
main();
