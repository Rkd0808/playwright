# Playwright + Cucumber RudderStack Automation Framework

[![Nightly RudderStack E2E Tests - Playwright](https://github.com/Rkd0808/playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/Rkd0808/playwright/actions/workflows/playwright.yml)

A comprehensive end-to-end testing framework built with **Playwright** and **Cucumber** for automating **RudderStack** platform testing. This framework provides BDD (Behavior Driven Development) approach for testing event delivery, webhook destinations, and data plane functionality.

## 🚀 Features

- **BDD Testing**: Cucumber integration with Gherkin syntax for readable test scenarios
- **Cross-Environment Support**: Configurable testing across `dev`, `qa`, and `prod` environments
- **RudderStack Integration**: Specialized helpers for RudderStack API interactions and event tracking
- **Page Object Model**: Organized page objects for maintainable test code
- **CI/CD Ready**: GitHub Actions workflow with nightly test execution
- **Multiple Report Formats**: HTML and JSON test reports
- **Environment Configuration**: Flexible environment variable management
- **Event Validation**: Comprehensive event delivery and metrics verification

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Valid RudderStack workspace credentials

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rkd0808/playwright.git
   cd playwright
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Install Playwright browsers:**
   ```bash
   npm run install-browsers
   ```

## ⚙️ Configuration

### Environment Variables

Create environment-specific files in `config/env/`:

- `.env.dev` - Development environment
- `.env.qa` - QA environment  
- `.env.prod` - Production environment

**Required Variables:**
```bash
BASE_URL=https://app.rudderstack.com
RS_EMAIL=your-email@example.com
RS_PASSWORD=your-password
DATA_PLANE_URL=your-data-plane-url
WRITE_KEY=your-write-key
WEBHOOK_URL=your-webhook-url
```

### Configuration Files

- **`playwright.config.js`**: Environment configuration and validation
- **`cucumber.config.js`**: Cucumber test runner configuration
- **`package.json`**: Project dependencies and scripts

## 🧪 Test Structure

```
tests/
├── features/           # Gherkin feature files
│   └── rudderstack.feature
├── steps/             # Step definitions
│   └── rudderstack.steps.js
├── hooks/             # Test hooks (setup/teardown)
├── support/           # Test support files
│   └── world.js
└── fixtures/          # Test data and outputs
```

### Feature Coverage

The framework currently includes:

**RudderStack Login and Setup:**
- Workspace authentication
- Data plane URL capture
- HTTP source write key extraction
- Event delivery via HTTP API
- Webhook destination navigation
- Event delivery metrics verification

## 🏃‍♂️ Running Tests

### Local Execution

```bash
# Run tests in development environment
npm run test:dev

# Run tests in QA environment
npm run test:qa

# Run tests in production environment
npm run test:prod

# Run tests with debug output
npm run test:debug
```

### CI/CD Execution

```bash
# Run tests in CI environment
npm run test:ci
```

## 📊 Reports

Test reports are generated in multiple formats:

- **HTML Report**: `playwright-report/cucumber.html`
- **JSON Report**: `playwright-report/cucumber.json`
- **Test Fixtures**: `tests/fixtures/` (contains test data and results)

## 🔧 Page Objects

### LoginPage (`pages/login.page.js`)
Handles RudderStack workspace authentication and configuration extraction.

### ConnectionsPage (`pages/connections.page.js`)
Manages destination navigation and event metrics verification.

## 🛠️ Utilities

### RudderStack Helper (`utils/rudderstack.helper.js`)
Provides specialized functions for:
- API context creation
- Event sending via HTTP API
- RudderStack-specific operations

## 🎯 Test Scenarios

### Event Delivery Verification
```gherkin
@smoke @login
Scenario: Verify events are delivered to Webhook destination
  Given I log in to RudderStack workspace
  And I capture and persist the Data Plane URL and HTTP source write key
  And I send all events via the HTTP API
  Then I navigate to the Webhook destination
  And I verify the event delivery metrics
```

## 🔄 CI/CD Pipeline

The framework includes a comprehensive GitHub Actions workflow:

- **Trigger**: Nightly execution at 1 AM UTC, manual dispatch, and on push to main
- **Environment**: Ubuntu 22.04 with Node.js 18
- **Matrix Testing**: QA environment with Chromium browser
- **Artifact Upload**: Test reports and fixtures with retention policies
- **Notifications**: Success/failure notifications

## 📦 Dependencies

### Production Dependencies
- `@cucumber/cucumber`: BDD test framework
- `axios`: HTTP client for API requests
- `dotenv`: Environment variable management

### Development Dependencies
- `@playwright/test`: End-to-end testing framework
- `playwright`: Browser automation
- `cross-env`: Cross-platform environment variables
- `prettier`: Code formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Best Practices

- **Environment Isolation**: Use appropriate environment files for different testing stages
- **Secret Management**: Store sensitive credentials as GitHub Actions secrets
- **Test Data**: Persist test artifacts in `fixtures/` for debugging and verification
- **Page Objects**: Follow the Page Object Model for maintainable test code
- **BDD Scenarios**: Write clear, business-readable Gherkin scenarios

## 🐛 Troubleshooting

### Common Issues

1. **Missing Environment Variables**: Ensure all required variables are set in your environment file
2. **Browser Installation**: Run `npm run install-browsers` if Playwright browsers are not installed
3. **Authentication Failures**: Verify RudderStack credentials are correct and workspace is accessible
4. **Timeout Issues**: Adjust `timeout` in `cucumber.config.js` for slower environments

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Test Automation Team** - *Initial work*

## 🔗 Links

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [RudderStack Documentation](https://docs.rudderstack.com/)