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
      className="bg-secondary text-primary grid h-40 md:h-50 lg:h-60 cursor-pointer place-items-center overflow-hidden rounded-xl border p-3 shadow"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <span className="flex h-4/5 items-center justify-center">{icon}</span>
      <span>{title}</span>
    </div>
  );
}

export default DriveCard;
