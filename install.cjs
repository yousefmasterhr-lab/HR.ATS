const { execSync } = require('child_process');

console.log('Running npm install via mirror registry...');
try {
  const output = execSync('npm install --registry=https://registry.npmmirror.com', { stdio: 'inherit', encoding: 'utf-8' });
  console.log('NPM INSTALL SUCCESSFUL!');
} catch (err) {
  console.error('Error during npm install:', err);
}
