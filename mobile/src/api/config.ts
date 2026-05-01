const REMOTE_API_BASE_URL = 'https://wardrobe-ai-backend-a3fl.onrender.com/api';
const LOCAL_BACKEND_PORT = '3000';

function resolveWebApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return REMOTE_API_BASE_URL;
  }

  const { protocol, hostname } = window.location;
  const isLocalLikeHost =
    hostname === '127.0.0.1' ||
    hostname === 'localhost' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.');

  if (!isLocalLikeHost) {
    return REMOTE_API_BASE_URL;
  }

  return `${protocol}//${hostname}:${LOCAL_BACKEND_PORT}/api`;
}

export const API_BASE_URL =
  typeof window !== 'undefined' ? resolveWebApiBaseUrl() : REMOTE_API_BASE_URL;

export const API_TIMEOUT_MS = 70_000;
