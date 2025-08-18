// utils/rudderstack.helper.js

const { request } = require('playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

async function createAPIContext(DATA_PLANE_URL, SOURCE_WRITE_KEY) {
  const baseURL = DATA_PLANE_URL.replace(/\/+$/, '');
  return await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      'Authorization': 'Basic ' + Buffer.from(SOURCE_WRITE_KEY + ':').toString('base64'),
      'Content-Type': 'application/json'
    }
  });
}

async function callRudderstack(apiContext, endpointName) {
  const filePath = path.resolve('tests', 'fixtures', 'payload', `${endpointName}-payload.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ Payload file not found: ${filePath}`);
  }
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const response = await apiContext.post(`v1/${endpointName}`, { data: payload });
  console.log(`[${endpointName.toUpperCase()}] Status:`, response.status());
  assert.strictEqual(response.ok(), true, `❌ ${endpointName} failed with ${response.status()}`);
  let body;
  try { body = await response.json(); } catch { body = await response.text(); }
  console.log(`[${endpointName.toUpperCase()}] Response Body:`, body);
  return body;
}

module.exports = { createAPIContext, callRudderstack };
