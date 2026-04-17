const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const API_BASE_URL = DEFAULT_API_BASE_URL.replace(/\/$/, '');

export const apiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};