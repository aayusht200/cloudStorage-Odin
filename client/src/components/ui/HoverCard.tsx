import { User } from "lucide-react";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
export function HoverCardReadme() {
  return (
    <HoverCard>
      <HoverCardTrigger
        delay={10}
        closeDelay={100}
        render={<Button variant="link">Read Me!</Button>}
      />
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <a
          href="https://github.com/aayusht200"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent"
        >
          <User /> click here
        </a>
        <div>This is a demo app created by Aayush Trivedi</div>
        <div className="text-muted-foreground mt-1 text-xs">
          Data will be wipped on regular intervals.
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
