import { inject } from "@vercel/analytics";
import { Outlet, useLoaderData } from "react-router";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./context/theme-provider";
import type { User } from "./context/User";
import { UserProvider } from "./context/UserProvider";

inject();
function App() {
  const user = useLoaderData() as User | null;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider initialUser={user}>
        <div className="bg-background h-dvh">
          <div className="absolute top-3 right-1 z-10">
            <ModeToggle />
          </div>

          <Outlet />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
