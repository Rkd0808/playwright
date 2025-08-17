class ConnectionsPage {
  constructor(page) {
    this.page = page;
    // Navigation elements
    this.connectionsMenuItem = page.locator('a[href*="/connections"], nav a:has-text("Connections")');
    this.sourcesTab = page.locator('button:has-text("Sources"), [role="tab"]:has-text("Sources")');
    this.destinationsTab = page.locator('button:has-text("Destinations"), [role="tab"]:has-text("Destinations")');
    
    // Data plane URL - commonly in header or top section
    this.dataPlaneUrlElement = page.locator('[data-testid="data-plane-url"], .data-plane-url, [title*="data plane"]');
    this.dataPlaneUrlText = page.locator('text=/dataplane/');
    
    // Action buttons
    this.addSourceButton = page.locator('button:has-text("Add Source"), button:has-text("New Source")');
    this.addDestinationButton = page.locator('button:has-text("Add Destination"), button:has-text("New Destination")');
    
    // Lists and cards
    this.sourcesList = page.locator('[data-testid="sources-list"], .sources-container');
    this.destinationsList = page.locator('[data-testid="destinations-list"], .destinations-container');
    this.sourceCards = page.locator('.source-card, [data-testid*="source"]');
    this.destinationCards = page.locator('.destination-card, [data-testid*="destination"]');
    this.destinationLink = page.locator('a[href="/destinations"]');
    this.events = page.locator('div[data-node-key="Events"]');
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
  const failedElement = this.page.locator('span:has-text("Failed")');
  const parent = failedElement.locator('..'); // move to parent
  const countText = await parent.locator('h2 span').innerText();
  return countText.trim();
}

async getDeliveredCount() {
  return (await this.page
    .locator('span:has-text("Delivered")')
    .locator('..')
    .locator('h2 span')
    .innerText()
  ).trim();
}


async refreshEventMetrics() {
  const refreshButton = this.page.locator('button:has-text("Refresh"), .refresh-btn');
  if (await refreshButton.count() > 0) {
    await refreshButton.click();
  }
  await this.page.reload();
}

  /**
   * Click add source button
   */
  async clickAddSource() {
    await this.addSourceButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click add destination button
   */
  async clickAddDestination() {
    await this.addDestinationButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select a source type
   * @param {string} sourceName - Name of the source (e.g., 'http', 'javascript')
   */
  async selectSource(sourceName) {
    const sourceSelector = page.locator(`[data-testid="source-${sourceName}"], .source-tile:has-text("${sourceName}")`, 
      `button:has-text("${sourceName}"), [title*="${sourceName}"]`);
    await sourceSelector.click();
  }

  /**
   * Select a destination type  
   * @param {string} destinationName - Name of the destination (e.g., 'webhook', 'postgres')
   */
  async selectDestination(destinationName) {
    const destinationSelector = this.page.locator(`[data-testid="destination-${destinationName}"], .destination-tile:has-text("${destinationName}")`,
      `button:has-text("${destinationName}"), [title*="${destinationName}"]`);
    await destinationSelector.click();
  }

  /**
   * Get write key for a specific source
   * @param {string} sourceName - Name of the source
   * @returns {string} Write key
   */
  async getSourceWriteKey(sourceName) {
    // Look for write key in source card or details
    const sourceCard = this.page.locator(`[data-testid="source-card-${sourceName}"], .source-card:has-text("${sourceName}")`);
    const writeKeyElement = sourceCard.locator('[data-testid="write-key"], .write-key, [title*="write key"]');
    
    if (await writeKeyElement.isVisible()) {
      return await writeKeyElement.textContent();
    }
    
    // Alternative: look for copy button and trigger click to reveal key
    const copyButton = sourceCard.locator('button[title*="copy"], button:has-text("Copy")');
    if (await copyButton.isVisible()) {
      await copyButton.click();
      // Write key might be displayed in a tooltip or modal
      await this.page.waitForTimeout(1000);
      return await writeKeyElement.textContent();
    }
    
    throw new Error(`Write key not found for source: ${sourceName}`);
  }

  /**
   * Click on events tab for a destination
   * @param {string} destinationName - Name of the destination
   */
  async clickDestinationEventsTab(destinationName) {
    const destinationCard = this.page.locator(`[data-testid="destination-card-${destinationName}"], .destination-card:has-text("${destinationName}")`);
    await destinationCard.locator('[data-testid="events-tab"], button:has-text("Events")').click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get event counts for a destination
   * @param {string} destinationName - Name of the destination
   * @returns {Object} Object with delivered and failed counts
   */
  async getEventCounts(destinationName) {
    const destinationCard = this.page.locator(`[data-testid="destination-card-${destinationName}"], .destination-card:has-text("${destinationName}")`);
    
    // Look for delivered and failed count elements
    const deliveredElement = destinationCard.locator('[data-testid="delivered-count"], .delivered-count, [title*="delivered"]');
    const failedElement = destinationCard.locator('[data-testid="failed-count"], .failed-count, [title*="failed"]');
    
    let delivered = 0;
    let failed = 0;
    
    try {
      if (await deliveredElement.isVisible()) {
        const deliveredText = await deliveredElement.textContent();
        delivered = parseInt(deliveredText.replace(/[^0-9]/g, '')) || 0;
      }
      
      if (await failedElement.isVisible()) {
        const failedText = await failedElement.textContent();
        failed = parseInt(failedText.replace(/[^0-9]/g, '')) || 0;
      }
    } catch (error) {
      console.log('Could not parse event counts:', error.message);
    }
    
    return { delivered, failed };
  }

  /**
   * Wait for new events to appear
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForEvents(timeout = 10000) {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Check if source exists in the list
   * @param {string} sourceName - Name of the source
   * @returns {boolean}
   */
  async isSourceExists(sourceName) {
    const sourceCard = this.page.locator(`[data-testid*="${sourceName}"], .source-card:has-text("${sourceName}")`);
    return await sourceCard.isVisible();
  }

  /**
   * Check if destination exists in the list
   * @param {string} destinationName - Name of the destination
   * @returns {boolean}
   */
  async isDestinationExists(destinationName) {
    const destinationCard = this.page.locator(`[data-testid*="${destinationName}"], .destination-card:has-text("${destinationName}")`);
    return await destinationCard.isVisible();
  }
}

module.exports = ConnectionsPage;