const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');

// Set default timeout for all steps (60 seconds)
setDefaultTimeout(60000);

Before(async function () {
  console.log('🎬 Starting test scenario...');
  console.log(`📅 Test run started at: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${process.env.ENV || 'dev'}`);
  console.log(`🌐 Base URL: ${process.env.BASE_URL}`);
});

After(async function (scenario) {
  const scenarioStatus = scenario.result.status;
  const scenarioName = scenario.pickle.name;
  const duration = scenario.result.duration?.milliseconds || 0;
  
  console.log(`📊 Scenario: "${scenarioName}"`);
  console.log(`⏱️  Duration: ${duration}ms`);
  console.log(`📋 Status: ${scenarioStatus.toUpperCase()}`);
  
  if (scenarioStatus === 'failed') {
    console.log('❌ Test scenario failed:', scenarioName);
    console.log('💡 Check the test logs and screenshots for more details');
    
    // Take screenshot on failure if page exists
    if (this.page) {
      try {
        const screenshot = await this.page.screenshot({ 
          fullPage: true,
          type: 'png',
          quality: 90
        });
        
        // Attach screenshot to Cucumber report
        this.attach(screenshot, 'image/png');
        console.log('📸 Screenshot captured and attached to report');
        
        // Log page URL and title for debugging
        const url = this.page.url();
        const title = await this.page.title().catch(() => 'Unknown');
        console.log(`🔗 Page URL: ${url}`);
        console.log(`📄 Page Title: ${title}`);
        
      } catch (error) {
        console.log('⚠️  Failed to capture screenshot:', error.message);
      }
    }
    
    // Log any errors from the scenario
    if (scenario.result.message) {
      console.log('🐛 Error details:', scenario.result.message);
    }
    
  } else if (scenarioStatus === 'passed') {
    console.log('✅ Test scenario passed:', scenarioName);
  } else if (scenarioStatus === 'pending') {
    console.log('⏸️  Test scenario pending:', scenarioName);
  } else if (scenarioStatus === 'skipped') {
    console.log('⏭️  Test scenario skipped:', scenarioName);
  }
  
  console.log('🔚 Test scenario completed');
  console.log('─'.repeat(80));
});