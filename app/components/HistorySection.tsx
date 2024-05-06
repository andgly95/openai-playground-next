// components/HistorySection.tsx
import React from "react";
import { FaBroom, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Conversation } from "./ChatSection";
import ReactMarkdown from "react-markdown";
import { FaXmark } from "react-icons/fa6";
import GlassmorphicCard from "./GlassmorphicCard";
import { TextToSpeechItem } from "./TextToSpeechSection";

type HistoryItem = Conversation | string | TextToSpeechItem;

interface HistorySectionProps {
  title: string;
  history: HistoryItem[];
  showHistory: boolean;
  type: "chat" | "image" | "tts";
  setShowHistory: (show: boolean) => void;
  clearHistory: () => void;
  onItemClick?: (item: HistoryItem) => void;
  onDeleteItem?: (item: HistoryItem) => void;
}

const formatTimestamp = (timestamp: number) => {
  const currentDate = new Date();
  const date = new Date(timestamp);

  const timeDiff = currentDate.getTime() - date.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  if (daysDiff === 0) {
    return `Today, ${formattedHours}:${formattedMinutes} ${ampm}`;
  } else if (daysDiff === 1) {
    return `Yesterday, ${formattedHours}:${formattedMinutes} ${ampm}`;
  } else if (daysDiff <= 7) {
    return `${daysDiff} days ago, ${formattedHours}:${formattedMinutes} ${ampm}`;
  } else {
    return date.toLocaleString();
  }
};

const HistorySection: React.FC<HistorySectionProps> = ({
  title,
  history,
  showHistory,
  type,
  setShowHistory,
  clearHistory,
  onItemClick,
  onDeleteItem,
}) => {
  return (
    <GlassmorphicCard
      size="medium"
      title={title}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={clearHistory}
            className="bg-gray-700 text-red-500 p-2 rounded-full hover:bg-red-600 hover:text-white transition duration-200"
          >
            <FaBroom size={16} />
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-gray-700 p-2 rounded-full text-white transition duration-200 hover:bg-gray-600"
          >
            {showHistory ? <FaMinus size={16} /> : <FaPlus size={16} />}
          </button>
        </div>
      }
    >
      {showHistory &&
        type === "chat" &&
        history.map((item) => {
          const conversation = item as Conversation;
          return (
            <div
              className="bg-gray-800 rounded-lg max-h-60 overflow-y-auto mb-4"
              key={conversation.id}
            >
              <div className="bg-gray-700 px-4 py-2 rounded-t-lg flex items-center">
                <span className="text-sm text-gray-300">
                  {formatTimestamp(conversation.timestamp)}
                </span>
                <button
                  type="button"
                  className="bg-red-500 p-1 ml-auto rounded-full"
                  onClick={() => onDeleteItem && onDeleteItem(conversation)}
                >
                  <FaXmark size={16} />
                </button>
              </div>
              <div
                className="p-4 cursor-pointer"
                onClick={() => onItemClick && onItemClick(conversation)}
              >
                {conversation.messages.map((message, index) => (
                  <div key={index} className="mb-4">
                    {" "}
                    <div className="flex items-center mb-1">
                      {" "}
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          message.role === "assistant"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      ></span>{" "}
                      <strong
                        className={`text-sm font-mono ${
                          message.role === "assistant"
                            ? "text-blue-400"
                            : "text-gray-400"
                        }`}
                      >
                        {" "}
                        {message.role === "assistant" ? "AI" : "User"}{" "}
                      </strong>{" "}
                    </div>{" "}
                    <div className="text-gray-300 text-sm ml-4">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      {showHistory && type === "image" && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {history.map((item, index) => (
            <img
              key={index}
              src={item as string}
              alt="Generated"
              className="border-8 border-white rounded-lg shadow-lg cursor-pointer"
              onClick={() => onItemClick && onItemClick(item)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/missing.png";
              }}
            />
          ))}
        </div>
      )}
      {showHistory &&
        type === "tts" &&
        history.map((item) => {
          const ttsItem = item as TextToSpeechItem;
          return (
            <div
              className="bg-gray-800 rounded-lg max-h-60 overflow-y-auto mb-4"
              key={ttsItem.id}
            >
              <div className="bg-gray-700 px-4 py-2 rounded-t-lg flex items-center">
                <span className="text-sm text-gray-300">
                  {formatTimestamp(ttsItem.timestamp)}
                </span>
                <button
                  type="button"
                  className="bg-red-500 p-1 ml-auto rounded-full"
                  onClick={() => onDeleteItem && onDeleteItem(ttsItem)}
                >
                  <FaXmark size={16} />
                </button>
              </div>
              <div
                className="p-4 cursor-pointer"
                onClick={() => onItemClick && onItemClick(ttsItem)}
              >
                <div className="mb-2">
                  <strong className="text-sm font-mono text-gray-400">
                    Text:
                  </strong>
                  <div className="text-gray-300 text-sm ml-4">
                    {ttsItem.text}
                  </div>
                </div>
                <div>
                  <strong className="text-sm font-mono text-gray-400">
                    Voice:
                  </strong>
                  <div className="text-gray-300 text-sm ml-4">
                    {ttsItem.voice}
                  </div>
                </div>
                <audio src={ttsItem.audioUrl} controls className="mt-4" />
              </div>
            </div>
          );
        })}
    </GlassmorphicCard>
  );
};

export default HistorySection;
