const webpack = require('webpack'); // shipped with NextJS
const withImages = require('next-images');
const { getArgs } = require('../args');

module.exports = withImages({
  webpack: config => {
    config.target = 'electron-renderer';
    config.plugins.push(new webpack.DefinePlugin(getArgs()));

    return config;
  },
});
