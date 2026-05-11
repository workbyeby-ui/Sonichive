const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const original = content;
  
  // Replace bold font weights with normal (400)
  content = content.replace(/font-weight:\s*800/g, 'font-weight:400');
  content = content.replace(/font-weight:\s*700/g, 'font-weight:400');
  content = content.replace(/font-weight:\s*600/g, 'font-weight:400');
  
  if (original !== content) {
      fs.writeFileSync(filePath, content);
      count++;
  }
}

console.log('Removed bold fonts in ' + count + ' files.');
