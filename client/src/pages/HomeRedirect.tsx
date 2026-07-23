import { Navigate, useRouteLoaderData } from "react-router";
import type { UserProps } from "../context/UserContext";

export default function HomeRedirect() {
  const user = useRouteLoaderData<UserProps | null>("root");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={`/drive/${user.rootFolderId}`} replace />;
}
