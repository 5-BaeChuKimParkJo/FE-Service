import { afterEach, describe, expect, it } from 'vitest';
import { getApiBaseUrl } from './server';

const originalApiUrl = process.env.API_URL;
const originalPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;

afterEach(() => {
  process.env.API_URL = originalApiUrl;
  process.env.NEXT_PUBLIC_API_URL = originalPublicApiUrl;
});

describe('getApiBaseUrl', () => {
  it('prefers the runtime-only service URL', () => {
    process.env.API_URL = 'http://kong.internal';
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:30080';
    expect(getApiBaseUrl()).toBe('http://kong.internal');
  });

  it('fails clearly when no API URL exists', () => {
    delete process.env.API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(() => getApiBaseUrl()).toThrow('API_URL');
  });
});
