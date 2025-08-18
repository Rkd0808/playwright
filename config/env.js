const path = require('path');
const dotenv = require('dotenv');

const isCI = process.env.CI === 'true';

console.log(`Running in ${isCI ? 'CI' : 'local'} mode.`);

// Load local .env files if not in CI
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
const requiredVars = ['BASE_URL_QA', 'RS_EMAIL', 'RS_PASSWORD'];

requiredVars.forEach((v) => {
  if (!process.env[v]) {
    console.error(`❌ Missing required environment variable: ${v}`);
    if (!isCI) {
      console.error(`Make sure it is set in your local .env file`);
    } else {
      console.error(`Set it as a GitHub Actions secret`);
    }
    process.exit(1); // still exit for safety
  }
});

if (process.env.DEBUG === 'true') {
  console.log('✅ Environment variables:');
  requiredVars.forEach((v) => {
    console.log(`  ${v}: ${!!process.env[v]} (${process.env[v] || 'not set'})`);
  });
}

module.exports = {
  BASE_URL: process.env.BASE_URL,
  RS_EMAIL: process.env.RS_EMAIL,
  RS_PASSWORD: process.env.RS_PASSWORD,
  DATA_PLANE_URL: process.env.DATA_PLANE_URL || '',
  WRITE_KEY: process.env.WRITE_KEY || '',
  WEBHOOK_URL: process.env.WEBHOOK_URL || '',
};
