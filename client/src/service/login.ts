import type { LoginPayload } from "../context/User";
import { api } from "./api";
export const login = async ({ email, password }: LoginPayload) => {
  const result = await api.post("/users/login", {
    email,
    password,
  });
  return result.data;
};
