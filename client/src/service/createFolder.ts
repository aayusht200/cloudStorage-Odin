import { api } from "./api";
export type CreateFolderPayload = {
  folderName: string;
  parentId: string;
};
export const createFolder = async ({
  folderName,
  parentId,
}: CreateFolderPayload) => {
  const result = await api.post(`/folders/create`, {
    folderName: folderName,
    parentId: parentId,
  });
  return result.data;
};
