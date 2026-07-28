import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import DriveCard from "../components/ui/DriveCard";
import DriveHeader from "../components/ui/DriveHeader";
import { EmptyOutline } from "../components/ui/EmptyOutline";
import { getFileIcon } from "../helperFunction/getFileIcon";
import type { driveLoader } from "../loaders/driveLoader";
import { deleteFolder } from "../service/deleteFolder";
function DrivePage() {
  const drive = useLoaderData<typeof driveLoader>();
  const navigate = useNavigate();
  const [errors, setError] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{
    id: string;
    folderName: string;
  }>({ id: "", folderName: "" });
  const handleDelete = async () => {
    try {
      await deleteFolder({
        id: folderToDelete.id,
        folderName: folderToDelete.folderName,
        parentId: drive.id,
      });
      window.location.reload();
    } catch {
      setError(true);
    }
  };
  function handleUpload() {
    navigate(`/upload/${drive.id}`);
  }
  return (
    <div className="flex h-dvh flex-col gap-10">
      <DriveHeader path={drive.path} folderId={drive.id} />

      {drive.children.length === 0 && drive.files.length === 0 && (
        <div>
          <EmptyOutline onClick={handleUpload} />
        </div>
      )}
      <main className="grid grid-cols-2 gap-5 p-10 md:grid-cols-3 lg:grid-cols-4">
        {drive.children.map((folder: { id: string; folderName: string }) => {
          return (
            <div className="group relative" key={folder.id}>
              <DriveCard
                onClick={() => navigate(`/drive/${folder.id}`)}
                icon={getFileIcon("default")}
                title={folder.folderName}
              />
              {errors && (
                <span className="flex items-center gap-2 text-sm leading-none font-medium text-red-600 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                  Delete failed!
                </span>
              )}
              {folderToDelete?.id === folder.id ? (
                <Button
                  className="hover:bg-destructive absolute top-2 right-2 hidden cursor-pointer group-hover:block"
                  onClick={() => {
                    handleDelete();
                  }}
                >
                  Confirm
                </Button>
              ) : (
                <Button
                  className="absolute top-2 right-2 hidden cursor-pointer group-hover:block"
                  onClick={() => {
                    setFolderToDelete({
                      id: folder.id,
                      folderName: folder.folderName,
                    });
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          );
        })}
        {drive.files.map(
          (file: { id: string; originalName: string; mimeType: string }) => {
            return (
              <DriveCard
                key={file.id}
                onClick={() => navigate(`/file/${file.id}`)}
                icon={getFileIcon(file.mimeType)}
                title={file.originalName}
              />
            );
          },
        )}
      </main>
    </div>
  );
}

export default DrivePage;
