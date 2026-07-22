import { api } from "./api";
export type LoginPayload = {
  email: string;
  password: string;
};
export const login = async ({ email, password }: LoginPayload) => {
  const result = await api.post("/users/login", {
    email,
    password,
  });
  return result.data;
};
