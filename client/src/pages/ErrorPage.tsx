import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";
import { ThemeProvider } from "../context/theme-provider";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className="bg-background flex h-dvh flex-col items-center justify-center gap-10"
        aria-label="Error Page"
      >
        <div className="absolute top-1 right-1 z-10">
          <ModeToggle />
        </div>
        <DotLottieReact
          src="/404.lottie"
          loop
          autoplay
          className="aspect-square h-60 place-self-center md:h-100 lg:h-120 lg:w-240"
        />
        <h1 className="font-heading text-primary text-2xl">
          Something went wrong
        </h1>
        <Button
          variant="default"
          onClick={() => navigate("/", { replace: true })}
          className="cursor-pointer"
        >
          Go to Home
        </Button>
      </div>
    </ThemeProvider>
  );
}
