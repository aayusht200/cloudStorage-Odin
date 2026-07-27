import { IconCloud } from "@tabler/icons-react";

import { Button } from "../ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
type EmptyOutlineProps = {
  onClick: () => void;
};

export function EmptyOutline({ onClick }: EmptyOutlineProps) {
  return (
    <Empty className="h-full border border-dotted">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCloud />
        </EmptyMedia>
        <EmptyTitle>Cloud Storage Empty</EmptyTitle>
        <EmptyDescription>
          Upload files to your cloud storage to access them anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          size="sm"
          onClick={onClick}
          className="cursor-pointer"
        >
          Upload Files
        </Button>
      </EmptyContent>
    </Empty>
  );
}
