import { createBrowserRouter } from "react-router";
import App from "./App";
import { authLoader } from "./loaders/authLoader";
import { authRedirectLoader } from "./loaders/authRedirectLoader";
import { rootLoader } from "./loaders/rootLoader";
import DrivePage from "./pages/DrivePage";
import ErrorPage from "./pages/ErrorPage";
import HomeRedirect from "./pages/HomeRedirect";
import Loading from "./pages/Loading";
import { Login } from "./pages/Login";
import SignupPage from "./pages/SignupPage";
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
        path: "drive",
        loader: authLoader,
        element: <DrivePage />,
      },
    ],
  },
]);
