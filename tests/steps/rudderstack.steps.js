import '../../config/env.js';
import { Given, When, Then, Before } from '@cucumber/cucumber';
import { promises as fs } from 'fs';
import LoginPage from '../../pages/login.page.js';
import ConnectionsPage from '../../pages/connections.page.js';
import { createAPIContext, callRudderstack } from '../../utils/rudderstack.helper.js';
import assert from 'assert';



Before(async function () {
  this.loginPage = new LoginPage(this.page);
  this.connectionsPage = new ConnectionsPage(this.page);
});

Given('I log in to RudderStack workspace', async function () {
  await this.loginPage.visit();
  await this.loginPage.login(process.env.RS_EMAIL, process.env.RS_PASSWORD);
});

Given('I capture and persist the Data Plane URL and HTTP source write key', async function () {
  const dataPlaneURL = (await this.loginPage.getDataPlaneURL()).trim();
  const writeKey = (await this.loginPage.getWriteKey()).trim();
  await fs.mkdir('tests/fixtures', { recursive: true });
  await fs.writeFile('tests/fixtures/test-config.json',
    JSON.stringify({ dataPlaneURL, writeKey }, null, 2)
  );
});

Given('I send all events via the HTTP API', async function () {
  const { dataPlaneURL, writeKey } = JSON.parse(
    await fs.readFile('tests/fixtures/test-config.json', 'utf-8')
  );

  const apiContext = await createAPIContext(dataPlaneURL, writeKey);

  const events = ['track', 'alias', 'identify', 'page', 'screen', 'group', 'batch'];

  for (const ev of events) {
    await callRudderstack(apiContext, ev);
    await this.connectionsPage.refreshEventMetrics();
  }

  await apiContext.dispose();
});

Then('I navigate to the Webhook destination', async function () {
  await this.connectionsPage.clickWebhookDestination('demo');
});

Then('I verify the event delivery metrics', async function () {
  await this.connectionsPage.refreshEventMetrics();
  await this.page.reload();
  await this.connectionsPage.refreshEventMetrics();

  const failed = (await this.connectionsPage.getFailedCount()).trim();
  const delivered = (await this.connectionsPage.getDeliveredCount()).trim();
  await fs.writeFile('tests/fixtures/eventsDeliveryCount.json',
    JSON.stringify({ deliveredCount: delivered, failedCount: failed }, null, 2)
  );

assert.ok(Number(delivered) > 0, 'Delivered count should be > 0');
assert.strictEqual(Number(failed), 0, 'Failed count should be 0');
});
