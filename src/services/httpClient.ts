import axios from 'axios';

const DEFAULT_TIMEOUT_MS = 12000;

export class ApiError extends Error {
  status?: number;
  code?: string;
  isNetworkError: boolean;

  constructor(message: string, options?: { status?: number; code?: string; isNetworkError?: boolean }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.code = options?.code;
    this.isNetworkError = options?.isNetworkError ?? false;
  }
}

export const httpClient = axios.create({
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const code = error.code;
      const isTimeout = code === 'ECONNABORTED';
      const isNetworkError = !error.response;

      let message = 'Une erreur reseau est survenue.';

      if (status) {
        message = `Paris Data a repondu avec le statut ${status}.`;
      } else if (isTimeout) {
        message = 'La requete a expire. Veuillez reessayer.';
      } else if (error.message) {
        message = error.message;
      }

      return Promise.reject(
        new ApiError(message, {
          status,
          code,
          isNetworkError,
        })
      );
    }

    if (error instanceof Error) {
      return Promise.reject(new ApiError(error.message));
    }

    return Promise.reject(new ApiError('Une erreur inconnue est survenue.'));
  }
);
