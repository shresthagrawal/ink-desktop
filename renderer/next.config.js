const path = require('path');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const webpack = require('webpack'); // shipped with NextJS

require('dotenv').config({
  path: path.join(__dirname, '..', '.env'),
});

const requiredArgs = ['SENDGRID_TOKEN'];
if (requiredArgs.some(arg => !process.env[arg])) {
  console.error(`Not all required environment variables have been specified.
Please inspect \`.env.example\`. Required are:
${JSON.stringify(requiredArgs, null, 2)}`);
  process.exit(1);
}

module.exports = withCSS(
  withImages({
    // for `@zeit/next-css` (https://github.com/zeit/next-plugins/issues/266#issuecomment-474721942)
    cssLoaderOptions: {
      url: false,
    },

    webpack: config => {
      config.target = 'electron-renderer';

      const env = requiredArgs.reduce(
        (acc, curr) => ({
          ...acc,
          [`process.env.${curr}`]: JSON.stringify(process.env[curr]),
        }),
        {}
      );
      config.plugins.push(new webpack.DefinePlugin(env));

      return config;
    },
  })
);
