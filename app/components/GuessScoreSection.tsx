// components/GuessScoreSection.tsx

"use client";

import React, { useState } from "react";
import GlassmorphicCard from "./GlassmorphicCard";
import HistorySection from "./HistorySection";

export interface GuessScore {
  id: string;
  prompt: string;
  guess: string;
  score: number;
  timestamp: number;
}

const GuessScoreSection: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guessScores, setGuessScores] = useState<GuessScore[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  const handleScoreGuess = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://8ee0-70-23-243-115.ngrok-free.app/score_guess",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, guess }),
        }
      );

      const data = await response.text();
      const parsedScore = parseInt(data, 10);
      setScore(parsedScore);

      const newGuessScore: GuessScore = {
        id: `guess_${Date.now()}`,
        prompt,
        guess,
        score: parsedScore,
        timestamp: Date.now(),
      };
      setGuessScores([...guessScores, newGuessScore]);
      setPrompt("");
      setGuess("");
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <GlassmorphicCard title="Guess Scoring">
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-white mb-2">
              Prompt:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-neutral-600 text-white px-4 py-2 rounded-md"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="guess" className="block text-white mb-2">
              Guess:
            </label>
            <textarea
              id="guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full bg-neutral-600 text-white px-4 py-2 rounded-md"
            ></textarea>
          </div>
          <button
            onClick={handleScoreGuess}
            className={`bg-indigo-500 text-white px-4 py-2 rounded-md ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Scoring..." : "Score Guess"}
          </button>
          {score !== null && (
            <div className="mt-4 text-white">
              <strong>Score:</strong> {score}
            </div>
          )}
        </div>
      </GlassmorphicCard>
      {guessScores.length > 0 && (
        <HistorySection
          title="Guess Scores"
          history={guessScores}
          showHistory={showHistory}
          type="guess"
          setShowHistory={setShowHistory}
          clearHistory={() => setGuessScores([])}
          onDeleteItem={(item) => {
            const updatedGuessScores = guessScores.filter(
              (gs) => gs.id !== (item as GuessScore).id
            );
            setGuessScores(updatedGuessScores);
          }}
        />
      )}
    </div>
  );
};

export default GuessScoreSection;
