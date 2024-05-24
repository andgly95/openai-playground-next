// GameOverScreen.tsx
import React from "react";

export const GameOverScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-4xl font-bold mb-8">Game Over</h2>
      <p className="text-xl">Thanks for playing!</p>
    </div>
  );
};
