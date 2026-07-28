import type { UploadPayload } from "../schema/file";
import { api } from "./api";

export const upload = async ({ folderId, file }: UploadPayload) => {
  const formData = new FormData();

  formData.append("folderId", folderId);
  formData.append("file", file);
  const result = await api.post("/files/create", formData);
  return result.data;
};
