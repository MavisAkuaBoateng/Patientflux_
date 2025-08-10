#!/usr/bin/env node

/**
 * PatientFlux PWA Icon Generator
 * This script creates placeholder icons for PWA development
 * 
 * Usage: node generate-icons.js
 * 
 * Note: These are basic placeholder icons. Replace with your actual app icons
 * before production deployment.
 */

const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const ICON_SIZES = [
  16, 32, 72, 96, 128, 144, 152, 192, 384, 512
];

// SVG template for placeholder icons
const createSVGIcon = (size) => {
  const fontSize = Math.max(12, size * 0.4);
  const textY = size * 0.6;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  
  <!-- Icon Symbol (Medical Cross) -->
  <g fill="white" stroke="white" stroke-width="${Math.max(1, size * 0.05)}">
    <rect x="${size * 0.4}" y="${size * 0.25}" width="${size * 0.2}" height="${size * 0.5}" rx="${size * 0.05}"/>
    <rect x="${size * 0.25}" y="${size * 0.4}" width="${size * 0.5}" height="${size * 0.2}" rx="${size * 0.05}"/>
  </g>
  
  <!-- Text -->
  <text x="${size / 2}" y="${textY}" font-family="Arial, sans-serif" font-size="${fontSize}" 
        text-anchor="middle" fill="white" font-weight="bold">PF</text>
</svg>`;
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 Generating PatientFlux PWA placeholder icons...\n');

// Generate PNG icons (SVG for now, you'll need to convert to PNG)
ICON_SIZES.forEach(size => {
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  const svgContent = createSVGIcon(size);
  fs.writeFileSync(filepath, svgContent);
  
  console.log(`✅ Created ${filename}`);
});

// Create Safari pinned tab icon
const safariIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="16" height="16" rx="3" fill="url(#grad)"/>
  
  <!-- Medical Cross -->
  <g fill="white" stroke="white" stroke-width="1">
    <rect x="6" y="4" width="4" height="8" rx="1"/>
    <rect x="4" y="6" width="8" height="4" rx="1"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'safari-pinned-tab.svg'), safariIcon);
console.log('✅ Created safari-pinned-tab.svg');

// Create iOS splash screen placeholders
const splashScreens = [
  { name: 'apple-splash-2048x2732.png', width: 2048, height: 2732 },
  { name: 'apple-splash-1668x2388.png', width: 1668, height: 2388 },
  { name: 'apple-splash-1536x2048.png', width: 1536, height: 2048 },
  { name: 'apple-splash-1125x2436.png', width: 1125, height: 2436 },
  { name: 'apple-splash-1242x2688.png', width: 1242, height: 2688 },
  { name: 'apple-splash-750x1334.png', width: 750, height: 1334 },
  { name: 'apple-splash-640x1136.png', width: 640, height: 1136 }
];

splashScreens.forEach(screen => {
  const filename = screen.name;
  const filepath = path.join(iconsDir, filename);
  
  // Create a simple SVG splash screen
  const splashSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${screen.width}" height="${screen.height}" viewBox="0 0 ${screen.width} ${screen.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${screen.width}" height="${screen.height}" fill="url(#bg)"/>
  
  <!-- Logo -->
  <g transform="translate(${screen.width / 2}, ${screen.height / 2 - 100})" fill="white">
    <circle cx="0" cy="0" r="80" fill="rgba(255,255,255,0.1)"/>
    <g stroke="white" stroke-width="8">
      <rect x="-30" y="-50" width="60" height="100" rx="8"/>
      <rect x="-50" y="-30" width="100" height="60" rx="8"/>
    </g>
    <text x="0" y="40" font-family="Arial, sans-serif" font-size="32" 
          text-anchor="middle" fill="white" font-weight="bold">PatientFlux</text>
  </g>
</svg>`;
  
  fs.writeFileSync(filepath, splashSVG);
  console.log(`✅ Created ${filename}`);
});

console.log('\n🎉 All placeholder icons generated successfully!');
console.log('\n📝 Next steps:');
console.log('1. Replace these placeholder icons with your actual app icons');
console.log('2. Convert SVG files to PNG for better browser compatibility');
console.log('3. Test your PWA installation and offline functionality');
console.log('4. Use tools like favicon.io or RealFaviconGenerator for production icons');
console.log('\n🔗 For PNG conversion, you can use:');
console.log('- Online tools: favicon.io, RealFaviconGenerator');
console.log('- Command line: ImageMagick, Inkscape');
console.log('- Design tools: Figma, Adobe Illustrator, Sketch');
