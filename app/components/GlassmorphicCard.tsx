import React, { ReactNode } from "react";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`p-6 bg-white/20 backdrop-blur-lg rounded-lg shadow-md flex flex-col gap-4 w-full ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;
