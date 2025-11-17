/**
 * Add hamburger menu button to all catalog pages
 */

const fs = require('fs');

const files = [
    './pages/mates.html',
    './pages/bombillas.html',
    './pages/yerberos.html',
    './pages/Accesosrios.html'
];

const hamburgerButton = `            <button class="hamburger" aria-label="Menú" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>`;

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');

    // Check if hamburger already exists
    if (html.includes('class="hamburger"')) {
        console.log(`⏭️  ${file} already has hamburger button`);
        return;
    }

    // Insert hamburger button after the logo div
    html = html.replace(
        /(<\/div>\s*<ul class="nav-menu">)/,
        `</div>\n${hamburgerButton}\n            <ul class="nav-menu">`
    );

    fs.writeFileSync(file, html, 'utf8');
    console.log(`✅ Added hamburger to: ${file}`);
});

console.log('\n✅ All pages updated with hamburger menu!');
