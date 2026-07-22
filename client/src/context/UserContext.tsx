export type UserProps = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
};

export const InitialUser: UserProps = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  role: "USER",
};

export type UserContextProps = {};
