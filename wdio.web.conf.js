const browserType = process.env.BROWSER || 'chrome';
// enable headless when HEADLESS=1/true or running in CI
const headless = process.env.HEADLESS === '1' || process.env.HEADLESS === 'true' || process.env.CI === 'true';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export const config = {
  runner: 'local',
  specs: ['./Tests/WebIntegrationTests/**/*.test.ts'],
  maxInstances: 1,
  // default timeout for element waitFor* and element actions (e.g. click)
  waitforTimeout: 15000,
  // polling interval for waitFor* commands
  waitforInterval: 500,
  // how long to wait for a request to the selenium/driver service
  connectionRetryTimeout: 120000,
  capabilities: [{
    maxInstances: 1,
    browserName: browserType,
    // add browser-specific startup flags for headless/fullscreen modes
    ...(browserType === 'chrome' ? {
      'goog:chromeOptions': {
        args: headless
          ? [
              '--headless=new', // use modern headless flag
              '--disable-gpu',
              '--no-sandbox',
              '--disable-dev-shm-usage',
              '--window-size=1920,1080'
            ]
          : [
              '--start-maximized'
            ]
      }
    } : {}),
    ...(browserType === 'firefox' ? {
      'moz:firefoxOptions': {
        args: headless ? ['-headless'] : []
      }
    } : {})
  }],
  logLevel: 'info',
  framework: 'mocha',
  reporters: ['spec'],
  services: [],
  before: async function (capabilities, specs) {
    if (typeof global.expect !== 'undefined' && 'soft' in global.expect) return;
  require('expect-webdriverio');

  //Ensure a tab is open for DevTools
  await browser.url('about:blank');

  //Maximize or set window size
  try {
    await browser.maximizeWindow();
  } catch (err) {
    try {
      await browser.setWindowRect(0, 0, 1920, 1080);
    } catch (e) {
      console.error('Failed to maximize/setWindowRect:', e);
    }
  }

    // Maximize window at start (works for most drivers)
    try {
      await browser.maximizeWindow();
    } catch (err) {
      // fallback: set a large window rect
      try {
        await browser.setWindowRect(0, 0, 1920, 1080);
      } catch (e) {
        console.error('Failed to maximize/setWindowRect:', e);
      }
    }
  },
  afterTest: async function(test, context, { error }) {
    if (!error) return;
    try {
      const folder = join(process.cwd(), 'errorShots');
      if (!existsSync(folder)) mkdirSync(folder, { recursive: true });
      const filename = `${test.title.replace(/\s+/g, '_')}.png`;
      const screenshotPath = join(folder, filename);
      await browser.saveScreenshot(screenshotPath);
      // use console (logger may be undefined)
      console.error(`Screenshot saved: ${screenshotPath}`);
    } catch (err) {
      console.error('Failed to save screenshot:', err);
    }
  },
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000
  }
};
