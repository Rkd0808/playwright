// pages/login.page.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"], input[name="email"], #email');
    this.passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    this.skip2FAButton = page.locator('a[href="/addmfalater"]');
    this.goToDashboardButton = page.locator('button[type="button"]');
    this.closeAlert = page.locator('button[title="Close"]');
    this.loginButton = page.locator('button[type="button"]').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("Reset")');
    this.destinationLink = page.locator('a[href="/destinations"]');
    this.eventsSection = page.locator('div[data-node-key="Events"]');
    this.connectionsNavLink = page.locator('a[href*="connections"], nav a:has-text("Connections")');
  }

  async visit() {
    const url = process.env.BASE_URL;
    if (!url) {
      throw new Error('BASE_URL environment variable is not set. Please check your environment configuration.');
    }
    await this.page.goto(url);
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.skip2FAButton.click();
    await this.goToDashboardButton.click();
    await this.closeAlert.click();
  }

  async loginWithValidation(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.emailInput.shouldHaveValue(email);
    await this.passwordInput.shouldHaveValue(password);
    await this.loginButton.click();
  }

  async validateLoginFormExists() {
    await Promise.all([
      this.emailInput.waitFor({ state: 'attached' }),
      this.passwordInput.waitFor({ state: 'attached' }),
      this.loginButton.waitFor({ state: 'attached' })
    ]);
  }

  async validateEmailError() {
    const err = this.page.locator('.error, .invalid, [data-testid="email-error"]');
    await err.waitFor({ state: 'visible' });
    await expect(err).toContainText('email');
  }

  async validatePasswordError() {
    const err = this.page.locator('.error, .invalid, [data-testid="password-error"]');
    await err.waitFor({ state: 'visible' });
    await expect(err).toContainText('password');
  }
   async navigateToConnections() {
    await this.connectionsNavLink.click();
    await this.page.waitForURL('**/connections**');
  }

  async getDataPlaneURL() {
    // Find span containing 'Data Plane', then its container, then the span before the button
    const container = this.page.locator('span:text("Data Plane")').locator('xpath=..').locator('xpath=..');
    const urlSpan = container.locator('button.dataplane-url-copy-cta').locator('xpath=preceding-sibling::span[1]');
    const url = await urlSpan.textContent();
    return url.trim();
  }

  async getWriteKey() {
    const writeKeySpan = this.page.locator('span:text("Write key")');
    const text = await writeKeySpan.textContent();
    return text.replace('Write key', '').trim();
  }

  async clickWebhookDestination(webhookName) {
    await this.destinationLink.click();
    const webhookDiv = this.page.locator(`div:has-text("${webhookName}")`);
    await webhookDiv.click();
    await this.eventsSection.click();
  }
}

export default LoginPage;
