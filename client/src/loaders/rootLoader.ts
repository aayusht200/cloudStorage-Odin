import { authenticate } from "../service/authenticate";
export async function rootLoader() {
  try {
    const user = await authenticate();
    return user;
  } catch {
    return null;
  }
}
