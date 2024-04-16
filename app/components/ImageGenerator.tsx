// components/ImageGenerator.tsx

"use client";

import React, { useState } from "react";

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="p-4 bg-gray">
      <h2 className="text-2xl font-bold mb-4">Image Generator</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border border-gray-300 p-4 rounded-md mb-2"
      />
      <button
        onClick={handleGenerateImage}
        className={`w-full bg-blue-500 text-white p-4 rounded-md ${
          !prompt || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600"
        }`}
        disabled={isLoading}
      >
        Generate Image
      </button>
      {generatedImage && (
        <img src={generatedImage} alt="Generated" className="mt-4" />
      )}
    </div>
  );
};

export default ImageGenerator;
