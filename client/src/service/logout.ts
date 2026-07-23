import { api } from "./api";
export const logout = async () => {
  const result = await api.post("/users/logout");
  return result.data;
};
