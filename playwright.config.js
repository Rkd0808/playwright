require('dotenv').config({
  path: `config/env/.env.${process.env.ENV || 'dev'}`
});

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 60000,
  use: {
    headless: process.env.HEADLESS === 'true',
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    browserName: process.env.BROWSER || 'chromium'
  },
  projects: [
    { 
      name: 'chromium', 
      use: { browserName: 'chromium' } 
    },
    { 
      name: 'firefox',  
      use: { browserName: 'firefox' } 
    },
    { 
      name: 'webkit',   
      use: { browserName: 'webkit' } 
    }
  ],
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ]
});