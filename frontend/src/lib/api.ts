const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface FetchOptions extends RequestInit {
  skipErrorHandling?: boolean;
}

async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipErrorHandling, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    if (!skipErrorHandling) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export const api = {
  get: <T,>(endpoint: string, options?: FetchOptions) =>
    apiCall<T>(endpoint, { ...options, method: 'GET' }),

  post: <T,>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiCall<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T,>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiCall<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T,>(endpoint: string, options?: FetchOptions) =>
    apiCall<T>(endpoint, { ...options, method: 'DELETE' }),

  patch: <T,>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiCall<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
};

export default api;
