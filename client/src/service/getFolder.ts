import { api } from "./api";
export const getFolder = async (id: string) => {
  const result = await api.get(`/folders/${id}`);
  return result.data;
};
