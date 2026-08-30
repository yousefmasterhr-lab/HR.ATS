const https = require('https');

https.get('https://registry.npmjs.org/react', (res) => {
  console.log('NPM REGISTRY STATUS:', res.statusCode);
}).on('error', (e) => {
  console.error('NPM REGISTRY ERROR:', e.message);
});

https.get('https://registry.npmmirror.com/react', (res) => {
  console.log('MIRROR STATUS:', res.statusCode);
}).on('error', (e) => {
  console.error('MIRROR ERROR:', e.message);
});
