import { createBrowserRouter } from "react-router";
import App from "./App";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import { authLoader } from "./loaders/authLoader";
import { rootLoader } from "./loaders/rootLoader";
import DrivePage from "./pages/DrivePage";
import ErrorPage from "./pages/ErrorPage";
import Loading from "./pages/Loading";
import { Login } from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    HydrateFallback: Loading,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: rootLoader,
        element: <Loading />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        loader: authLoader,
        element: <AuthenticatedLayout />,
        children: [
          {
            path: "drive",
            element: <DrivePage />,
          },
        ],
      },
    ],
  },
]);
