import { api } from "./api";
export const authenticate = async () => {
  const result = await api.get("users/me");
  return result.data;
};
