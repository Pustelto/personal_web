# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `npm start` - Starts Eleventy with live reload
- **Production build**: `npm run build` - Builds site with production optimizations and runs CSS splitting
- **Post-build**: `npm run postbuild` - Extracts and inlines critical CSS using Puppeteer

## Architecture Overview

This is a personal website built with **Eleventy (11ty)** static site generator using Nunjucks templating.

### Key Components

- **Static Site Generator**: Eleventy 1.x with custom configuration in `.eleventy.js`
- **Templating**: Nunjucks (`.njk` files) with markdown support
- **Content Structure**: 
  - Blog posts in `src/blog/` with frontmatter
  - Projects in `src/projects/`
  - Talks in `src/talks/`
- **Build Process**: Multi-stage with CSS optimization, critical CSS extraction, and social image generation

### Build Pipeline

1. **Eleventy Build**: Processes templates, markdown, and generates static HTML
2. **CSS Splitting** (`split-css.js`): Splits CSS using `@pustelto/css-split` package for page-specific optimization
3. **Critical CSS** (`critical.js`): Extracts and inlines critical CSS using Puppeteer for performance
4. **Social Images** (`ogImages.js`): Generates social media preview images using Puppeteer in production

### Collections & Filters

- **Collections**: `blogposts`, `featuredProjects`, `talks`, `allPages` with custom filtering
- **Custom Filters**: Date formatting, RSS dates, Twitter sharing, URL manipulation
- **Custom Shortcodes**: 
  - `{% codepen %}` for embedding CodePen demos
  - `{% image %}` and `{% figure %}` for responsive images with `@11ty/eleventy-img`
  - `{% video %}` for embedding videos with support for MP4/WebM formats, posters, and captions

### Content Management

- **Markdown Extensions**: Anchors, TOC, keyboard shortcuts, abbreviations, footnotes, playground
- **Image Processing**: Automatic responsive images with AVIF/WebP/JPG formats and multiple sizes
- **RSS Feed**: Generated at `/feed.xml`
- **Sitemap**: Auto-generated XML sitemap

### Performance Optimizations

- **HTML Minification**: Custom transform in `src/transforms/html-min-transform.js`
- **CSS Splitting**: Page-specific CSS bundles to reduce payload
- **Critical CSS**: Inlined above-the-fold CSS for faster rendering
- **Responsive Images**: Multiple formats and sizes with lazy loading
- **Font Loading**: Preconnect to Google Fonts

### Development Notes

- **Package Manager**: Uses pnpm (lockfile: `pnpm-lock.yaml`)
- **Node Version**: Specified in `.node-version`
- **Code Style**: Prettier configuration in `.prettierrc.json` with tabs and single quotes
- **Source Directory**: `src/` with output to `_site/`
- **Asset Handling**: Passthrough copy for fonts, images, favicons, videos (MP4/WebM/VTT), and specific file types

## Video Usage

The `{% video %}` shortcode supports:

```njk
{% video {
  mp4: "video.mp4",
  webm: "video.webm",
  poster: "poster.jpg",
  width: 1280,
  height: 720,
  captions: {
    src: "captions.en.vtt",
    srclang: "en", 
    label: "English",
    default: true
  },
  captionText: "Video description",
  controls: true,
  autoplay: false,
  muted: false
} %}
```

- Video files should be placed alongside blog posts (like images)
- Only `mp4` parameter is required, all others are optional
- Generates responsive HTML5 video with accessibility features

## Video Processing Pipeline

Use `npm run videos` to automatically process raw video files:

### Workflow:
1. Create `raw-videos/` folder in your blog post directory
2. Place original videos there (supports .mp4, .mov, .avi, .mkv, .webm)
3. Run `npm run videos` to generate optimized versions

### Generated Files:
- **MP4 versions**: `video-720p.mp4`, `video-1080p.mp4`
- **WebM versions**: `video-720p.webm`, `video-1080p.webm` 
- **Poster image**: `video-poster.jpg` (captured at 1 second)

### Example Structure:
```
src/blog/my-post/
├── raw-videos/
│   └── demo.mov          # Original file
├── demo-720p.mp4         # Generated
├── demo-1080p.mp4        # Generated  
├── demo-720p.webm        # Generated
├── demo-1080p.webm       # Generated
├── demo-poster.jpg       # Generated
└── index.md
```

### Requirements:
- FFmpeg must be installed (`brew install ffmpeg` on macOS)
- Dependencies: `fluent-ffmpeg`, `fs-extra`, `globby` (already added)