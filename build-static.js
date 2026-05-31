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

        // Fix all relative paths to absolute so assets load correctly
        // even when pages are served from a clean-URL subdirectory (e.g. /vrt/)
        const fixedHtml = html
            // 1. Any relative <script src="..."> that doesn't start with / or http
            //    This catches popup.js?v=3, lang.js, etc.
            .replace(/(<script\b[^>]*\ssrc=")(?!\/|http)([^"]+)"/gi, '$1/$2"')
            // 2. React/JS string literal image srcs: src: 'images/...'
            .replace(/src:\s*'(?!\/|http)((?:images|pods)[^']+)'/g, "src: '/$1'")
            // 3. Relative .html href links -> absolute (e.g. contact.html, vrt-solo.html)
            .replace(/href="(?!\/|http|#|mailto:|tel:)([^"]+\.html[^"]*)"/g, 'href="/$1"')
            // 4. Standard HTML src/href for asset directories (images/, pods/, css/, js/)
            .replace(/(src|href)="(?!\/)((images|pods|css|js)\/[^"]+)"/g, '$1="/$2"')
            // 5. CSS url() for asset paths
            .replace(/url\(['"]?(?!\/)((images|pods|css)\/[^'"\)]+)['"]?\)/g, "url('/$1')")
            // 6. data-img / data-src attributes with relative image paths
            .replace(/(data-(?:img|src))="(?!\/)((images|pods)\/[^"]+)"/g, '$1="/$2"')
            // 7. Plain JS string literals containing image paths (e.g. in arrays/vars)
            .replace(/'(?!\/|http)((?:images|pods)\/[^']+)'/g, "'/$1'");

        // Write explicit .html file
        if (page === 'index') {
            fs.writeFileSync(path.join(publicDir, 'index.html'), fixedHtml);
        } else {
            fs.writeFileSync(path.join(publicDir, `${page}.html`), fixedHtml);

            // Also write index.html inside a named directory for clean URL routing
            // e.g. /vrt/ -> public/vrt/index.html
            const pageDir = path.join(publicDir, page);
            if (!fs.existsSync(pageDir)) {
                fs.mkdirSync(pageDir, { recursive: true });
            }
            fs.writeFileSync(path.join(pageDir, 'index.html'), fixedHtml);
        }
        console.log(`✓ Built: ${page}`);
    } catch (err) {
        console.error(`✗ Error building ${page}:`, err.message);
    }
}

// Also build blog post pages from views/pages/blog/*.ejs
const blogViewsDir = path.join(viewsDir, 'blog');
if (fs.existsSync(blogViewsDir)) {
    const blogPublicDir = path.join(publicDir, 'blog');
    if (!fs.existsSync(blogPublicDir)) fs.mkdirSync(blogPublicDir, { recursive: true });

    const blogFiles = fs.readdirSync(blogViewsDir).filter(f => f.endsWith('.ejs'));
    for (const file of blogFiles) {
        const slug = file.replace('.ejs', '');
        const templatePath = path.join(blogViewsDir, file);
        const template = fs.readFileSync(templatePath, 'utf-8');
        try {
            const html = ejs.render(template, { page: 'blog' }, {
                filename: templatePath,
                views: [path.join(__dirname, 'views')]
            });
            const fixedHtml = html
                .replace(/(<script\b[^>]*\ssrc=")(?!\/|http)([^"]+)"/gi, '$1/$2"')
                .replace(/src:\s*'(?!\/|http)((?:images|pods)[^']+)'/g, "src: '/$1'")
                .replace(/href="(?!\/|http|#|mailto:|tel:)([^"]+\.html[^"]*)"/g, 'href="/$1"')
                .replace(/(src|href)="(?!\/)((images|pods|css|js)\/[^"]+)"/g, '$1="/$2"')
                .replace(/url\(['"]?(?!\/)((images|pods|css)\/[^'"\)]+)['"]?\)/g, "url('/$1')")
                .replace(/(data-(?:img|src))="(?!\/)((images|pods)\/[^"]+)"/g, '$1="/$2"')
                .replace(/'(?!\/|http)((?:images|pods)\/[^']+)'/g, "'/$1'");

            fs.writeFileSync(path.join(blogPublicDir, `${slug}.html`), fixedHtml);
            const slugDir = path.join(blogPublicDir, slug);
            if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
            fs.writeFileSync(path.join(slugDir, 'index.html'), fixedHtml);
            console.log(`✓ Built: blog/${slug}`);
        } catch (err) {
            console.error(`✗ Error building blog/${slug}:`, err.message);
        }
    }
}

console.log('Static build complete!');
