const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const DIRS_TO_PROCESS = [
  path.join(__dirname, 'frontend/src'),
  path.join(__dirname, 'backend/controllers'),
  path.join(__dirname, 'backend/services'),
  path.join(__dirname, 'backend/utils'),
  path.join(__dirname, 'backend/routes')
];
const EXTENSIONS = ['.js', '.jsx'];

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (EXTENSIONS.includes(path.extname(fullPath))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        // Safely strip comments while preserving regexes and strings
        const cleanContent = strip(content).replace(/\n\s*\n/g, '\n');
        fs.writeFileSync(fullPath, cleanContent, 'utf8');
        console.log(`✓ Stripped comments from: ${fullPath}`);
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err);
      }
    }
  }
}

console.log('Starting comment removal...');
for (const dir of DIRS_TO_PROCESS) {
  processDirectory(dir);
}
console.log('Finished removing comments!');
