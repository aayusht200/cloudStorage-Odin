import { ModeToggle } from "../components/mode-toggle";
import { ThemeProvider } from "../components/theme-provider";
import { Login } from "../pages/Login";
import "./App.css";
function App() {
  return (
    <div className="bg-background flex h-dvh items-center justify-center">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="theme absolute top-1 right-1 z-10">
          <ModeToggle />
        </div>
        <Login />
      </ThemeProvider>
    </div>
  );
}

export default App;
