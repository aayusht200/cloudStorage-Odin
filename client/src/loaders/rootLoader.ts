import axios from "axios";
import { authenticate } from "../service/authenticate";
export async function rootLoader() {
  try {
    const user = await authenticate();
    return user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}
