import { api } from "./api";
export const getFile = async (id: string) => {
  const result = await api.get(`/files/${id}`);
  return result.data;
};
