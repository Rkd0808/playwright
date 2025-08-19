class ConnectionsPage {
  constructor(page) {
    this.page = page;    
    // Data plane URL - commonly in header or top section
    this.dataPlaneUrlElement = page.locator('[data-testid="data-plane-url"], .data-plane-url, [title*="data plane"]');
    this.dataPlaneUrlText = page.locator('text=/dataplane/');
  
    // Lists and cards
    this.destinationLink = page.locator('a[href="/destinations"]');
    this.events = page.locator('div[data-node-key="Events"]');
    this.failedEventCount = page.locator('//span[text()="Failed"]/..//h2/span');
    this.deliveredEventCount = page.locator('//span[text()="Delivered"]/..//h2/span');
  }

  /**
   * Navigate to connections page
   */
  async navigateToConnections() {
    await this.connectionsMenuItem.click();
    await this.page.waitForURL('**/connections**');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get data plane URL from the page
   * @returns {string} Data plane URL
   */
  async getDataPlaneUrl() {
    try {
      // Try specific element first
      if (await this.dataPlaneUrlElement.isVisible()) {
        return await this.dataPlaneUrlElement.textContent();
      }
      
      // Fallback to text search
      await this.dataPlaneUrlText.waitFor({ timeout: 5000 });
      return await this.dataPlaneUrlText.textContent();
    } catch (error) {
      // Last resort - search page content
      const pageContent = await this.page.textContent('body');
      const match = pageContent.match(/https?:\/\/[^\\s]*dataplane[^\\s]*/i);
      if (match) {
        return match[0];
      }
      throw new Error('Data plane URL not found on the page');
    }
  }

async clickWebhookDestination(webhookName) {
  await this.page.waitForTimeout(5000); // waits for 5 seconds
  await this.destinationLink.click();
 await this.page.locator(`//div[contains(text(), "${webhookName}")]`).first().click();
  await this.events.click();
}

async getFailedCount() {
  const countText = await this.failedEventCount.innerText();
  return countText.trim();
}

async getDeliveredCount() {
  const countText = await this.deliveredEventCount.innerText();
  return countText.trim();
}


async refreshEventMetrics() {
  const refreshButton = this.page.locator('button:has-text("Refresh"), .refresh-btn');
  if (await refreshButton.count() > 0) {
    await refreshButton.click();
  }
  await this.page.reload();
}

}

module.exports = ConnectionsPage;