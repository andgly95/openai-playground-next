// WaitingScreen.tsx
import React from "react";

interface WaitingScreenProps {
  onJoinGame: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ onJoinGame }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Guess AI</h1>
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        onClick={onJoinGame}
      >
        Join Game
      </button>
    </div>
  );
};
