import React, { ReactNode } from "react";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  title: string;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className,
  title,
}) => {
  return (
    <div
      className={`p-6 bg-white/20 backdrop-blur-lg rounded-lg shadow-md flex flex-col gap-4 w-full ${
        className || ""
      }`}
    >
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {children}
    </div>
  );
};

export default GlassmorphicCard;
