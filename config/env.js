const path = require('path');
const dotenv = require('dotenv');

const projectRoot = process.cwd();

// Detect environment: default to 'dev'
const ENV = process.env.ENV || 'dev';
const envFileName = `.env.${ENV}`;
const envPath = path.resolve(projectRoot, 'config', 'env', envFileName);

// Only load .env file if not in CI
if (!process.env.CI) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.warn(`⚠️ Could not load env file at ${envPath}`);
  } else {
    console.log(`✅ Loaded env file: ${envPath}`);
  }
}

// Check required environment variables
const REQUIRED_VARS = ['BASE_URL', 'RS_EMAIL', 'RS_PASSWORD'];
REQUIRED_VARS.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

if (process.env.DEBUG === 'true') {
  console.log(`BASE_URL: ${process.env.BASE_URL}`);
  console.log(`USERNAME is set? ${!!process.env.USERNAME}`);
}
