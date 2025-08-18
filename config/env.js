const dotenv = require('dotenv');
const path = require('path');

// Determine environment
const ENV = process.env.ENV || 'dev';
const envFilePath = path.resolve(__dirname, `.env.${ENV}`);

// Load local .env only if variable is not already set (GitHub Actions will inject secrets)
dotenv.config({ path: envFilePath });

// Required variables
const requiredVars = ['BASE_URL', 'USERNAME', 'PASSWORD'];

requiredVars.forEach((v) => {
  if (!process.env[v]) {
    console.error(`❌ Missing required environment variable: ${v}`);
    process.exit(1); // Fail fast
  }
});

// Optional debug
if (process.env.DEBUG === 'true') {
  console.log(`Loaded env: ${envFilePath}`);
  requiredVars.forEach((v) =>
    console.log(`${v}: ${process.env[v] ? '****' : 'NOT SET'}`)
  );
}
