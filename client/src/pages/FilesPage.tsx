import { Share2, Trash2 } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import DriveHeader from "../components/ui/DriveHeader";
import { FilePreview } from "../components/ui/FilePreview";
import type { filesLoader } from "../loaders/filesLoader";
import { deleteFile } from "../service/deleteFile";
function FilesPage() {
  const file = useLoaderData<typeof filesLoader>();
  const navigate = useNavigate();
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

          <div className="action">
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
            <Button
              variant="link"
              className="hover:bg-secondary w-fit hover:cursor-pointer"
              onClick={async () => {
                try {
                  const parent = file.path.at(-1);

                  await deleteFile(file.id);
                  navigate(`/drive/${parent.id}`, { replace: true });
                } catch (error) {
                  alert(error);
                }
              }}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FilesPage;
