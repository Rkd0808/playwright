// config/env.js
const path = require('path');
const dotenv = require('dotenv');

const projectRoot = process.cwd();
const envFileName = `.env.${process.env.ENV || 'dev'}`;
const envPath = path.resolve(projectRoot, 'config', 'env', envFileName);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`⚠️ Could not load env file at ${envPath}`);
} else {
  console.log(`✅ Loaded env file: ${envPath}`);
}

if (process.env.DEBUG === 'true') {
  console.log(`BASE_URL: ${process.env.BASE_URL}`);
  console.log(`USERNAME is set? ${!!process.env.RS_EMAIL}`);
}
