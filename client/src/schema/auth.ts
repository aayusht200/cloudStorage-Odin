import { z } from "zod";
export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Minimum length is 8")
    .max(64, "Maximum length is 64")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Must contain uppercase, lowercase, number and special character",
    ),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Minimum length is 8")
    .max(64, "Maximum length is 64")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Must contain uppercase, lowercase, number and special character",
    ),
  firstName: z.string().min(1, "Required field"),
  lastName: z.string().min(1, "Required field"),
});

export type SignupPayload = z.infer<typeof signupSchema>;
