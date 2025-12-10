import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { router } from '../../shared/router';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.headers['x-real-ip']?.toString() ||
    'unknown';

  const url = new URL(req.url!, `http://${req.headers.host}`);

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  const request = new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body,
  });

  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router,
    createContext: () => ({ ip }),
  });

  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const responseBody = await response.text();
  res.send(responseBody);
}
