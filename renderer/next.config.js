const webpack = require('webpack'); // shipped with NextJS
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const { getArgs } = require('../args');

module.exports = withCSS(
  withImages({
    // for `@zeit/next-css` (https://github.com/zeit/next-plugins/issues/266#issuecomment-474721942)
    cssLoaderOptions: {
      url: false,
    },

    webpack: config => {
      config.target = 'electron-renderer';
      config.plugins.push(new webpack.DefinePlugin(getArgs()));

      return config;
    },
  })
);
