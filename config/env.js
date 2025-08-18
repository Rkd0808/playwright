const path = require('path');
const dotenv = require('dotenv');

// 👇 Use your own variable to decide CI mode
const isCI = process.env.RUN_ENV === 'ci';

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
