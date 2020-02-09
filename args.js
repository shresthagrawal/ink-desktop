const path = require('path');

function getArgs() {
  require('dotenv').config({
    path: path.join(__dirname, '.env'),
  });

  const requiredArgs = ['SENDGRID_TOKEN', 'GITHUB_TOKEN', 'GITHUB_USER'];
  if (requiredArgs.some(arg => !process.env[arg])) {
    console.error(`Not all required environment variables have been specified.
  Please inspect \`.env.example\`. Required are:
  ${JSON.stringify(requiredArgs, null, 2)}`);
    process.exit(1);
  }

  return requiredArgs.reduce(
    (acc, curr) => ({
      ...acc,
      [`process.env.${curr}`]: JSON.stringify(process.env[curr]),
    }),
    {}
  );
}

module.exports = { getArgs };
