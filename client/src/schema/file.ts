// schema/file.ts
import { z } from "zod";

export const uploadFormSchema = z.object({
  file: z
    .file()
    .max(10 * 1024 * 1024)
    .mime([
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
      "audio/mpeg",
      "video/mp4",
    ]),
});

export type UploadFormPayload = z.infer<typeof uploadFormSchema>;

export type UploadPayload = UploadFormPayload & {
  folderId: string;
};
