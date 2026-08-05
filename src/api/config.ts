const DEFAULT_BACKEND_URL = 'http://localhost:5074/api';

export function getApiBaseUrl(): string {
  const configuredUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || DEFAULT_BACKEND_URL;
  return configuredUrl.endsWith('/') ? configuredUrl.slice(0, -1) : configuredUrl;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('token');
}
