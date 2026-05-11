const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldLink = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap';
const newLink = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';

const oldVars = "--fh:'Space Grotesk',sans-serif;--fb:'DM Sans',sans-serif;";
const newVars = "--fh:'Poppins',sans-serif;--fb:'Poppins',sans-serif;";

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const hasOldLink = content.includes(oldLink);
  const hasOldVars = content.includes(oldVars);
  
  if (hasOldLink || hasOldVars) {
      content = content.replace(oldLink, newLink);
      content = content.replace(oldVars, newVars);
      fs.writeFileSync(filePath, content);
      updatedCount++;
  }
}

console.log(`Replaced fonts in ${updatedCount} files.`);
