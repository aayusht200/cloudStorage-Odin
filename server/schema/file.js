import { uuid, z } from 'zod';
const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'audio/mpeg', 'video/mp4'];
export const createFileSchema = z.object({
    originalname: z.string().trim().min(1),
    mimetype: z.enum(allowedMimeTypes),
    size: z.number().max(10 * 1024 * 1024),
    buffer: z.instanceof(Buffer),
});

export const idSchema = z.object({
    id: uuid(),
});
