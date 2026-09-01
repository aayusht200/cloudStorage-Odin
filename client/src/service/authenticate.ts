import { api, setCsrfToken } from "./api";
export const authenticate = async () => {
  const result = await api.get("/users/me");
  setCsrfToken(result.data.csrfToken);
  return result.data;
};
