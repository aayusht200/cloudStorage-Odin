import {
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
} from "lucide-react";

export function getFileIcon(mimeType: string) {
  const Icon = mimeType.startsWith("image/")
    ? FileImage
    : mimeType.startsWith("video/")
      ? FileVideo
      : mimeType.startsWith("audio/")
        ? FileAudio
        : mimeType.startsWith("text/")
          ? FileText
          : mimeType === "application/pdf"
            ? FileText
            : mimeType === "application/zip"
              ? FileArchive
              : File;

  return <Icon className="h-8 w-8 md:h-24 md:w-24 lg:h-40 lg:w-40" />;
}
