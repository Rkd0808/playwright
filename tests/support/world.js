// tests/support/world.js
const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');

class CustomWorld {
  async init() {
    const browserType = process.env.BROWSER || 'chromium';
    const isCI = process.env.CI === 'true';

    this.browser = await { chromium, firefox, webkit }[browserType].launch({
      headless: isCI ? true : (process.env.HEADLESS === 'true')
    });

    this.page = await this.browser.newPage();
  }

  async cleanup() {
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);

// Hooks to launch/close browser around each scenario
Before(async function () {
  await this.init();
});

After(async function () {
  await this.cleanup();
});
