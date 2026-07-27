import { api } from "./api";
export type deleteFolderPayload = {
  id: string;
  parentId: string;
  folderName: string;
};
export const deleteFolder = async ({
  id,
  parentId,
  folderName,
}: deleteFolderPayload) => {
  const result = await api.delete(`/folders/${id}`, {
    data: { parentId, folderName },
  });
  return result.data;
};
