import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./context/theme-provider";
import { Login } from "./pages/Login";
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
