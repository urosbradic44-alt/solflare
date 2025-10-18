README.txt
========================
WebdriverIO Web & API Test Suite
========================

1. Prerequisites
------------------------
- Node.js v18 or newer
- npm (comes with Node.js)

2. Installation
------------------------
- Run: npm install
  (Installs all dependencies listed in requirements.txt)

2. Environment Variables
------------------------
Create a .env file in the Tests/ApiIntegrationTests folder with the following content: ADDRESS="your token"

3. Running Web (UI) Tests
------------------------
- Default (Chrome, headed):
    npx wdio run ./wdio.web.conf.js
    or
    npm run test:web
- Headless mode:
     Windows PowerShell:
        set HEADLESS=1
        npx wdio run wdio.web.conf.js
    macOS/Linux (bash/zsh):
        HEADLESS=1 npx wdio run wdio.conf.js
- Firefox:
    Windows PowerShell:
        $env:BROWSER="firefox"; npx wdio run wdio.conf.js
    macOS/Linux (bash/zsh):
        BROWSER=firefox npx wdio run wdio.conf.js

4. Running API Tests
------------------------
- Run:
    npx wdio run ./wdio.api.conf.js
    or
    npm run test:api 

5. Features
------------------------
- Cross-browser support (Chrome, Firefox)
- Logger framework for action logging
- Screenshots on test failure (saved in ./errorShots)
- Page Object pattern for maintainable UI tests
- API tests use UUIDv4 for Authorization header

6. Notes
------------------------
- All tests are independent and can be run from any machine.
- Browser type is set via the BROWSER environment variable.
- See requirements.txt for dependencies.

