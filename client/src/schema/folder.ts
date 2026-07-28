import { z } from "zod";
export const createFolderSchema = z.object({ folderName: z.string().min(1) });

export type CreateFolderPayload = z.infer<typeof createFolderSchema>;

export type CreateFormFolderPayload = CreateFolderPayload & {
  parentId: string;
};
