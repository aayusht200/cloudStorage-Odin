import { api } from "./api";
export const deleteFile = async (id: string) => {
  const result = await api.delete(`/files/${id}`);
  return result.data;
};
