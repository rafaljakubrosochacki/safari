const fs = require('fs');
const path = require('path');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

const root = __dirname;
const toPosix = (p) => p.split(path.sep).join('/');

// Strony HTML w katalogu głównym projektu.
const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));

// Zbiór obrazów z katalogu images/, do których faktycznie odwołują się strony
// (src, href, url(...), og:image). Dzięki temu do dist trafiają tylko używane pliki.
const usedImages = new Set();
for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of source.matchAll(/["'(]\.?\/?(images\/[^"'()#?\s]+)/g)) {
    usedImages.add(decodeURI(match[1]));
  }
}

const missing = [...usedImages].filter((img) => !fs.existsSync(path.join(root, img)));
if (missing.length) {
  throw new Error(`Brakujące obrazy, do których odwołują się strony:\n  ${missing.join('\n  ')}`);
}

module.exports = merge(common, {
  mode: 'production',
  // Zdjęcia są statycznymi plikami – ostrzeżenia o rozmiarze bundla nie mają tu sensu.
  performance: { hints: false },
  plugins: [
    new CopyPlugin({
      patterns: [
        // Wszystkie strony
        ...htmlFiles.map((f) => ({ from: f, to: f })),
        // Tylko używane obrazy
        {
          from: 'images',
          to: 'images',
          filter: (resourcePath) => usedImages.has(toPosix(path.relative(root, resourcePath))),
        },
        // Konfiguracja Tailwind (CDN) – musi być osobnym skryptem ładowanym po CDN
        { from: 'js/tailwind.config.js', to: 'js/tailwind.config.js' },
        // Ikony, favicony, manifest, robots
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'favicon-16x16.png', to: 'favicon-16x16.png' },
        { from: 'favicon-32x32.png', to: 'favicon-32x32.png' },
        { from: 'apple-touch-icon.png', to: 'apple-touch-icon.png' },
        { from: 'android-chrome-192x192.png', to: 'android-chrome-192x192.png' },
        { from: 'android-chrome-512x512.png', to: 'android-chrome-512x512.png' },
        { from: 'site.webmanifest.json', to: 'site.webmanifest.json' },
        { from: 'robots.txt', to: 'robots.txt' },
      ],
    }),
  ],
});
