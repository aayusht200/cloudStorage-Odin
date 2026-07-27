import { File } from "lucide-react";
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
import { driveLoader } from "../loaders/driveLoader";
import { upload } from "../service/upload";
type UploadFormValues = {
  file: FileList;
};
function UploadPage() {
  const drive = useLoaderData<typeof driveLoader>();
  const [_, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UploadFormValues>({
    shouldUseNativeValidation: false,
    progressive: false,
  });
  const onSubmit: SubmitHandler<UploadFormValues> = async (data) => {
    setError(false);
    try {
      await upload({
        folderId: drive.id,
        file: data.file[0],
      });

      navigate(`/drive/${drive.id}`);
    } catch {
      setError(true);
    }
  };
  const onError: SubmitErrorHandler<UploadFormValues> = () => setError(false);

  return (
    <div className="flex h-dvh flex-col">
      <DriveHeader path={drive.path} folderId={drive.id} />
      <main className="flex h-full items-center justify-center">
        <Card className="flex h-50 w-full max-w-sm flex-col md:h-60 lg:h-100">
          <CardHeader className="h-2/10">
            <CardTitle>CloudDrive</CardTitle>
            <CardDescription>
              Upload to
              {drive.folderName.toUpperCase()[0] + drive.folderName.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid h-full">
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              encType="multipart/form-data"
            >
              <div className="grid h-full items-center justify-center">
                <Label htmlFor="file">
                  <File /> Chose File
                </Label>
                <Input
                  id="file"
                  type="file"
                  {...register("file", { required: "Please select a file." })}
                />
                {errors.file?.message && <p>{errors.file.message}</p>}
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-fit cursor-pointer"
                >
                  {isSubmitting ? "Uploading data..." : "Upload"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default UploadPage;
