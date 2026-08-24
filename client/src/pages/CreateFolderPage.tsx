import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import DriveHeader from "../components/ui/DriveHeader";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import type { driveLoader } from "../loaders/driveLoader";
import { createFolderSchema, type CreateFolderPayload } from "../schema/folder";
import { createFolder } from "../service/createFolder";
export function CreateFolder() {
  const [error, setError] = useState<boolean>(false);
  const drive = useLoaderData<typeof driveLoader>();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateFolderPayload>({
    resolver: zodResolver(createFolderSchema),
  });
  const onSubmit: SubmitHandler<CreateFolderPayload> = async (data) => {
    setError(false);
    try {
      await createFolder({
        folderName: data.folderName,
        parentId: drive.id,
      });
      navigate(`/drive/${drive.id}`, { replace: true });
    } catch {
      setError(true);
    }
  };
  const onError: SubmitErrorHandler<CreateFolderPayload> = () =>
    setError(false);
  return (
    <div className="flex h-dvh flex-col">
      <DriveHeader path={drive.path} />
      <main className="flex h-full items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>CloudDrive</CardTitle>
            <CardDescription>
              Create folder in {drive.folderName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              aria-label="Create Folder"
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    type="text"
                    placeholder="Photos"
                    {...register("folderName")}
                    aria-describedby={
                      errors.folderName ? "error-folderName" : undefined
                    }
                  />
                  {errors.folderName && (
                    <span
                      id="error-folderName"
                      className="flex items-center gap-2 text-sm leading-none font-medium text-red-600 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                    >
                      {errors.folderName.message}
                    </span>
                  )}
                </div>
                {error && (
                  <p aria-label="form-error">
                    Folder with same name exists as this location.
                  </p>
                )}
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full cursor-pointer"
                >
                  {isSubmitting ? "Creating folder..." : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
