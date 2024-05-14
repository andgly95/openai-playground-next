// components/RecordButton.tsx

"use client";

import React from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

interface RecordButtonProps {
  isRecording: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  isLoading,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        isRecording ? "bg-red-500" : "bg-green-500"
      } text-white flex items-center`}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : isRecording ? (
        <>
          <FaStop className="mr-2" />
          Stop Recording
        </>
      ) : (
        <>
          <FaMicrophone className="mr-2" />
          Start Recording
        </>
      )}
    </button>
  );
};

export default RecordButton;
