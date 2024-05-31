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
  image_url: string;
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
      className="container mx-auto p-8 max-w-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 backdrop-blur-md rounded-xl shadow-lg text-white"
      title="ImagiChat Game"
    >
      {!userId && (
        <div className="mb-8">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-white rounded-lg px-4 py-2 mr-4 bg-black/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-300"
          />
          <button
            onClick={handleCreateUser}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Create User
          </button>
        </div>
      )}
      <div className="mb-8">
        <p className="text-lg mb-2">
          <strong>User ID:</strong> {userId}
        </p>
        <p className="text-lg mb-2">
          <strong>Token:</strong> {token}
        </p>
        {gameUuid && (
          <p className="text-lg">
            <strong>Game UUID:</strong> {gameUuid}
          </p>
        )}
      </div>
      {!gameState && (
        <div className="mb-8">
          <button
            onClick={handleCreateGame}
            className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-semibold px-6 py-2 rounded-lg mr-4 transition-colors duration-200"
          >
            Create Game
          </button>
          <input
            type="text"
            placeholder="Game Code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            className="border border-white rounded-lg px-4 py-2 mr-4 bg-black/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-300"
          />
          <button
            onClick={handleJoinGame}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Join Game
          </button>
        </div>
      )}
      {gameState && (
        <div className="bg-black/30 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Game State - {gameCode}
          </h2>
          <p className="text-lg font-medium mb-4 text-white">
            Status: {gameState?.status}
          </p>
          <div className="mb-6">
            <p className="text-lg font-medium mb-2 text-white">Players:</p>
            <ul className="bg-black/20 rounded-lg p-4">
              {gameState.players?.map((player) => (
                <li key={player.id} className="mb-2 text-white">
                  <span className="font-semibold">{player.username}</span> -{" "}
                  <span
                    className={`${
                      player.ready ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {player.ready ? "Ready" : "Not Ready"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
            onClick={handlePlayerReady}
          >
            Ready
          </button>
        </div>
      )}
      {gameState?.status === "imagining" && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Submit Prompt
          </h2>
          <input
            type="text"
            placeholder="Prompt"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="border border-white rounded-lg px-4 py-2 mr-4 bg-black/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-300"
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
            onClick={handleSubmitPrompt}
          >
            Submit Prompt
          </button>
        </div>
      )}
      {gameState?.status === "guessing" && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Submit Guess
          </h2>
          <div className="mb-4">
            <img
              src={gameState.current_image}
              alt="Generated Image"
              className="w-full rounded-lg shadow-md"
            />
          </div>
          <input
            type="text"
            placeholder="Guess"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            className="border border-white rounded-lg px-4 py-2 mr-4 bg-black/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-300"
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
            onClick={handleSubmitGuess}
          >
            Submit Guess
          </button>
        </div>
      )}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mt-8 rounded-lg">
          <p className="font-medium">{message}</p>
        </div>
      )}
    </GlassmorphicCard>
  );
};

export default GameComponent;
