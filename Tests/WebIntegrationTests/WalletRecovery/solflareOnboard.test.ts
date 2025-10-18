import { faker } from '@faker-js/faker';
import OnboardPage from '../pageobjects/OnboardPage';
import WalletPage from '../pageobjects/WalletPage';
import logger from '../utils/logger';

describe('Solflare Onboard Flow', () => {
  it('should onboard and manage wallets', async () => {
    await onboardNewWallet();
    const randomPassword = faker.internet.password({
      length: 16,
      memorable: false,
      pattern: /[A-Za-z0-9]/,
      prefix: 'Ab1!'
    });
    await setupPassword(randomPassword);

    await addNewWallet();

    logger.info('Managing recovery phrase');
    await WalletPage.manageRecoveryPhraseButton.click();

    logger.info('Verifying first toggle is disabled and on');
    const toggle = await WalletPage.getRecoveryToggle(0);
    await expect(toggle).toBeDisabled();
    await expect(toggle).toHaveAttribute('data-state', 'checked');

    logger.info('Selecting 3rd and 4th recovery phrase items');
    await WalletPage.selectRecoveryPhraseItem(2);
    await WalletPage.selectRecoveryPhraseItem(3);
    
    logger.info('Saving recovery phrase');
    await WalletPage.saveButton.click();

    logger.info('Verifying wallet names');
    const walletNames = await WalletPage.getWalletNames();
    expect(walletNames.length).toBe(3);
    expect(walletNames).toContain('Main Wallet');
  });
});


async function onboardNewWallet() {
  logger.info('Navigating to onboarding page');
  await browser.url('https://solflare.com/onboard');
  await (await OnboardPage.newWalletButton).waitForClickable({ timeout: 10000 });
  logger.info('Clicking "I need a new wallet"');
  await (await OnboardPage.newWalletButton).click();
  logger.info('Reading recovery phrase');
  const recoveryPhrase = await OnboardPage.getRecoveryPhrase();
  logger.info('Clicking "I saved my recovery phrase"');
  await OnboardPage.savedRecoveryPhraseButton.click();
  logger.info('Entering recovery phrase');
  await OnboardPage.enterRecoveryPhrase(recoveryPhrase);
  logger.info('Clicking "Continue"');
  await OnboardPage.continueButton.click();
  return recoveryPhrase;
}

async function setupPassword(randomPassword: string): Promise<void> {
  logger.info('Entering password');
  await (await OnboardPage.passwordInput).setValue(randomPassword);
  await OnboardPage.confirmPasswordInput.setValue(randomPassword);
  logger.info('Clicking "Continue"');
  await OnboardPage.continueButton.click();
  logger.info('Clicking "I agree, let’s go"');
  await OnboardPage.agreeButton.click();
}

async function addNewWallet() {
  logger.info('Opening wallet management');
  await WalletPage.mainWalletLabel.waitForDisplayed();
  await WalletPage.openWalletManagement();

  logger.info('Verifying Main wallet is displayed');
  await WalletPage.addWalletButton.waitForClickable();
  
  logger.info('Adding new wallet');
  await WalletPage.addWalletButton.click();
}
