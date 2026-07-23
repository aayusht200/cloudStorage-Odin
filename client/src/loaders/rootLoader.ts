import { redirect } from "react-router";
import { authenticate } from "../service/authenticate";

export async function rootLoader() {
  try {
    await authenticate();
    return redirect("/drive");
  } catch {
    return redirect("/login");
  }
}
