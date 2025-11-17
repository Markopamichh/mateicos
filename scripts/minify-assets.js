/**
 * MATEICOS - Asset Minification Script
 * Minifies CSS and JavaScript files for production
 *
 * Usage:
 *   node minify-assets.js       (minifies both CSS and JS)
 *   node minify-assets.js css   (CSS only)
 *   node minify-assets.js js    (JS only)
 */

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify: minifyJS } = require('terser');

// Configuration
const CONFIG = {
    css: {
        input: [
            './css/styles.css',
            './css/nav.css',
            './css/cart.css',
            './css/subcategorias.css'
        ],
        outputDir: './css/min'
    },
    js: {
        input: [
            './js/main.js'
        ],
        outputDir: './js/min'
    }
};

// Create output directories
function createOutputDirs() {
    if (!fs.existsSync(CONFIG.css.outputDir)) {
        fs.mkdirSync(CONFIG.css.outputDir, { recursive: true });
    }
    if (!fs.existsSync(CONFIG.js.outputDir)) {
        fs.mkdirSync(CONFIG.js.outputDir, { recursive: true });
    }
}

// Minify CSS files
async function minifyCSS() {
    console.log('\n🎨 Minifying CSS Files...\n');

    const cleanCSS = new CleanCSS({
        level: 2,
        returnPromise: false
    });

    let totalOriginalSize = 0;
    let totalMinifiedSize = 0;
    const results = [];

    for (const file of CONFIG.css.input) {
        if (!fs.existsSync(file)) {
            console.log(`   ⚠️  ${file} not found, skipping...`);
            continue;
        }

        const css = fs.readFileSync(file, 'utf8');
        const originalSize = Buffer.byteLength(css, 'utf8');

        const output = cleanCSS.minify(css);

        if (output.errors && output.errors.length > 0) {
            console.log(`   ❌ Error minifying ${file}:`);
            console.log(output.errors);
            continue;
        }

        const minifiedSize = Buffer.byteLength(output.styles, 'utf8');
        const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(2);

        const fileName = path.basename(file, '.css');
        const outputFile = path.join(CONFIG.css.outputDir, `${fileName}.min.css`);

        fs.writeFileSync(outputFile, output.styles, 'utf8');

        console.log(`✅ ${path.basename(file)}`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`   Minified: ${(minifiedSize / 1024).toFixed(2)} KB`);
        console.log(`   Savings: ${savings}%\n`);

        totalOriginalSize += originalSize;
        totalMinifiedSize += minifiedSize;

        results.push({
            file: path.basename(file),
            originalSize,
            minifiedSize,
            savings: parseFloat(savings)
        });
    }

    return { totalOriginalSize, totalMinifiedSize, results };
}

// Minify JavaScript files
async function minifyJavaScript() {
    console.log('\n📜 Minifying JavaScript Files...\n');

    let totalOriginalSize = 0;
    let totalMinifiedSize = 0;
    const results = [];

    for (const file of CONFIG.js.input) {
        if (!fs.existsSync(file)) {
            console.log(`   ⚠️  ${file} not found, skipping...`);
            continue;
        }

        const code = fs.readFileSync(file, 'utf8');
        const originalSize = Buffer.byteLength(code, 'utf8');

        try {
            const result = await minifyJS(code, {
                compress: {
                    dead_code: true,
                    drop_console: true,  // Remove console.log in production
                    drop_debugger: true,
                    passes: 2
                },
                mangle: {
                    toplevel: false  // Don't mangle top-level variable names (safer)
                },
                format: {
                    comments: false  // Remove all comments
                }
            });

            const minifiedCode = result.code;
            const minifiedSize = Buffer.byteLength(minifiedCode, 'utf8');
            const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(2);

            const fileName = path.basename(file, '.js');
            const outputFile = path.join(CONFIG.js.outputDir, `${fileName}.min.js`);

            fs.writeFileSync(outputFile, minifiedCode, 'utf8');

            console.log(`✅ ${path.basename(file)}`);
            console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
            console.log(`   Minified: ${(minifiedSize / 1024).toFixed(2)} KB`);
            console.log(`   Savings: ${savings}%\n`);

            totalOriginalSize += originalSize;
            totalMinifiedSize += minifiedSize;

            results.push({
                file: path.basename(file),
                originalSize,
                minifiedSize,
                savings: parseFloat(savings)
            });
        } catch (error) {
            console.log(`   ❌ Error minifying ${file}:`, error.message);
        }
    }

    return { totalOriginalSize, totalMinifiedSize, results };
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    const mode = args[0] || 'all';

    console.log('🚀 MATEICOS Asset Minification\n');

    createOutputDirs();

    let cssResults, jsResults;

    if (mode === 'all' || mode === 'css') {
        cssResults = await minifyCSS();
    }

    if (mode === 'all' || mode === 'js') {
        jsResults = await minifyJavaScript();
    }

    // Print summary
    console.log('─'.repeat(60));
    console.log('\n📊 MINIFICATION SUMMARY\n');

    if (cssResults) {
        const cssSavings = ((1 - cssResults.totalMinifiedSize / cssResults.totalOriginalSize) * 100).toFixed(2);
        console.log(`CSS Files:`);
        console.log(`  Total Original: ${(cssResults.totalOriginalSize / 1024).toFixed(2)} KB`);
        console.log(`  Total Minified: ${(cssResults.totalMinifiedSize / 1024).toFixed(2)} KB`);
        console.log(`  Total Savings: ${cssSavings}% (${((cssResults.totalOriginalSize - cssResults.totalMinifiedSize) / 1024).toFixed(2)} KB)\n`);
    }

    if (jsResults) {
        const jsSavings = ((1 - jsResults.totalMinifiedSize / jsResults.totalOriginalSize) * 100).toFixed(2);
        console.log(`JavaScript Files:`);
        console.log(`  Total Original: ${(jsResults.totalOriginalSize / 1024).toFixed(2)} KB`);
        console.log(`  Total Minified: ${(jsResults.totalMinifiedSize / 1024).toFixed(2)} KB`);
        console.log(`  Total Savings: ${jsSavings}% (${((jsResults.totalOriginalSize - jsResults.totalMinifiedSize) / 1024).toFixed(2)} KB)\n`);
    }

    console.log('✅ Minification Complete!\n');
    console.log('📝 NEXT STEPS:');
    console.log('   1. Test the minified files in development');
    console.log('   2. Update HTML to use .min.css and .min.js files');
    console.log('   3. Deploy to production\n');
    console.log('   Minified files location:');
    console.log(`   - CSS: ${CONFIG.css.outputDir}/`);
    console.log(`   - JS: ${CONFIG.js.outputDir}/\n`);
}

// Run
main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
