// components/TextToSpeechSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import GlassmorphicCard from "./GlassmorphicCard";
import LoadingSpinner from "./LoadingSpinner";
import HistorySection from "./HistorySection";

export interface TextToSpeechItem {
  id: string;
  text: string;
  voice: string;
  audioUrl: string;
  timestamp: number;
}

const voiceOptions = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

const TextToSpeechSection: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApiError, setIsApiError] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [voice, setVoice] = useState(voiceOptions[0]);
  const [history, setHistory] = useState<TextToSpeechItem[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    // Load history from localStorage
    const storedHistory = localStorage.getItem("textToSpeechHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleGenerateSpeech = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://8ee0-70-23-243-115.ngrok-free.app/generate_speech",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            input: inputText,
            voice,
          }),
        }
      );

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      const newItem: TextToSpeechItem = {
        id: `item_${Date.now()}`,
        text: inputText,
        voice,
        audioUrl,
        timestamp: Date.now(),
      };

      const updatedHistory = [...history, newItem];
      setHistory(updatedHistory);
      localStorage.setItem(
        "textToSpeechHistory",
        JSON.stringify(updatedHistory)
      );

      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsApiError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <GlassmorphicCard title="Text to Speech">
        <div className="bg-gray-900 p-4 rounded-lg min-h-20">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-neutral-600 text-white px-4 py-2 rounded-md mb-4"
            placeholder="Enter text to generate speech"
          ></textarea>
          <div className="flex items-center mb-4">
            <label htmlFor="voice" className="text-white mr-2">
              Voice:
            </label>
            <select
              id="voice"
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="bg-neutral-600 text-white px-2 py-1 rounded-md"
            >
              {voiceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerateSpeech}
            className={`bg-indigo-500 text-white px-4 py-2 rounded-md ${
              !inputText || isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-600"
            }`}
            disabled={!inputText || isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Generate Speech"}
          </button>
          {isApiError && (
            <div className="text-red-500 mt-4">Error generating speech</div>
          )}
          {audioUrl && (
            <div className="mt-4">
              <audio src={audioUrl} controls />
            </div>
          )}
        </div>
      </GlassmorphicCard>
      {history.length > 0 && (
        <HistorySection
          title="Text to Speech History"
          history={history}
          showHistory={showHistory}
          type="tts"
          setShowHistory={setShowHistory}
          clearHistory={() => {
            setHistory([]);
            localStorage.removeItem("textToSpeechHistory");
          }}
          onItemClick={(item) => {
            setAudioUrl((item as TextToSpeechItem).audioUrl);
          }}
          onDeleteItem={(item) => {
            const updatedHistory = history.filter(
              (h) => h.id !== (item as TextToSpeechItem).id
            );
            setHistory(updatedHistory);
            localStorage.setItem(
              "textToSpeechHistory",
              JSON.stringify(updatedHistory)
            );
          }}
        />
      )}
    </div>
  );
};

export default TextToSpeechSection;
