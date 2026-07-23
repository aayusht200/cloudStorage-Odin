import { redirect } from "react-router";
import { authenticate } from "../service/authenticate";

export async function loginLoader() {
  try {
    await authenticate();
    throw redirect("/drive");
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    return null;
  }
}
