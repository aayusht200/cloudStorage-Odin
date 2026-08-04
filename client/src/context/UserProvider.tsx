import type React from "react";
import { useState } from "react";
import { login } from "../service/login";
import { logout } from "../service/logout";
import { signup } from "../service/signup";

import { useNavigate } from "react-router";
import type { LoginPayload, SignupPayload } from "../schema/auth";
import type { User } from "./User";
import { defaultUser, UserContext } from "./User";

type UserProviderProps = {
  children: React.ReactNode;
  initialUser: User | null;
};

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [user, setUser] = useState(initialUser ?? defaultUser);
  const navigate = useNavigate();
  const loginUser = async ({ email, password }: LoginPayload) => {
    const verifiedUser = await login({ email, password });
    setUser(verifiedUser.user);
  };
  const logoutUser = async () => {
    await logout();
    setUser(defaultUser);
    navigate("/login", { replace: true });
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
