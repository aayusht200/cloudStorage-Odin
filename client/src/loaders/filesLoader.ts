import axios from "axios";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getFile } from "../service/getFile";

export async function filesLoader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("File ID missing", { status: 400 });
  }

  try {
    return await getFile(params.id);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/login");
    }

    throw error;
  }
}
