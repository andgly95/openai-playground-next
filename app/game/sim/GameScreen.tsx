"use client";
import React, { useEffect, useState } from "react";
import { GameState } from "./types";
import { MockServer } from "./mockServer";
import { WaitingScreen } from "./WaitingScreen";
import { ImaginingScreen } from "./ImaginingScreen";
import { GuessingScreen } from "./GuessingScreen";
import { GameOverScreen } from "./GameOverScreen";
import { PlayerList } from "./PlayerList";

export const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState(new MockServer().getGameState());
  const mockServer = React.useRef(new MockServer()).current;

  const handleJoinGame = () => {
    const playerId = `player${Math.random().toString(36).substring(7)}`;
    const playerName = `Player ${playerId}`;
    mockServer.joinGame(playerId, playerName);
    setGameState(mockServer.getGameState());
  };

  const checkAndStartGame = (newGameState: GameState) => {
    if (newGameState.players.length >= 5) {
      mockServer.startGame();
      setGameState(mockServer.getGameState());
    }
  };

  useEffect(() => {
    const newGameState = mockServer.getGameState();
    checkAndStartGame(newGameState);
  }, [gameState.players.length]);

  const handleSubmitPrompt = (prompt: string) => {
    const playerId = gameState.players[gameState.submitted_prompts.length].id;
    mockServer.submitPrompt(playerId, prompt);
    setGameState(mockServer.getGameState());
  };

  const handleSubmitGuess = (targetPlayerId: string, guess: string) => {
    const playerId = gameState.players.find(
      (player) => !gameState.submitted_guesses.some(([id]) => id === player.id)
    )?.id;
    if (playerId) {
      mockServer.submitGuess(playerId, targetPlayerId, guess);
      setGameState(mockServer.getGameState());
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
