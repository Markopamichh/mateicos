/**
 * MATEICOS - Image Optimization Script
 * Converts JPG/PNG images to WebP format with compression
 * Generates responsive image sizes for better performance
 *
 * Usage: node optimize-images.js
 * Requirements: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    inputDir: './assets/images',
    outputDir: './assets/images/webp',
    quality: 80, // WebP quality (80 = good balance between size and quality)
    generateResponsive: true,
    responsiveSizes: [320, 640, 1280], // widths for responsive images
    formats: ['.jpg', '.jpeg', '.png'], // formats to convert
    skipFormats: ['.webp', '.svg'], // already optimized formats
};

// Create output directory if it doesn't exist
if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`✅ Created output directory: ${CONFIG.outputDir}`);
}

// Get all image files from input directory
function getImageFiles(dir) {
    const files = fs.readdirSync(dir);
    return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return CONFIG.formats.includes(ext);
    });
}

// Convert single image to WebP
async function convertToWebP(inputPath, outputPath, quality = CONFIG.quality) {
    try {
        await sharp(inputPath)
            .webp({ quality })
            .toFile(outputPath);

        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);
        const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);

        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`   Original: ${(inputStats.size / 1024).toFixed(2)} KB`);
        console.log(`   WebP: ${(outputStats.size / 1024).toFixed(2)} KB`);
        console.log(`   Savings: ${savings}%\n`);

        return {
            input: inputPath,
            output: outputPath,
            inputSize: inputStats.size,
            outputSize: outputStats.size,
            savings: parseFloat(savings)
        };
    } catch (error) {
        console.error(`❌ Error converting ${inputPath}:`, error.message);
        return null;
    }
}

// Generate responsive image sizes
async function generateResponsiveSizes(inputPath, baseName) {
    const results = [];

    for (const width of CONFIG.responsiveSizes) {
        const outputPath = path.join(CONFIG.outputDir, `${baseName}-${width}w.webp`);

        try {
            await sharp(inputPath)
                .resize(width, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: CONFIG.quality })
                .toFile(outputPath);

            const stats = fs.statSync(outputPath);
            console.log(`   📱 Generated ${width}w: ${(stats.size / 1024).toFixed(2)} KB`);
            results.push(outputPath);
        } catch (error) {
            console.error(`   ❌ Error generating ${width}w:`, error.message);
        }
    }

    return results;
}

// Main processing function
async function processImages() {
    console.log('🚀 MATEICOS Image Optimization Started\n');
    console.log(`Input Directory: ${CONFIG.inputDir}`);
    console.log(`Output Directory: ${CONFIG.outputDir}`);
    console.log(`WebP Quality: ${CONFIG.quality}%\n`);
    console.log('─'.repeat(60) + '\n');

    const imageFiles = getImageFiles(CONFIG.inputDir);
    console.log(`Found ${imageFiles.length} images to convert\n`);

    const results = [];
    let totalInputSize = 0;
    let totalOutputSize = 0;

    for (const file of imageFiles) {
        const inputPath = path.join(CONFIG.inputDir, file);
        const baseName = path.basename(file, path.extname(file));
        const outputPath = path.join(CONFIG.outputDir, `${baseName}.webp`);

        console.log(`Processing: ${file}`);

        // Convert main image to WebP
        const result = await convertToWebP(inputPath, outputPath);

        if (result) {
            results.push(result);
            totalInputSize += result.inputSize;
            totalOutputSize += result.outputSize;

            // Generate responsive sizes if enabled
            if (CONFIG.generateResponsive) {
                await generateResponsiveSizes(inputPath, baseName);
                console.log('');
            }
        }
    }

    // Print summary
    console.log('─'.repeat(60));
    console.log('\n📊 OPTIMIZATION SUMMARY\n');
    console.log(`Total Images Processed: ${results.length}`);
    console.log(`Original Total Size: ${(totalInputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`WebP Total Size: ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total Savings: ${((1 - totalOutputSize / totalInputSize) * 100).toFixed(2)}%`);
    console.log(`Space Saved: ${((totalInputSize - totalOutputSize) / 1024 / 1024).toFixed(2)} MB\n`);

    // Generate usage instructions
    console.log('─'.repeat(60));
    console.log('\n📝 HOW TO USE THE OPTIMIZED IMAGES\n');
    console.log('Replace your <img> tags with <picture> elements:');
    console.log('\nBefore:');
    console.log('<img src="assets/images/producto.jpg" alt="...">');
    console.log('\nAfter:');
    console.log('<picture>');
    console.log('  <source srcset="assets/images/webp/producto.webp" type="image/webp">');
    console.log('  <img src="assets/images/producto.jpg" alt="..." loading="lazy">');
    console.log('</picture>\n');

    console.log('✅ Optimization Complete!');
}

// Run the script
processImages().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
