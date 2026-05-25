const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const viewsDir = path.join(__dirname, 'views', 'pages');
const publicDir = path.join(__dirname, 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Read all EJS files in views/pages
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.ejs'));

for (const file of files) {
    const page = file.replace('.ejs', '');
    const templatePath = path.join(viewsDir, file);
    const template = fs.readFileSync(templatePath, 'utf-8');

    try {
        // Render the EJS template to HTML
        const html = ejs.render(template, { page: page }, {
            filename: templatePath,
            views: [path.join(__dirname, 'views')]
        });

        // Write to public directory
        const outPath = path.join(publicDir, `${page}.html`);
        fs.writeFileSync(outPath, html);
        console.log(`✓ Built ${page}.html`);
    } catch (err) {
        console.error(`✗ Error building ${page}.html:`, err.message);
    }
}

console.log('Static build complete!');
