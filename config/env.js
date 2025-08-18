// config/env.js
import path from 'path';
import dotenv from 'dotenv';

// Use process.cwd() for more reliable path resolution in CI
const projectRoot = process.cwd();
const envFileName = process.env.DOTENV_CONFIG_PATH || `.env.${process.env.ENV || 'dev'}`;
const envPath = path.resolve(projectRoot, 'config', 'env', envFileName);

dotenv.config({ path: envPath });

// Optional debug logging
if (process.env.DEBUG === 'true') {
  console.log(`Loaded env file: ${envPath}`);
  console.log(`BASE_URL: ${process.env.BASE_URL}`);
  console.log(`RS_USER: ${process.env.EMAIL ? '******' : 'NOT SET'}`);
}

