import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ModeToggle } from "../components/mode-toggle";
import { ThemeProvider } from "../context/theme-provider";

function Loading() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="bg-background flex h-dvh items-center justify-center">
        <div className="absolute top-1 right-1 z-10">
          <ModeToggle />
        </div>
        <DotLottieReact
          src="/loading.lottie"
          loop
          autoplay
          className="aspect-square h-60 place-self-center md:h-100 lg:h-120 lg:w-240"
        />
      </div>
    </ThemeProvider>
  );
}

export default Loading;
