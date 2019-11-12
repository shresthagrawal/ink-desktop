const withCSS = require('@zeit/next-css');
const withImages = require('next-images');

module.exports = withCSS(withImages({
  // for `@zeit/next-css` (https://github.com/zeit/next-plugins/issues/266#issuecomment-474721942)
  cssLoaderOptions: {
    url: false,
  },

  webpack: config =>
    Object.assign(config, {
      target: 'electron-renderer',
    }),
}));
