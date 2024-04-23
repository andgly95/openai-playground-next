import React, { ReactNode } from "react";

interface GlassmorphicCardProps {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  title?: string;
  size?: "small" | "medium" | "large";
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className,
  title,
  size = "large",
  actions,
}) => {
  return (
    <div
      className={`p-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-md flex flex-col gap-4 w-full ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {title && (
          <h2
            className={`${
              size === "large" ? "text-2xl" : "text-xl"
            } font-bold text-white`}
          >
            {title}
          </h2>
        )}
        {actions}
      </div>
      {children}
    </div>
  );
};

export default GlassmorphicCard;
