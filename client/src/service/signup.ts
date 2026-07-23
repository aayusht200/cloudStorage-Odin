import type { SignupPayload } from "../context/UserContext";
import { api } from "./api";
export const signup = async ({
  email,
  password,
  firstName,
  lastName,
}: SignupPayload) => {
  const result = await api.post("/users/signup", {
    email,
    password,
    firstName,
    lastName,
  });
  return result.data;
};
