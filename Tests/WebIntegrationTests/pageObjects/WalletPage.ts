import type { ChainablePromiseElement } from 'webdriverio';

class WalletPage {
  get mainWalletLabel(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-testid="section-header"]');
  }

  get addWalletButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-testid="icon-btn-add"]');
  }

  get manageRecoveryPhraseButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-testid="li-add-wallet-mnemonic-manage"]');
  }

  get firstToggle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-testid="tgl-li-wallets-3wWYpJAGiyatpJeWqikCSGwSrZDk9FtQrjF4psMmvKT6"]');
  }

  get saveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button=Save');
  }

  async selectRecoveryPhraseItem(index: number): Promise<void> {
    const el = await this.getRecoveryToggle(index);
    await el.click();
  }

  async getRecoveryToggle(index: number): Promise<WebdriverIO.Element> {
    const timeout = 15000;
    await browser.waitUntil(async () => {
      const items = await $$('button[data-testid^="tgl-li-wallets-"]');
      return Array.isArray(items) && items.length > index;
    }, {
      timeout,
      timeoutMsg: `Recovery toggles not found (index ${index}) after ${timeout}ms`
    });
    const items = await $$('button[data-testid^="tgl-li-wallets-"]');
    return items[index];
  }

  async getWalletNames(): Promise<string[]> {
    const timeout = 15000;
    await browser.waitUntil(async () => {
      const walletElements = await $$('div[data-testid="list-item-m-title"]');
      return Array.isArray(walletElements) && walletElements.length > 0;
    }, {
      timeout,
      timeoutMsg: `Wallet list not found after ${timeout}ms`
    });

    // fetch elements and normalize to a real array
    const raw = await $$('div[data-testid="list-item-m-title"]');
    const walletElements = Array.isArray(raw) ? raw : (raw ? [raw] : []);

    // remove the last element which is the "Add Wallet" item
    if (walletElements.length > 0) {
      walletElements.pop();
    }

    if (walletElements.length === 0) return [];

    // build promise list safely (avoid depending on .map on non-array-like objects)
    const textPromises: Promise<string>[] = [];
    for (const el of walletElements) {
      // el.getText() may return string or Promise<string>
      textPromises.push(Promise.resolve(el.getText()).then(t => t?.toString().trim() || ''));
    }

    return Promise.all(textPromises);
  }
  async openWalletManagement(): Promise<void> {
    // Wait until the popup disappears
    const popup = $('[data-testid="icon-toast-info"]');
    await popup.waitForDisplayed({ reverse: true, timeout: 10000 });
    const avatarButton = await $('[data-testid="icon-section-wallet-picker-arrow-right"]');
    await avatarButton.waitForClickable({ timeout: 15000 });
    await avatarButton.click();
  }
}

export default new WalletPage();
