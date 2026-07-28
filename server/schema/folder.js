import { z } from 'zod';
export const createFolderSchema = z.object({
    folderName: z.string().trim().min(1),
    parentId: z.uuid(),
});