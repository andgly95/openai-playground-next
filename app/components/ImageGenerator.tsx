// components/ImageGenerator.tsx

"use client";

import React, { useEffect, useState } from "react";
import ModelSelector from "./ModelSelector";
import HistorySection from "./HistorySection";
import LoadingSpinner from "./LoadingSpinner";
import GlassmorphicCard from "./GlassmorphicCard";

const modelOptions = ["dall-e-3", "dall-e-2"];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(modelOptions[0]);
  const [showImageHistory, setShowImageHistory] = useState(true);
  const [imageHistory, setImageHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("imageHistory");
    if (storedHistory) {
      setImageHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleGenerateImage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://f759-70-23-243-115.ngrok-free.app/generate_image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            prompt: prompt,
            size: "1024x1024",
            quality: "standard",
            n: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();

      setGeneratedImage(data);
      setImageHistory((prevHistory) => [data, ...prevHistory]);
      localStorage.setItem(
        "imageHistory",
        JSON.stringify([data, ...imageHistory])
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col w-full gap-8">
      <GlassmorphicCard title="Generate Images">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && handleGenerateImage();
          }}
          className="w-full border border-gray-300 p-4 pb-16 rounded-md"
          placeholder="Enter a prompt for the image generator"
        />

        <button
          onClick={handleGenerateImage}
          className={`w-full bg-indigo-500 text-white p-4 rounded-full h-16 flex justify-center items-center ${
            !prompt || isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Generate Image"}
        </button>
        <ModelSelector
          model={model}
          modelOptions={modelOptions}
          setModel={setModel}
        />
        {generatedImage && (
          <img
            src={generatedImage}
            alt="Generated"
            className="mt-4 border-8 border-white rounded-lg shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/missing.png";
            }}
          />
        )}
      </GlassmorphicCard>
      {imageHistory.length > 0 && (
        <HistorySection
          title="Image History"
          history={imageHistory}
          showHistory={showImageHistory}
          type="image"
          setShowHistory={setShowImageHistory}
          clearHistory={() => {
            setImageHistory([]);
            localStorage.removeItem("imageHistory");
          }}
          onItemClick={(item) => setGeneratedImage(item as string)}
        />
      )}
    </div>
  );
};

export default ImageGenerator;
