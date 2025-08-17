// config/env.js
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const path = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFileName = process.env.DOTENV_CONFIG_PATH || `.env.${process.env.ENV || 'dev'}`;
const envPath = path.resolve(__dirname, 'env', envFileName);

dotenv.config({ path: envPath });

// Optional debug logging
if (process.env.DEBUG === 'true') {
  console.log(`Loaded env file: ${envPath}`);
  console.log(`BASE_URL: ${process.env.BASE_URL}`);
  console.log(`RS_USER: ${process.env.EMAIL ? '******' : 'NOT SET'}`);
}
