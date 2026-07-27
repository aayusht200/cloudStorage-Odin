import { useLoaderData, useNavigate } from "react-router";
import DriveCard from "../components/ui/DriveCard";
import DriveHeader from "../components/ui/DriveHeader";
import { getFileIcon } from "../components/ui/getFileIcon";
import type { driveLoader } from "../loaders/driveLoader";
function DrivePage() {
  const drive = useLoaderData<typeof driveLoader>();
  const navigate = useNavigate();
  return (
    <div className="flex h-dvh flex-col">
      <DriveHeader path={drive.path} />
      <main className="flex">
        {drive.children.map((folder: { id: string; folderName: string }) => {
          const Icon = getFileIcon("default");
          return (
            <DriveCard
              key={folder.id}
              onClick={() => navigate(`/drive/${folder.id}`)}
              icon={<Icon />}
              title={folder.folderName}
            />
          );
        })}
        {drive.files.map(
          (file: { id: string; originalName: string; mimeType: string }) => {
            const Icon = getFileIcon(file.mimeType);
            return (
              <DriveCard
                key={file.id}
                onClick={() => navigate(`/file/${file.id}`)}
                icon={<Icon />}
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
