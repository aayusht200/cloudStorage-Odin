import type { CreateFormFolderPayload } from "../schema/folder";
import { api } from "./api";

export const createFolder = async ({
  folderName,
  parentId,
}: CreateFormFolderPayload) => {
  const result = await api.post(`/folders/create`, {
    folderName: folderName,
    parentId: parentId,
  });
  return result.data;
};
