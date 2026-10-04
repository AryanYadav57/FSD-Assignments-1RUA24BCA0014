import { generateGameHtml } from './src/services/nvidia';

async function main() {
  try {
    console.log('Testing generation...');
    const result = await generateGameHtml('A simple snake game');
    console.log('Success!', result.substring(0, 100) + '...');
  } catch (error) {
    console.error('Failed:', error);
  }
}

main();
