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
        if (page === 'index') {
            fs.writeFileSync(path.join(publicDir, 'index.html'), html);
        } else {
            // Write explicit .html
            fs.writeFileSync(path.join(publicDir, `${page}.html`), html);

            // Write index.html inside a directory matching the page name for clean URLs
            const pageDir = path.join(publicDir, page);
            if (!fs.existsSync(pageDir)) {
                fs.mkdirSync(pageDir, { recursive: true });
            }
            fs.writeFileSync(path.join(pageDir, 'index.html'), html);
        }
        console.log(`✓ Built clean URLs for ${page}`);
    } catch (err) {
        console.error(`✗ Error building ${page}.html:`, err.message);
    }
}

console.log('Static build complete!');
