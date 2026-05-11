const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const original = content;
  
  // Adding word-spacing to the body element
  content = content.replace(/body\s*\{/, 'body{word-spacing:0.15em;');
  
  if (original !== content) {
      fs.writeFileSync(filePath, content);
      count++;
  }
}

console.log('Added word-spacing in ' + count + ' files.');
