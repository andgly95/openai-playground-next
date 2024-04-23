// components/LoadingSpinner.tsx
import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-white animate-bounce animation-delay-200"></div>
      <div className="w-4 h-4 rounded-full bg-white animate-bounce animation-delay-400"></div>
    </div>
  );
};

export default LoadingSpinner;
