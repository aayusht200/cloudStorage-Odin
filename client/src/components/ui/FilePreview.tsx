export type FilePreviewProps = {
  name: string;
  type: string;
  url: string;
};
import { Download } from "lucide-react";
export const FilePreview = ({ url, name, type }: FilePreviewProps) => {
  if (type.startsWith("image/"))
    return <img src={url} alt={name} className="h-full object-contain" />;
  if (type.startsWith("video/"))
    return (
      <video controls>
        <source src={url} type={type} />
        Your browser does not support the video tag.
      </video>
    );
  if (type.startsWith("audio/"))
    return (
      <audio controls>
        <source src={url} type={type} />
        Your browser does not support the audio tag.
      </audio>
    );
  if (type.includes("pdf")) return <embed src={url} type="application/pdf" />;
  return (
    <a href={url} download>
      <Download />
      <p>File format loaded, preview unavailable for: {type}</p>
    </a>
  );
};
