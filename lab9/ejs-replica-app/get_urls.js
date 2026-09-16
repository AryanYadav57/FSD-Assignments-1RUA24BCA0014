const https = require('https');

const urls = [
  'https://unsplash.com/photos/mEZ3PoFGs_k/download'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(res.headers);
  }).on('error', (e) => {
    console.error(e);
  });
});
