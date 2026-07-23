import { Outlet, useLoaderData } from "react-router";
import type { UserProps } from "../context/UserContext";
import { UserProvider } from "../context/UserProvider";

export default function AuthenticatedLayout() {
  const user = useLoaderData() as UserProps;

  return (
    <UserProvider initialUser={user}>
      <Outlet />
    </UserProvider>
  );
}
