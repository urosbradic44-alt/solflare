// wdio.api.conf.js
export const config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',

  //
  // ==================
  // Specify Test Files
  // ==================
  specs: [
    './Tests/ApiIntegrationTests/**/*.test.ts'
  ],

  //
  // ============
  // Capabilities
  // ============
  // For API tests we don’t need a browser, so leave this empty
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--headless=new',           // use new headless mode; use '--headless' if unsupported
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--window-size=1280,800'
        ]
      }
    }
  ],


  // ============
  // Services
  // ============
  // No browser services needed for API tests
  services: [],

  before: async function (capabilities, specs) {
    require('expect-webdriverio');
  },
  //
  // ===================
  // Test Configurations
  // ===================
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost', // not used for API tests, but required by WDIO
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  //
  // Test framework
  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

};