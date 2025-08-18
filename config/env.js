// config/env.js
const path = require('path');
const dotenv = require('dotenv');

const isCI = process.env.CI === 'true';

// Load .env files only locally
if (!isCI) {
  const ENV = process.env.ENV || 'dev';
  const envFilePath = path.resolve(process.cwd(), 'config', 'env', `.env.${ENV}`);
  const result = dotenv.config({ path: envFilePath });

  if (result.error) {
    console.warn(`⚠️ Could not load env file at ${envFilePath}`);
  } else {
    console.log(`✅ Loaded env file: ${envFilePath}`);
  }
}

// Required variables
const requiredVars = ['BASE_URL', 'RS_EMAIL', 'RS_PASSWORD'];
  console.log(`BASE_URL: ${process.env.BASE_URL}`);
  console.log(`USERNAME is set? ${!!process.env.RS_EMAIL}`);
  console.log(`RS_PASSWORD is set? ${!!process.env.RS_PASSWORD}`);
requiredVars.forEach(v => {
  if (!process.env[v]) {
    console.error(`❌ Missing required environment variable: ${v}`);
    if (!isCI) {
      console.error(`Make sure it is set in your local .env file`);
    } else {
      console.error(`Set it as a GitHub Actions secret`);
    }
    process.exit(1);
  }
});

if (process.env.DEBUG === 'true') {
  console.log(`BASE_URL: ${process.env.BASE_URL}`);
  console.log(`USERNAME is set? ${!!process.env.USERNAME}`);
}
