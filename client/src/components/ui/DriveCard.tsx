import type React from "react";

function DriveCard({
  onClick,
  icon,
  title,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div
      role="button"
      onClick={onClick}
      tabIndex={0}
      className="border-foreground bg-accent grid cursor-pointer place-items-center rounded-xl border p-3 shadow"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      {icon}
      <span>{title}</span>
    </div>
  );
}

export default DriveCard;
