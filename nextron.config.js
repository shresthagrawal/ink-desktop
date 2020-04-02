const webpack = require('webpack'); // shipped with NextJS
const { getArgs } = require('./args');

module.exports = {
  webpack: (config) => {
    config.entry.backend = './backend/index.js';
    config.plugins.push(new webpack.DefinePlugin(getArgs()));
    return config;
  },
};
