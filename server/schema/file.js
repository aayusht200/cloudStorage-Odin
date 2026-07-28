import { uuid, z } from 'zod';
export const createFileSchema = z.object({
    originalname: z.string(),
    mimetype: z.string(),
    size: z.number().max(10 * 1024 * 1024),
    buffer: z.instanceof(Buffer),
});

export const idSchema = z.object({
    id: uuid(),
});
