"use client";

import React, { useState, useRef } from "react";
import GlassmorphicCard from "./GlassmorphicCard";

const SpeechToTextSection: React.FC = () => {
  const [transcribedText, setTranscribedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      setTranscribedText(data.text);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <GlassmorphicCard title="Speech to Text">
      <div className="bg-gray-900 p-4 rounded-lg min-h-20">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded ${
            isRecording ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        {transcribedText && (
          <div className="bg-neutral-600 text-white p-4 rounded-md mt-4">
            {transcribedText}
          </div>
        )}
      </div>
    </GlassmorphicCard>
  );
};

export default SpeechToTextSection;
