import type { ApiErrorResponse } from '../../models/response/api-error-response.js';

const BASE_URL = 'https://dev-api.readyremit.com/v1';

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
};

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const api = {
  async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    const config = {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return handleApiError(data);
      }

      return data as T;
    } catch (error) {
      return handleApiError(error);
    }
  },

  get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  },

  post<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  },

  put<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  },

  delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  },

  patch<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  },
};

function handleApiError(error: any): never {
  if (Array.isArray(error)) {
    // Caso seja um array de erros
    const errors = error as ApiErrorResponse[];
    throw errors[0];
  } else if (error && typeof error === 'object' && 'code' in error) {
    // Caso seja um único objeto de erro
    const apiError = error as ApiErrorResponse;
    throw apiError;
  } else {
    // Caso seja um erro genérico
    throw {
      message: 'Ocorreu um erro inesperado',
      code: 'UNKNOWN_ERROR',
    } as ApiErrorResponse;
  }
}
