import { ADDRESS, INVALID_ADDRESS } from './config';
import { getPortfolioTokensResponse } from './helpers';

describe('Solflare Portfolio Tokens API', () => {
  it('Devnet Token Validation', async () => {
    const res = await getPortfolioTokensResponse(ADDRESS, 'devnet');
    await expect(res.status).toEqual(200);

    const tokens = res.body.tokens;
    await expect(Array.isArray(tokens)).toBe(true);
    await expect(tokens.length).toBeGreaterThan(1);

    for (const token of tokens) {
      await expect(token !== null && typeof token === 'object').toBe(true);

      await expect(typeof token.mint).toEqual('string');
      await expect(token.mint.length).toBeGreaterThan(0);

      await expect(typeof token.totalUiAmount).toEqual('number');
      await expect(Number.isNaN(token.totalUiAmount)).toBe(false);

      if (token.price !== undefined && token.price !== null) {
        await expect(typeof token.price).toEqual('object');
      }

      if (token.coingeckoId !== undefined && token.coingeckoId !== null) {
        await expect(typeof token.coingeckoId).toEqual('string');
      }
    }

    const solToken = tokens.find((t: any) => t.name === 'Solana');
    await expect(solToken !== undefined).toBe(true);

    await expect(solToken.name).toEqual('Solana');
    await expect(solToken.symbol).toEqual('SOL');
    await expect(solToken.mint).toEqual('11111111111111111111111111111111');

    await expect(typeof solToken.totalUiAmount).toEqual('number');
    await expect(Number.isNaN(solToken.totalUiAmount)).toBe(false);
    await expect(solToken.totalUiAmount).toBeGreaterThan(0);
  });

  it('SOL Token Validation (no network param)', async () => {
    const res = await getPortfolioTokensResponse(ADDRESS);
    await expect(res.status).toEqual(200);

    const tokens = res.body.tokens;
    await expect(Array.isArray(tokens)).toBe(true);
    await expect(tokens.length).toBeGreaterThan(0);

    const solToken = tokens[0];
    await expect(solToken !== null && typeof solToken === 'object').toBe(true);

    await expect(solToken.name).toEqual('Solana');
    await expect(solToken.symbol).toEqual('SOL');
    await expect(solToken.mint).toEqual('11111111111111111111111111111111');

    await expect(typeof solToken.totalUiAmount).toEqual('number');
    await expect(Number.isNaN(solToken.totalUiAmount)).toBe(false);
    await expect(solToken.totalUiAmount).toBeGreaterThanOrEqual(0);

    await expect(typeof solToken.price).toEqual('object');
  });

  it('Break the API (invalid address)', async () => {
    const res = await getPortfolioTokensResponse(INVALID_ADDRESS);
    await expect([400, 404].includes(res.status)).toBe(true);

    const body = res.body;
    await expect(body !== null && typeof body === 'object').toBe(true);

    await expect(typeof body.type).toEqual('string');
    await expect(typeof body.message).toEqual('string');
    await expect(typeof body.code).toEqual('number');
    await expect(body.message.toLowerCase()).toMatch(/invalid public key provided|invalid address/);
  });

  it('Returning to Mainnet After Switching to Devnet', async () => {
    const mainnetRes1 = await getPortfolioTokensResponse(ADDRESS, 'mainnet');
    await expect(mainnetRes1.status).toEqual(200);
    const mainnetTokens1 = mainnetRes1.body.tokens;
    await expect(Array.isArray(mainnetTokens1)).toBe(true);

    const devnetRes = await getPortfolioTokensResponse(ADDRESS, 'devnet');
    await expect(devnetRes.status).toEqual(200);
    const devnetTokens = devnetRes.body.tokens;
    await expect(Array.isArray(devnetTokens)).toBe(true);
    await expect(devnetTokens.length).toBeGreaterThan(mainnetTokens1.length);

    const mainnetRes2 = await getPortfolioTokensResponse(ADDRESS, 'mainnet');
    await expect(mainnetRes2.status).toEqual(200);
    const mainnetTokens2 = mainnetRes2.body.tokens;
    await expect(Array.isArray(mainnetTokens2)).toBe(true);
    await expect(mainnetTokens2.length).toEqual(mainnetTokens1.length);

    for (let i = 0; i < mainnetTokens1.length; i++) {
      const t1 = mainnetTokens1[i];
      const t2 = mainnetTokens2[i];

      await expect(t2.mint).toEqual(t1.mint);
      await expect(t2.symbol).toEqual(t1.symbol);
      await expect(t2.name).toEqual(t1.name);

      await expect(typeof t2.totalUiAmount).toEqual('number');
      await expect(Number.isNaN(t2.totalUiAmount)).toBe(false);
    }
  });
});