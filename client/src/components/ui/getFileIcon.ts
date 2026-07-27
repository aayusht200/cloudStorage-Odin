import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileText,
  FileVideo,
} from "lucide-react";

const fileIcons = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  text: FileText,
  code: FileCode,
  archive: FileArchive,
  default: File,
};
export function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return fileIcons.image;
  if (mimeType.startsWith("video/")) return fileIcons.video;
  if (mimeType.startsWith("audio/")) return fileIcons.audio;
  if (mimeType.startsWith("text/")) return fileIcons.text;

  switch (mimeType) {
    case "application/pdf":
      return FileText;
    case "application/zip":
      return FileArchive;
    default:
      return fileIcons.default;
  }
}
