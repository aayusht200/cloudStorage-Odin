import { Outlet, useLoaderData } from "react-router";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./context/theme-provider";
import type { UserProps } from "./context/UserContext";
import { UserProvider } from "./context/UserProvider";

function App() {
  const user = useLoaderData() as UserProps | null;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider initialUser={user}>
        <div className="bg-background flex h-dvh items-center justify-center">
          <div className="absolute top-1 right-1 z-10">
            <ModeToggle />
          </div>

          <Outlet />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
