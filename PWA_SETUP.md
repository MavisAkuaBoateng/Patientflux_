# PatientFlux PWA Setup Guide

This guide explains how to set up and test the Progressive Web App (PWA) functionality for PatientFlux.

## 🚀 What's Been Added

### 1. PWA Configuration Files
- **`manifest.json`** - PWA manifest with app metadata, icons, and shortcuts
- **`sw.js`** - Custom service worker with advanced caching strategies
- **`offline.html`** - Offline fallback page
- **`browserconfig.xml`** - Windows tile configuration

### 2. Next.js Integration
- **`next.config.mjs`** - Updated with `next-pwa` configuration
- **`layout.js`** - Enhanced with PWA meta tags and icons
- **PWA components** - Installation prompt and status monitoring

### 3. Advanced Features
- Offline caching for API responses, static assets, and pages
- Background sync capabilities
- Push notification support
- Smart caching strategies (Network First, Cache First, Stale While Revalidate)

## 🎨 Icon Requirements

### Required Icon Sizes
You need to create and add these icons to the `public/icons/` directory:

```
public/icons/
├── icon-16x16.png          (16x16)
├── icon-32x32.png          (32x32)
├── icon-72x72.png          (72x72)
├── icon-96x96.png          (96x96)
├── icon-128x128.png        (128x128)
├── icon-144x144.png        (144x144)
├── icon-152x152.png        (152x152)
├── icon-192x192.png        (192x192) - Required for PWA
├── icon-384x384.png        (384x384)
├── icon-512x512.png        (512x512) - Required for PWA
├── safari-pinned-tab.svg   (SVG for Safari)
└── apple-splash-*.png      (iOS splash screens)
```

### Icon Design Guidelines
- **Format**: PNG for icons, SVG for Safari pinned tab
- **Background**: Solid color or transparent
- **Style**: Simple, recognizable, works at small sizes
- **Colors**: Use your brand colors (#7c3aed primary)
- **Shape**: Square with rounded corners (optional)

### Quick Icon Generation
You can use online tools to generate all required sizes:
1. **Favicon.io** - Upload a high-res image and get all sizes
2. **RealFaviconGenerator** - Comprehensive favicon generation
3. **PWA Asset Generator** - Generate PWA-specific assets

## 🧪 Testing Your PWA

### 1. Development Testing
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production testing
npm run build
npm start
```

### 2. PWA Testing Tools
- **Chrome DevTools** → Application tab → Manifest & Service Workers
- **Lighthouse** → PWA audit
- **PWA Builder** → Online PWA validation

### 3. Mobile Testing
- **Chrome Mobile** - Install prompt should appear
- **Safari iOS** - Add to Home Screen option
- **Samsung Internet** - Install prompt

### 4. Offline Testing
1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. Refresh page - should show offline page
4. Navigate between pages - should work from cache

## 📱 PWA Features to Test

### Installation
- [ ] Install prompt appears on supported browsers
- [ ] App installs successfully
- [ ] App launches in standalone mode
- [ ] App icon appears on home screen

### Offline Functionality
- [ ] App works without internet connection
- [ ] Offline page displays when needed
- [ ] Cached data is accessible offline
- [ ] Background sync works when reconnecting

### Performance
- [ ] Fast loading from cache
- [ ] Smooth offline-to-online transitions
- [ ] Efficient cache management
- [ ] Minimal storage usage

## 🔧 Configuration Options

### Service Worker Caching
The service worker uses different strategies for different content types:

- **API Requests**: Network First (fallback to cache)
- **Static Assets**: Cache First (fast loading)
- **HTML Pages**: Network First (fallback to cache)
- **CSS/JS**: Stale While Revalidate (balance of speed and freshness)

### Customization
You can modify caching strategies in `sw.js`:

```javascript
// Example: Change API caching strategy
{
  urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
  handler: 'CacheFirst', // Change from NetworkFirst
  options: {
    cacheName: 'api-cache',
    expiration: {
      maxEntries: 100,
      maxAgeSeconds: 60 * 60 * 24, // 24 hours
    },
  },
}
```

## 🚀 Deployment Considerations

### HTTPS Requirement
PWAs require HTTPS in production. Ensure your hosting provides:
- Valid SSL certificate
- HTTPS redirects
- Secure headers

### Service Worker Updates
- Service workers update automatically
- Users may need to refresh to get new versions
- Consider implementing update notifications

### Cache Management
- Monitor cache sizes
- Implement cache cleanup strategies
- Version your caches for easy updates

## 🐛 Troubleshooting

### Common Issues

#### 1. Install Prompt Not Showing
- Check if app meets PWA criteria
- Verify manifest.json is valid
- Ensure HTTPS is enabled
- Check browser support

#### 2. Service Worker Not Registering
- Check browser console for errors
- Verify sw.js is accessible
- Check next-pwa configuration
- Ensure proper file paths

#### 3. Offline Not Working
- Verify service worker is active
- Check cache storage permissions
- Test with network throttling
- Review caching strategies

#### 4. Icons Not Displaying
- Verify icon file paths
- Check icon sizes match manifest
- Ensure proper MIME types
- Test with different browsers

### Debug Commands
```bash
# Check service worker status
navigator.serviceWorker.ready.then(reg => console.log(reg))

# Clear all caches
caches.keys().then(names => names.forEach(name => caches.delete(name)))

# Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log)
```

## 📚 Additional Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [next-pwa Documentation](https://www.npmjs.com/package/next-pwa)

## 🎯 Next Steps

1. **Add your icons** to the `public/icons/` directory
2. **Test PWA functionality** in development and production
3. **Customize caching strategies** based on your needs
4. **Implement push notifications** if required
5. **Add analytics** for PWA usage tracking
6. **Test on various devices** and browsers

Your PatientFlux app is now a fully-featured Progressive Web App! 🎉
