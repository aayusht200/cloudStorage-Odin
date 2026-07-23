import { redirect } from "react-router";
import { authenticate } from "../service/authenticate";

export async function authLoader() {
  try {
    return await authenticate();
  } catch {
    throw redirect("/login");
  }
}
