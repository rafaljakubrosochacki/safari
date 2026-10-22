const path = require('path');

module.exports = {
  // Skrypt strony (menu, karuzela, filtr zespołu, lightbox) – bundlowany i minifikowany przez webpack.
  entry: {
    main: './js/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    clean: true,
  },
};
