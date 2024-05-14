"use client";
import React, { useEffect, useState } from "react";
import GlassmorphicCard from "../components/GlassmorphicCard";

export type GameState = {
  current_image: string;
  current_prompt: string;
  current_round: number;
  game_id: string;
  players: Player[];
  status: "waiting" | "imagining" | "guessing" | "finished";
  submitted_guesses: SubmittedGuess[];
  submitted_prompts: SubmittedPrompt[];
  total_rounds: number;
};

export type Player = {
  id: string;
  username: string;
  score: number;
  ready: boolean;
};

export type SubmittedPrompt = {
  player_id: string;
  prompt: string;
};

export type SubmittedGuess = {
  player_id: string;
  guess: string;
};

const GameComponent = () => {
  const [username, setUsername] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [gameUuid, setGameUuid] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [gameState, setGameState] = useState<GameState>();

  const [promptInput, setPromptInput] = useState("");
  const [guessInput, setGuessInput] = useState("");

  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      setUserId(data.user_id);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user_id);
      setMessage("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Error creating user");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedToken) {
      setToken(storedToken);
      // You can also fetch user information from the server using the stored token
    }
  }, []);

  const handleCreateGame = async () => {
    try {
      const response = await fetch("http://localhost:8080/create_game", {
        method: "POST",
      });
      const data = await response.json();
      setGameCode(data.game_code);
      setMessage("Game created successfully");
    } catch (error) {
      console.error("Error creating game:", error);
      setMessage("Error creating game");
    }
  };

  const handleJoinGame = async () => {
    try {
      const response = await fetch("http://localhost:8080/join_game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game_code: gameCode, player_id: userId }),
      });
      const data = await response.json();
      setGameUuid(data.game_id);
      setGameState(data);
      setMessage("Joined game successfully");
    } catch (error) {
      console.error("Error joining game:", error);
      setMessage("Error joining game");
    }
  };

  const handlePlayerReady = async () => {
    try {
      const response = await fetch("http://localhost:8080/player_ready", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_uuid: gameUuid,
          player_id: userId,
        }),
      });
      const data = await response.json();
      setGameState(data);
      setMessage("Player ready");
    } catch (error) {
      console.error("Error setting player ready:", error);
      setMessage("Error setting player ready");
    }
  };

  const handleSubmitPrompt = async () => {
    try {
      const response = await fetch("http://localhost:8080/submit_prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_uuid: gameUuid,
          player_id: userId,
          prompt: promptInput,
        }),
      });
      const data = await response.json();
      setGameState(data);
      setMessage("Prompt submitted");
    } catch (error) {
      console.error("Error submitting prompt:", error);
      setMessage("Error submitting prompt");
    }
  };

  const handleSubmitGuess = async () => {
    try {
      const response = await fetch("http://localhost:8080/submit_guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_uuid: gameUuid,
          player_id: userId,
          guess: guessInput,
        }),
      });
      const data = await response.json();
      setGameState(data);
      setMessage("Guess submitted");
    } catch (error) {
      console.error("Error submitting guess:", error);
      setMessage("Error submitting guess");
    }
  };

  return (
    <GlassmorphicCard
      className="container mx-auto p-8 max-w-lg bg-white/30 backdrop-blur-md rounded-xl shadow-lg"
      title="Game Component"
    >
      {!userId && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleCreateUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Create User
          </button>
        </div>
      )}
      <div className="mb-6">
        <p className="text-gray-700 mb-2">
          <strong>User ID:</strong> {userId}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Token:</strong> {token}
        </p>
        {gameUuid && (
          <p className="text-gray-700">
            <strong>Game UUID:</strong> {gameUuid}
          </p>
        )}
      </div>
      {!gameState && (
        <div className="mb-6">
          <button
            onClick={handleCreateGame}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-2 transition-colors duration-200"
          >
            Create Game
          </button>
          <input
            type="text"
            placeholder="Game Code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleJoinGame}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Join Game
          </button>
        </div>
      )}
      {gameState && (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Game State - {gameCode}</h2>
          <strong>Status: {gameState?.status}</strong>
          <div>
            <p className="font-medium">Players:</p>
            <ul className="bg-neutral-300 rounded-lg p-3 mt-2">
              {gameState.players?.map((player) => (
                <li key={player.id}>
                  <span>{player.username}</span> -{" "}
                  <span>{player.ready ? "Ready" : "Not Ready"}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            onClick={handlePlayerReady}
          >
            Ready
          </button>
        </div>
      )}
      {gameState?.status === "imagining" && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Submit Prompt</h2>
          <input
            type="text"
            placeholder="Prompt"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:border-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            onClick={handleSubmitPrompt}
          >
            Submit Prompt
          </button>
        </div>
      )}
      {gameState?.status === "guessing" && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Submit Guess</h2>
          <input
            type="text"
            placeholder="Guess"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:border-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            onClick={handleSubmitGuess}
          >
            Submit Guess
          </button>
        </div>
      )}
      {message && (
        <div className="bg-gray-100 p-6 mt-6 rounded-lg text-center shadow-inner">
          <p>{message}</p>
        </div>
      )}
    </GlassmorphicCard>
  );
};

export default GameComponent;
