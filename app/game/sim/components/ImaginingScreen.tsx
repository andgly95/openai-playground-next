// ImaginingScreen.tsx
import React, { useState } from "react";

interface ImaginingScreenProps {
  onSubmitPrompt: (prompt: string) => void;
}

export const ImaginingScreen: React.FC<ImaginingScreenProps> = ({
  onSubmitPrompt,
}) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    onSubmitPrompt(prompt);
    setPrompt("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-8">Imagine an Image</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        placeholder="Enter your prompt"
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
