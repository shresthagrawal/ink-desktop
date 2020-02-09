const webpack = require('webpack'); // shipped with NextJS
const { getArgs } = require('./args');

module.exports = {
  webpack: config => {
    config.plugins.push(new webpack.DefinePlugin(getArgs()));
    return config;
  },
};
