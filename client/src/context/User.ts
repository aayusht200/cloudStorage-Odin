import { createContext } from "react";
import type { LoginPayload, SignupPayload } from "../schema/auth";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
  rootFolderId: string;
};

export const defaultUser: User = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  role: "USER",
  rootFolderId: "",
};

export type UserContextProps = {
  user: User;
  loginUser: (payload: LoginPayload) => Promise<void>;
  logoutUser: () => Promise<void>;
  signupUser: (payload: SignupPayload) => Promise<void>;
  isLoggedIn: boolean;
};

export const UserContext = createContext<UserContextProps>({
  user: defaultUser,
  loginUser: async () => {},
  logoutUser: async () => {},
  signupUser: async () => {},
  isLoggedIn: false,
});
