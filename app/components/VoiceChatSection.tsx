// components/VoiceChatSection.tsx

"use client";

import React, { useState, useRef } from "react";
import GlassmorphicCard from "./GlassmorphicCard";
import LoadingSpinner from "./LoadingSpinner";
import { Message } from "./ChatSection";
import { TextToSpeechItem } from "./TextToSpeechSection";

const VoiceChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiError, setIsApiError] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunksRef.current.push(event.data);
      });
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        handleTranscribeAudio(audioBlob);
      });
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", "whisper-1");
    try {
      const response = await fetch(
        "https://f759-70-23-243-115.ngrok-free.app/transcribe_speech",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const userMessage: Message = {
        role: "user",
        content: data["text"],
      };
      setMessages([...messages, userMessage]);
      await handleSendMessage(userMessage.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSendMessage = async (inputText: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://f759-70-23-243-115.ngrok-free.app/generate_chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [...messages, { role: "user", content: inputText }],
          }),
        }
      );

      const data = await response.text();
      const assistantMessage: Message = {
        role: "assistant",
        content: data,
      };
      setMessages([
        ...messages,
        { role: "user", content: inputText },
        assistantMessage,
      ]);

      await handleGenerateSpeech(assistantMessage.content);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsApiError(true);
      setIsLoading(false);
    }
  };

  const handleGenerateSpeech = async (text: string) => {
    try {
      const response = await fetch(
        "https://f759-70-23-243-115.ngrok-free.app/generate_speech",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            input: text,
            voice: "alloy",
          }),
        }
      );

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <GlassmorphicCard title="Voice Chat">
      <div className="bg-gray-900 p-4 rounded-lg min-h-20">
        <div className="mb-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center mb-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    message.role === "assistant" ? "bg-blue-500" : "bg-gray-500"
                  }`}
                ></span>
                <strong
                  className={`text-sm font-mono ${
                    message.role === "assistant"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  {message.role === "assistant" ? "AI" : "User"}
                </strong>
              </div>
              <div className="text-gray-300 text-sm ml-4">
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded ${
            isRecording ? "bg-red-500" : "bg-green-500"
          } text-white`}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : isRecording ? (
            "Stop Recording"
          ) : (
            "Start Recording"
          )}
        </button>
        {isApiError && (
          <div className="text-red-500 mt-4">Error processing voice chat</div>
        )}
      </div>
    </GlassmorphicCard>
  );
};

export default VoiceChatSection;
