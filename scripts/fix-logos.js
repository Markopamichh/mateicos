/**
 * Fix logo lazy loading - remove from header logos, fix footer dimensions
 */

const fs = require('fs');

const files = [
    './pages/bombillas.html',
    './pages/yerberos.html',
    './pages/Accesosrios.html'
];

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');

    // Remove lazy loading from header logo
    html = html.replace(
        /<img src="\.\.\/assets\/images\/logo1\.webp" alt="Mateicos - Tienda de Mates Premium" width="150" height="50" loading="lazy">/g,
        '<img src="../assets/images/logo1.webp" alt="Mateicos - Tienda de Mates Premium" width="150" height="50">'
    );

    // Fix footer logo dimensions
    html = html.replace(
        /<img src="\.\.\/assets\/images\/logomateicos\.webp" alt="Mateicos Logo" class="footer-logo" width="300" height="250" loading="lazy">/g,
        '<img src="../assets/images/logomateicos.webp" alt="Mateicos Logo" class="footer-logo" width="150" height="50" loading="lazy">'
    );

    fs.writeFileSync(file, html, 'utf8');
    console.log(`✅ Fixed: ${file}`);
});

console.log('\n✅ All logos corrected!');
