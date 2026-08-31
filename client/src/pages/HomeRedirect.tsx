import { Navigate, useRouteLoaderData } from "react-router";
import type { User } from "../context/User";

export default function HomeRedirect() {
  const user = useRouteLoaderData<User | null>("root");
  console.log("HOME REDIRECT USER:", user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={`/drive/${user.rootFolderId}`} replace />;
}
