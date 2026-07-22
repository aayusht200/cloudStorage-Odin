import { createContext } from "react";

export type UserProps = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const InitialUser: UserProps = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  role: "USER",
};

export type UserContextProps = {
  user: UserProps;
  loginUser: ({ email, password }: LoginPayload) => Promise<void>;
  logoutUser: () => Promise<void>;
  signupUser: ({
    email,
    password,
    firstName,
    lastName,
  }: SignupPayload) => Promise<void>;
};

export const UserContext = createContext<UserContextProps>({
  user: InitialUser,
  loginUser: async () => {},
  logoutUser: async () => {},
  signupUser: async () => {},
});
