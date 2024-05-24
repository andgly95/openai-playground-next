// GuessingScreen.tsx
import React, { useState } from "react";
import { Player } from "../types";

interface GuessingScreenProps {
  players: Player[];
  currentImage: string;
  onSubmitGuess: (targetPlayerId: string, guess: string) => void;
}

export const GuessingScreen: React.FC<GuessingScreenProps> = ({
  players,
  currentImage,
  onSubmitGuess,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [guess, setGuess] = useState("");

  const handleSubmit = () => {
    onSubmitGuess(selectedPlayer, guess);
    setSelectedPlayer("");
    setGuess("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-8">Guess the Prompt</h2>
      <img src={currentImage} alt="Generated Image" className="mb-8" />
      <select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
      >
        <option value="">Select a player</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        placeholder="Enter your guess"
      />
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};
