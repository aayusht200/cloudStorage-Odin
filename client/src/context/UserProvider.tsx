import type React from "react";
import { useState } from "react";
import { login } from "../service/login";
import { logout } from "../service/logout";
import { signup } from "../service/signup";

import { useNavigate } from "react-router";
import type { LoginPayload, SignupPayload, UserProps } from "./UserContext";
import { InitialUser, UserContext } from "./UserContext";
type UserProviderProps = {
  children: React.ReactNode;
  initialUser: UserProps | null;
};

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [user, setUser] = useState(initialUser ?? InitialUser);
  const navigate = useNavigate();
  const loginUser = async ({ email, password }: LoginPayload) => {
    const verifiedUser = await login({ email, password });
    setUser(verifiedUser.user);
  };
  const logoutUser = async () => {
    await logout();
    setUser(InitialUser);
    navigate("/", { replace: true });
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
