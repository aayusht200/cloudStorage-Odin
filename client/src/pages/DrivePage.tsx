import { useLoaderData, useNavigate } from "react-router";
import DriveCard from "../components/ui/DriveCard";
import DriveHeader from "../components/ui/DriveHeader";
import { getFileIcon } from "../helperFunction/getFileIcon";
import type { driveLoader } from "../loaders/driveLoader";
function DrivePage() {
  const drive = useLoaderData<typeof driveLoader>();
  const navigate = useNavigate();
  return (
    <div className="flex h-dvh flex-col">
      <DriveHeader path={drive.path} folderId={drive.id} />
      <main className="grid grid-cols-2 gap-5 p-10 md:grid-cols-3 lg:grid-cols-4">
        {drive.children.map((folder: { id: string; folderName: string }) => {
          return (
            <DriveCard
              key={folder.id}
              onClick={() => navigate(`/drive/${folder.id}`)}
              icon={getFileIcon("default")}
              title={folder.folderName}
            />
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
