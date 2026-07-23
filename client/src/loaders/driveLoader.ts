import axios from "axios";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getFolder } from "../service/getFolder";

export async function driveLoader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Folder ID missing", { status: 400 });
  }

  try {
    return await getFolder(params.id);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/login");
    }

    throw error;
  }
}
