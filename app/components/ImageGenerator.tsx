// components/ImageGenerator.tsx

"use client";

import React, { useEffect, useState } from "react";
import ModelSelector from "./ModelSelector";

const modelOptions = ["dall-e-3", "dall-e-2"];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(modelOptions[0]);
  const [isChangingModel, setIsChangingModel] = useState(false);
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
    <>
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
      {imageHistory.length > 0 && (
        <div className="mt-8">
          {" "}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold mb-4 text-white">Image History</h2>{" "}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowImageHistory(!showImageHistory)}
                className="text-white px-4 py-2 rounded-md border text-white bg-gray-700 transition duration-200"
              >
                {showImageHistory ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => {
                  setImageHistory([]);
                  localStorage.removeItem("imageHistory");
                }}
                className="bg-red-500 px-4 py-2 rounded-md border border-red-500 text-white hover:bg-red-600 transition duration-200"
              >
                Clear
              </button>
            </div>
          </div>
          {showImageHistory && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageHistory.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Generated Image ${index + 1}`}
                  className="w-full h-auto rounded-md cursor-pointer"
                  onClick={(e) => setGeneratedImage(image)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/missing.png";
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <ModelSelector
        model={model}
        modelOptions={modelOptions}
        isChangingModel={isChangingModel}
        setModel={setModel}
        setIsChangingModel={setIsChangingModel}
      />
    </>
  );
};

export default ImageGenerator;
