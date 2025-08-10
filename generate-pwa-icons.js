const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA
const iconSizes = [
  16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512
];

// Create placeholder SVG icons
const createPlaceholderIcon = (size) => {
  const color = '#7c3aed'; // Purple theme color
  const bgColor = '#ffffff';
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${bgColor}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="${color}"/>
    <text x="${size/2}" y="${size/2 + size/20}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size/8}" font-weight="bold">PF</text>
  </svg>`;
};

// Generate all icon sizes
iconSizes.forEach(size => {
  const svgContent = createPlaceholderIcon(size);
  const fileName = `icon-${size}x${size}.svg`;
  const filePath = path.join(iconsDir, fileName);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created ${fileName}`);
});

// Create PNG placeholder files (you'll need to replace these with actual PNG icons)
const pngSizes = [192, 512]; // Critical sizes for PWA
pngSizes.forEach(size => {
  const fileName = `icon-${size}x${size}.png`;
  const filePath = path.join(iconsDir, fileName);
  
  // Create a simple text file as placeholder
  const placeholder = `# Placeholder for ${size}x${size} PNG icon
# Replace this file with an actual ${size}x${size} PNG icon
# You can use tools like:
# - https://realfavicongenerator.net/
# - https://www.pwabuilder.com/imageGenerator
# - Adobe Photoshop, Figma, or any image editor
`;
  
  fs.writeFileSync(filePath, placeholder);
  console.log(`📝 Created placeholder for ${fileName}`);
});

// Create additional PWA assets
const additionalAssets = [
  'apple-touch-icon.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'safari-pinned-tab.svg'
];

additionalAssets.forEach(asset => {
  const filePath = path.join(iconsDir, asset);
  const placeholder = `# Placeholder for ${asset}
# Replace this file with the actual asset
`;
  
  fs.writeFileSync(filePath, placeholder);
  console.log(`📝 Created placeholder for ${asset}`);
});

console.log('\n🎉 PWA icon generation complete!');
console.log('\n📋 Next steps:');
console.log('1. Replace placeholder files with actual PNG icons');
console.log('2. Use tools like https://realfavicongenerator.net/ for professional icons');
console.log('3. Ensure icons have transparent backgrounds for best results');
console.log('4. Test your PWA on mobile devices');
