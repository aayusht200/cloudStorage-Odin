import { Navigate, useRouteLoaderData } from "react-router";
import type { UserProps } from "../context/UserContext";

export default function HomeRedirect() {
  const user = useRouteLoaderData("root") as UserProps | null;

  if (user) {
    return <Navigate to="/drive" replace />;
  }

  return <Navigate to="/login" replace />;
}
