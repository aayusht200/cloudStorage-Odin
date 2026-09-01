import axios from "axios";

let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (
    csrfToken &&
    ["post", "put", "patch", "delete"].includes(
      config.method?.toLowerCase() ?? "",
    )
  ) {
    config.headers.set("x-csrf-token", csrfToken);
  }

  return config;
});
