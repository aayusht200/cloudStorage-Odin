import type { LoginPayload } from "../schema/auth";
import { api, setCsrfToken } from "./api";
export const login = async ({ email, password }: LoginPayload) => {
  const result = await api.post("/users/login", {
    email,
    password,
  });
  setCsrfToken(result.data.csrfToken);
  return result.data;
};
