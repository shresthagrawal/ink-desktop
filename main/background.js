import dotenv from 'dotenv';
dotenv.config();

if (process.argv[2] === '--backend') {
  const { initBackend } = require('./backend');
  initBackend();
} else {
  const { initApp } = require('./app');
  initApp();
}
