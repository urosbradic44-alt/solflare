// utils/screenshot.ts
import logger from './logger';

export async function takeScreenshot(name: string) {
  const filePath = `./errorShots/${name}.png`;
  await browser.saveScreenshot(filePath);
  logger.info(`Screenshot taken: ${filePath}`);
}
