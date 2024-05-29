import React from "react";
import { GameScreen } from "./components/GameScreen";

const SimulationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Guess AI Simulation
      </h1>
      <GameScreen />
    </div>
  );
};

export default SimulationPage;
