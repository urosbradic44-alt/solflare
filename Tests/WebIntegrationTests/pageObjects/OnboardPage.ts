import type { ChainablePromiseElement } from 'webdriverio';

class OnboardPage {
  get newWalletButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button=I need a new wallet');
  }

  get savedRecoveryPhraseButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button=I saved my recovery phrase');
  }

  get continueButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button=Continue');
  }

  get agreeButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button*=I agree');
  }

  get passwordInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[data-testid="input-new-password"]');
  }

  get confirmPasswordInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[data-testid="input-repeat-password"]');
  }

  async getRecoveryPhrase(): Promise<string> {
    const inputElements = await $$('input[data-testid^="input-recovery-phrase-"]') || [];
    if (!Array.isArray(inputElements) || inputElements.length === 0) return '';
    const words: string[] = [];
    for (const el of inputElements) {
      const val = (await el.getValue())?.toString().trim() || '';
      if (val) words.push(val);
    }
    return words.join(' ');
  }
  
  async enterRecoveryPhrase(phrase: string): Promise<void> {
    const words = phrase.split(/\s+/).filter(Boolean);
    const inputs = await $$('input[data-testid^="input-recovery-phrase-"]');
    if (!Array.isArray(inputs) || inputs.length < words.length) {
      throw new Error('Recovery inputs not found or fewer inputs than words');
    }
    for (let i = 0; i < words.length; i++) {
      await inputs[i].setValue(words[i]);
    }
  }
}

export default new OnboardPage();
