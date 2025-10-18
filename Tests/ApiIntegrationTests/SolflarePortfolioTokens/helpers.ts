import request from 'supertest';
import { BASE_URL } from './config';
import { v4 as uuidv4 } from 'uuid';

function getAuthHeader() {
  return `Bearer ${uuidv4()}`;
}

export async function getPortfolioTokensResponse(address: string, network?: string) {
  const path = `/v3/portfolio/tokens/${address}`;
  const headers = {
    Authorization: getAuthHeader(),
    'User-Agent': 'supertest',
  };

  // Create request with supertest
  const req = request(BASE_URL)
    .get(path)
    .query({ network: network })
    .set(headers);

  // Optionally log the built superagent request properties that are available
  // (not all internals are public; this prints what we explicitly know)
  console.log('Request details:', {
    method: 'GET',
    baseUrl: BASE_URL,
    path,
    query: { network: network },
    headers,
  });

  // Send request and log response
  const res = await req;
  console.log('Response status:', res.status);
  console.log('Response headers:', res.headers);
  // Print first 1000 chars of body to avoid huge logs
  const bodyPreview = typeof res.text === 'string' ? res.text.slice(0, 1000) : JSON.stringify(res.body).slice(0, 1000);
  console.log('Response body preview:', bodyPreview);
  return res;
}