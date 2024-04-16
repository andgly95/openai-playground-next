// components/ImageGenerator.tsx

"use client";

import React, { useState } from "react";
import GlassmorphicCard from "./GlassmorphicCard";

const modelOptions = ["dall-e-3", "dall-e-2"];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(modelOptions[0]);
  const [isChangingModel, setIsChangingModel] = useState(false);

  const handleGenerateImage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/generate_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log(data);

      setGeneratedImage(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };
  return (
    <GlassmorphicCard title="Image Generator">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border border-gray-300 p-4 rounded-md"
      />
      <button
        onClick={handleGenerateImage}
        className={`w-full bg-indigo-500 text-white p-4 rounded-full ${
          !prompt || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-indigo-600"
        }`}
        disabled={isLoading}
      >
        Generate Image
      </button>
      {generatedImage && (
        <img src={generatedImage} alt="Generated" className="mt-4" />
      )}
      {!isChangingModel ? (
        <button
          className="flex text-white text-sm"
          onClick={(e) => setIsChangingModel(true)}
        >
          {model}
        </button>
      ) : (
        <select
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            setIsChangingModel(false);
          }}
          className="w-full border border-gray-300 bg-neutral-400 px-4 py-2 rounded-md"
        >
          {modelOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </GlassmorphicCard>
  );
};

export default ImageGenerator;
