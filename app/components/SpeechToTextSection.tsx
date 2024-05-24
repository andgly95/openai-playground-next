"use client";

import React, { useState, useRef } from "react";
import GlassmorphicCard from "./GlassmorphicCard";
import RecordButton from "./RecordButton";

const SpeechToTextSection: React.FC = () => {
  const [transcribedText, setTranscribedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", "whisper-1");

    try {
      const response = await fetch(
        "https://8ee0-70-23-243-115.ngrok-free.app/transcribe_speech",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setTranscribedText(data["text"]);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const handleRecordButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <GlassmorphicCard title="Speech to Text">
      <div className="bg-gray-900 p-4 rounded-lg min-h-20">
        <RecordButton
          isRecording={isRecording}
          isLoading={isLoading}
          onClick={handleRecordButtonClick}
        />
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
