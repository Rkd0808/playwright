module.exports = {
  default: {
    require: ['config/env.js', 'tests/support/world.js', 'tests/hooks/**/*.js', 'tests/steps/**/*.js'],
    paths: ['tests/features/**/*.feature'],
    format: ['progress', 'html:playwright-report/cucumber.html', 'json:playwright-report/cucumber.json'],
    timeout: 60000,
  },
};