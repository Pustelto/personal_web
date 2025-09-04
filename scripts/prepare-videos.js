const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const { globby } = require('globby');
const path = require('path');

// Configuration
const CONFIG = {
  // Source directory for raw videos (you'll put your original videos here)
  sourceDir: './src/blog/**/raw-videos',
  // File patterns to process
  patterns: ['**/*.{mp4,mov,avi,mkv,webm}'],
  // Video quality settings
  qualities: [
    {
      suffix: '720p',
      scale: '?x720',
      crf: 23
    },
    {
      suffix: '1080p', 
      scale: '?x1080',
      crf: 22
    }
  ],
  // WebM settings
  webm: {
    crf: 32,
    preset: 'medium'
  }
};

async function processVideo(inputPath) {
  const dir = path.dirname(inputPath);
  const outputDir = path.join(dir, '../'); // Output to parent directory (alongside blog post)
  const baseName = path.basename(inputPath, path.extname(inputPath));
  
  console.log(`🎥 Processing: ${inputPath}`);
  console.log(`📁 Output directory: ${outputDir}`);
  
  await fs.ensureDir(outputDir);
  
  // Process each quality
  for (const quality of CONFIG.qualities) {
    const outputPath = path.join(outputDir, `${baseName}-${quality.suffix}.mp4`);
    
    console.log(`  → Generating ${quality.suffix} MP4...`);
    
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .videoBitrate('1000k')
        .audioBitrate('128k')
        .size(quality.scale)
        .outputOptions([
          '-profile:v high',
          '-pix_fmt yuv420p',
          '-movflags +faststart',
          `-crf ${quality.crf}`,
          '-preset slow'
        ])
        .on('end', () => {
          console.log(`    ✅ ${quality.suffix} MP4 complete`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`    ❌ ${quality.suffix} MP4 failed:`, err.message);
          reject(err);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            process.stdout.write(`\r    Progress: ${Math.round(progress.percent)}%`);
          }
        })
        .save(outputPath);
    });
    
    // Generate WebM version
    const webmPath = path.join(outputDir, `${baseName}-${quality.suffix}.webm`);
    console.log(`\n  → Generating ${quality.suffix} WebM...`);
    
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libvpx-vp9')
        .audioCodec('libopus')
        .size(quality.scale)
        .outputOptions([
          `-crf ${CONFIG.webm.crf}`,
          '-b:v 0',
          '-row-mt 1',
          '-b:a 96k'
        ])
        .on('end', () => {
          console.log(`    ✅ ${quality.suffix} WebM complete`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`    ❌ ${quality.suffix} WebM failed:`, err.message);
          reject(err);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            process.stdout.write(`\r    Progress: ${Math.round(progress.percent)}%`);
          }
        })
        .save(webmPath);
    });
  }
  
  // Generate poster image from first quality
  const posterPath = path.join(outputDir, `${baseName}-poster.jpg`);
  console.log(`\n  → Generating poster image...`);
  
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: ['1'], // 1 second in
        filename: `${baseName}-poster.jpg`,
        folder: outputDir,
        size: '1280x?'
      })
      .on('end', () => {
        console.log(`    ✅ Poster image complete`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`    ❌ Poster generation failed:`, err.message);
        reject(err);
      });
  });
  
  console.log(`\n✨ Completed processing: ${baseName}\n`);
}

async function main() {
  try {
    console.log('🎬 Starting video processing...\n');
    console.log(`📂 Looking for videos in: ${CONFIG.sourceDir}`);
    console.log(`🔍 File patterns: ${CONFIG.patterns.join(', ')}`);
    console.log(`📐 Qualities: ${CONFIG.qualities.map(q => q.suffix).join(', ')}\n`);
    
    const files = await globby([`${CONFIG.sourceDir}/${CONFIG.patterns[0]}`], {
      absolute: true
    });
    
    if (files.length === 0) {
      console.log('🤷 No video files found.');
      console.log('\n💡 To use this script:');
      console.log('1. Create a "raw-videos" folder in your blog post directory');
      console.log('2. Put your original video files there');
      console.log('3. Run this script to generate optimized versions');
      console.log('\nExample structure:');
      console.log('src/blog/my-post/raw-videos/demo.mov');
      console.log('└── generates: src/blog/my-post/demo-720p.mp4, demo-1080p.webm, etc.');
      return;
    }
    
    console.log(`📹 Found ${files.length} video(s) to process:\n`);
    files.forEach((file, i) => console.log(`${i + 1}. ${file}`));
    console.log('');
    
    for (const file of files) {
      await processVideo(file);
    }
    
    console.log('🎉 All videos processed successfully!');
    console.log('\n💡 Next steps:');
    console.log('- Use the {% video %} shortcode in your blog posts');
    console.log('- Reference the generated files (e.g., "demo-1080p.mp4")');
    console.log('- Don\'t forget to add alt text and captions for accessibility');
    
  } catch (error) {
    console.error('❌ Error processing videos:', error);
    process.exit(1);
  }
}

// Check if ffmpeg is available
ffmpeg.getAvailableFormats((err, formats) => {
  if (err) {
    console.error('❌ FFmpeg not found. Please install it first:');
    console.error('  macOS: brew install ffmpeg');
    console.error('  Ubuntu/Debian: sudo apt install ffmpeg');
    console.error('  Windows: Download from https://ffmpeg.org/download.html');
    process.exit(1);
  } else {
    main();
  }
});