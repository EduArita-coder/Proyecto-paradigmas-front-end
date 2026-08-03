import { getApiBaseUrl } from "../api/config";

const BASE_URL = getApiBaseUrl();

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const baseUrlClean = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const pathClean = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrlClean}${pathClean}`;

  const headers = new Headers(options.headers);
  
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body) {
    if (options.body instanceof FormData) {
      config.body = options.body;
    } else {
      config.body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json() as T;
  } catch (error) {
    return {} as T;
  }
}

export const api = {
  get: <T,>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T,>(path: string, body?: any, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(path, { ...options, method: 'POST', body }),

  put: <T,>(path: string, body?: any, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),

  delete: <T,>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
