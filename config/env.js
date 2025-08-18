const path = require("path");
const dotenv = require("dotenv");

function loadEnv() {
  const envName = process.env.ENV || "qa";
  const envFile = path.resolve(__dirname, `./env/.env.${envName}`);

  console.log(`🌍 Environment: ${envName}`);

  // Load from local file if exists
  const result = dotenv.config({ path: envFile });
  if (result.error) {
    console.warn(`⚠️ Could not load env file at ${envFile}`);
  }

  // Merge with GitHub secrets if running in CI
  if (process.env.GITHUB_ACTIONS) {
    console.log("🤖 Running in CI mode → using GitHub Secrets");

    const requiredVars = ["BASE_URL", "RS_EMAIL", "RS_PASSWORD"];
    requiredVars.forEach((key) => {
      if (!process.env[key]) {
        console.error(`❌ Missing required secret: ${key}`);
      }
    });
  }

  console.log("🌐 Base URL:", process.env.BASE_URL || "(not set)");
}

module.exports = { loadEnv };
