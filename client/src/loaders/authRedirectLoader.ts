import axios from "axios";
import { redirect } from "react-router";
import { authenticate } from "../service/authenticate";

export async function authRedirectLoader() {
  try {
    await authenticate();
    throw redirect("/");
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}
