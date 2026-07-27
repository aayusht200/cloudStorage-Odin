import { Share2 } from "lucide-react";
import { useLoaderData } from "react-router";
import { Button } from "../components/ui/button";
import DriveHeader from "../components/ui/DriveHeader";
import { FilePreview } from "../components/ui/FilePreview";
import type { filesLoader } from "../loaders/filesLoader";
function FilesPage() {
  const file = useLoaderData<typeof filesLoader>();
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <DriveHeader path={file.path} fileName={file.name} />
      <main className="grid flex-1 grid-cols-10 overflow-hidden">
        <div className="col-span-8 flex justify-center overflow-auto">
          <FilePreview {...file} />
        </div>
        <div className="content group-data-[size=sm]/card:text-s col-span-2 flex flex-col gap-10 overflow-y-auto p-2 text-xl leading-snug font-medium">
          <div className="name">Name: {file.name}</div>
          <div className="type">Type: {file.type}</div>
          <div className="updatedAt">
            Updated At: {file.updatedAt.split("T")[0]}
          </div>
          <div className="size">
            Size: {(file.size / 1000000).toFixed(2)} MB
          </div>

          <Button
            variant="link"
            className="hover:bg-secondary w-fit hover:cursor-pointer"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(file.url);
              } catch (error) {
                alert("Copy failed tryagain!");
              }
            }}
          >
            <Share2 />
          </Button>
        </div>
      </main>
    </div>
  );
}

export default FilesPage;
