// GameScreen.tsx
"use client";

import React, { useEffect, useReducer } from "react";
import { GameState } from "../types";
import { WaitingScreen } from "./WaitingScreen";
import { ImaginingScreen } from "./ImaginingScreen";
import { GuessingScreen } from "./GuessingScreen";
import { GameOverScreen } from "./GameOverScreen";
import { PlayerList } from "./PlayerList";
import { gameReducer } from "../gameReducer";

const initialGameState: GameState = {
  game_id: `game${Math.random().toString(36).substring(7)}`,
  status: "waiting",
  current_round: 0,
  total_rounds: 5,
  players: [],
  current_prompt: "",
  current_image: "",
  submitted_prompts: [],
  submitted_guesses: [],
};

export const GameScreen: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  const handleJoinGame = () => {
    const playerId = `player${Math.random().toString(36).substring(7)}`;
    const playerName = `Player ${playerId}`;
    dispatch({ type: "JOIN_GAME", payload: { playerId, playerName } });
  };

  useEffect(() => {
    if (gameState.players.length >= 5) {
      dispatch({ type: "START_GAME" });
    }
  }, [gameState.players.length]);

  const handleSubmitPrompt = (prompt: string) => {
    const playerId = gameState.players[gameState.submitted_prompts.length].id;
    dispatch({ type: "SUBMIT_PROMPT", payload: { playerId, prompt } });
  };

  const handleSubmitGuess = (targetPlayerId: string, guess: string) => {
    const playerId = gameState.players.find(
      (player) => !gameState.submitted_guesses.some(([id]) => id === player.id)
    )?.id;
    if (playerId) {
      dispatch({
        type: "SUBMIT_GUESS",
        payload: { playerId, targetPlayerId, guess },
      });
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        <PlayerList players={gameState.players} />
      </div>
      <div className="w-3/4">
        {(() => {
          switch (gameState.status) {
            case "waiting":
              return <WaitingScreen onJoinGame={handleJoinGame} />;
            case "imagining":
              return <ImaginingScreen onSubmitPrompt={handleSubmitPrompt} />;
            case "guessing":
              return (
                <GuessingScreen
                  players={gameState.players}
                  currentImage={gameState.current_image}
                  onSubmitGuess={handleSubmitGuess}
                />
              );
            case "finished":
              return <GameOverScreen />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};
