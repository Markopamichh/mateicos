/**
 * MATEICOS - HTML Image Tag Optimizer
 * Automatically adds loading="lazy" and width/height to all <img> tags
 *
 * Usage: node optimize-html.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    files: [
        './pages/mates.html',
        './pages/bombillas.html',
        './pages/yerberos.html',
        './pages/Accesosrios.html'
    ],
    defaultWidth: 300,
    defaultHeight: 250,
    addDefer: true
};

function optimizeImageTags(html) {
    let modified = html;
    let count = 0;

    // Pattern to match img tags that don't have loading or width/height
    const imgPattern = /<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/gi;

    modified = modified.replace(imgPattern, (match, before, src, after) => {
        // Skip if already has loading attribute
        if (match.includes('loading=')) {
            return match;
        }

        // Skip logo images (don't lazy load logos in header)
        if (src.includes('logo') && before.includes('logo')) {
            return match;
        }

        let newTag = match;
        const hasWidth = match.includes('width=');
        const hasHeight = match.includes('height=');
        const hasLoading = match.includes('loading=');

        // Build new attributes
        let newAttrs = '';
        if (!hasWidth) newAttrs += ` width="${CONFIG.defaultWidth}"`;
        if (!hasHeight) newAttrs += ` height="${CONFIG.defaultHeight}"`;
        if (!hasLoading) newAttrs += ' loading="lazy"';

        // Insert new attributes before the closing >
        newTag = match.replace('>', `${newAttrs}>`);
        count++;

        return newTag;
    });

    return { html: modified, count };
}

function addDeferToScripts(html) {
    let modified = html;
    let count = 0;

    // Pattern to match script tags without defer
    const scriptPattern = /<script\s+src="([^"]+)"([^>]*)><\/script>/gi;

    modified = modified.replace(scriptPattern, (match, src, attrs) => {
        // Skip if already has defer or async
        if (match.includes('defer') || match.includes('async')) {
            return match;
        }

        // Add defer
        const newTag = `<script src="${src}"${attrs} defer></script>`;
        count++;
        return newTag;
    });

    return { html: modified, count };
}

function processFile(filePath) {
    console.log(`\n📄 Processing: ${filePath}`);

    try {
        // Read file
        const html = fs.readFileSync(filePath, 'utf8');

        // Optimize images
        const imgResult = optimizeImageTags(html);

        // Add defer to scripts
        const scriptResult = addDeferToScripts(imgResult.html);

        // Write back
        fs.writeFileSync(filePath, scriptResult.html, 'utf8');

        console.log(`   ✅ ${imgResult.count} images optimized`);
        console.log(`   ✅ ${scriptResult.count} scripts deferred`);

        return {
            file: path.basename(filePath),
            images: imgResult.count,
            scripts: scriptResult.count
        };
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return null;
    }
}

// Main
console.log('🚀 HTML Image Optimizer Starting...\n');

const results = [];
let totalImages = 0;
let totalScripts = 0;

for (const file of CONFIG.files) {
    const result = processFile(file);
    if (result) {
        results.push(result);
        totalImages += result.images;
        totalScripts += result.scripts;
    }
}

console.log('\n' + '─'.repeat(60));
console.log('\n📊 OPTIMIZATION SUMMARY\n');
console.log(`Files Processed: ${results.length}`);
console.log(`Total Images Optimized: ${totalImages}`);
console.log(`Total Scripts Deferred: ${totalScripts}\n`);

results.forEach(r => {
    console.log(`  ${r.file}: ${r.images} imgs, ${r.scripts} scripts`);
});

console.log('\n✅ All files optimized!');
console.log('\nNext: Images now have loading="lazy" and width/height attributes');
console.log('This will significantly reduce initial page load and prevent layout shift!\n');
