import { useAuthStore } from '@/stores/auth';

const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:3001' : '');
if (!import.meta.env.DEV && !API_URL) {
  throw new Error('VITE_API_URL is required for non-dev builds');
}

export interface ApiError {
  error: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const auth = useAuthStore();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (auth.accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${auth.accessToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error ?? 'Request failed');
  }

  return response.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
