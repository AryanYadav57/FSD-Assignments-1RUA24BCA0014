const fs = require('fs');

async function testGenerate() {
  try {
    console.log('Sending request to backend...');
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'zombie survival 3d',
        modelId: 'openai/gpt-oss-120b'
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Received response.');
    fs.writeFileSync('test-output.html', data.html);
    console.log('Saved to test-output.html');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGenerate();
