import { getURL } from './helpers';

export const api = async (path: string, options: RequestInit = {}) => {
  const url = `${getURL()}${path}`;

  const headers = new Headers(options.headers || {});
  headers.set('NEXT_PUBLIC_API_KEY', process.env.NEXT_PUBLIC_API_KEY || '');

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    console.error('API error:', response.status, response.statusText);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  return data;
};
