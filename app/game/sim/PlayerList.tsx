// PlayerList.tsx
import React from "react";
import { Player } from "./types";

interface PlayerListProps {
  players: Player[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id} className="mb-2">
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
