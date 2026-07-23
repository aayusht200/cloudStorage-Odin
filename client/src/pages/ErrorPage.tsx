import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";
import { ThemeProvider } from "../context/theme-provider";
import { UserContext } from "../context/UserContext";

export default function ErrorPage() {
  const { user } = useContext(UserContext);
  console.log(user);
  const navigate = useNavigate();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="bg-background flex h-dvh flex-col items-center justify-center gap-10">
        <div className="absolute top-1 right-1 z-10">
          <ModeToggle />
        </div>
        <DotLottieReact
          src="/404.lottie"
          loop
          autoplay
          className="aspect-square h-60 place-self-center md:h-100 lg:h-120 lg:w-240"
        />
        <Button
          variant="default"
          onClick={() => navigate("/", { replace: true })}
          className="cursor-pointer"
        >
          Go Back
        </Button>
      </div>
    </ThemeProvider>
  );
}
