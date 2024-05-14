"use client";
import React, { useEffect, useState } from "react";
import GlassmorphicCard from "../components/GlassmorphicCard";

const GameComponent = () => {
  const [username, setUsername] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [gameUuid, setGameUuid] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [gameState, setGameState] = useState(null);

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
      setMessage("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Error creating user");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
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
      setGameUuid(data.game_uuid);
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

  return (
    <GlassmorphicCard className="container mx-auto p-4" title="Game Component">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 mr-2"
        />
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </div>
      <div className="mb-4">
        <p>User ID: {userId}</p>
        <p>Token: {token}</p>
        {gameUuid && <p>Game UUID: {gameUuid}</p>}
      </div>
      <div className="mb-4">
        <button
          onClick={handleCreateGame}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Create Game
        </button>
        <input
          type="text"
          placeholder="Game Code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 mr-2"
        />
        <button
          onClick={handleJoinGame}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Join Game
        </button>
      </div>
      {gameState && (
        <div>
          <h2>Game State</h2>
          <p>Status: {(gameState as any).status}</p>
          <p>Players:</p>
          <ul>
            {(gameState as any).players?.map((player: any) => (
              <li key={player.id}>
                {player.username} - {player.ready ? "Ready" : "Not Ready"}
              </li>
            ))}
          </ul>
          <button onClick={handlePlayerReady}>Ready</button>
        </div>
      )}
      <div className="bg-gray-100 p-4 rounded">
        <p>{message}</p>
      </div>
    </GlassmorphicCard>
  );
};

export default GameComponent;
