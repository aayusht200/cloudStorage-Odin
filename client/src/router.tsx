import { createBrowserRouter } from "react-router";
import App from "./App";
import { authRedirectLoader } from "./loaders/authRedirectLoader";
import { driveLoader } from "./loaders/driveLoader";
import { filesLoader } from "./loaders/filesLoader";
import { rootLoader } from "./loaders/rootLoader";
import DrivePage from "./pages/DrivePage";
import ErrorPage from "./pages/ErrorPage";
import FilesPage from "./pages/FilesPage";
import HomeRedirect from "./pages/HomeRedirect";
import Loading from "./pages/Loading";
import { Login } from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import UploadPage from "./pages/UploadPage";
export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <App />,
    loader: rootLoader,
    HydrateFallback: Loading,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomeRedirect />,
      },
      {
        path: "login",
        loader: authRedirectLoader,
        element: <Login />,
      },
      {
        path: "signup",
        loader: authRedirectLoader,
        element: <SignupPage />,
      },
      {
        path: "drive/:id",
        loader: driveLoader,
        element: <DrivePage />,
      },
      {
        path: "upload/:id",
        loader: driveLoader,
        element: <UploadPage />,
      },
      {
        path: "file/:id",
        loader: filesLoader,
        element: <FilesPage />,
      },
    ],
  },
]);
