import type React from "react";
import { useState } from "react";
import { login } from "../service/login";
import { logout } from "../service/logout";
import { signup } from "../service/signup";
import type { LoginPayload, SignupPayload, UserProps } from "./UserContext";
import { InitialUser, UserContext } from "./UserContext";
type UserProviderProps = {
  children: React.ReactNode;
  initialUser: UserProps;
};

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [user, setUser] = useState(initialUser);
  const loginUser = async ({ email, password }: LoginPayload) => {
    try {
      const data = await login({ email, password });
      setUser(data.user);
    } catch (error) {
      throw error;
    }
  };
  const logoutUser = async () => {
    try {
      await logout();
      setUser(InitialUser);
    } catch (error) {
      throw error;
    }
  };

  const signupUser = async ({
    email,
    password,
    firstName,
    lastName,
  }: SignupPayload) => {
    try {
      await signup({
        email,
        password,
        firstName,
        lastName,
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        signupUser,
        isLoggedIn: user.id !== "",
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
