import axios from "axios";

let currentAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

export const getAccessToken = () => currentAccessToken;

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://api.example.com",
  withCredentials: true, // for refresh token cookie
});

http.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${currentAccessToken}`,
    };
  }
  return config;
});

// Basic error handling; more detailed workflow-specific handling is done via TanStack Query.
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Let callers handle 401/403 explicitly according to legal workflows.
    return Promise.reject(error);
  },
);

