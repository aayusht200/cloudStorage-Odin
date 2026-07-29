// schema/auth.js
import { z } from 'zod';

const passwordSchema = z
    .string()
    .min(8)
    .max(64)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/);
export const loginSchema = z.object({
    email: z.string().trim().min(1).email(),
    password: passwordSchema,
});

export const signupSchema = z.object({
    email: z.string().trim().email(),
    password: passwordSchema,
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
});
