// components/ImageGenerator.tsx

"use client";

import React, { useEffect, useState } from "react";

const modelOptions = ["dall-e-3", "dall-e-2"];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(modelOptions[0]);
  const [isChangingModel, setIsChangingModel] = useState(false);
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
      const response = await fetch("http://localhost:8080/generate_image", {
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
      });

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
        />
      )}
      {imageHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-white">Image History</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imageHistory.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Generated Image ${index + 1}`}
                className="w-full h-auto rounded-md cursor-pointer"
                onClick={(e) => setGeneratedImage(image)}
              />
            ))}
          </div>
        </div>
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
    </>
  );
};

export default ImageGenerator;
