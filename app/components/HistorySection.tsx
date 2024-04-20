// components/HistorySection.tsx

import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

interface HistoryItem {
  content: string;
  role?: string;
}

interface HistorySectionProps {
  title: string;
  history: HistoryItem[];
  showHistory: boolean;
  type: "chat" | "image";
  setShowHistory: (show: boolean) => void;
  clearHistory: () => void;
  onItemClick?: (item: HistoryItem) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  title,
  history,
  showHistory,
  type,
  setShowHistory,
  clearHistory,
  onItemClick,
}) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={clearHistory}
            className="text-red-500 p-2 rounded-full border border-red-500 bg- hover:bg-red-600 hover:text-white transition duration-200"
          >
            <FaTrash size={16} />
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-gray-700 p-2 rounded-full text-white transition duration-200 hover:bg-gray-600"
          >
            {showHistory ? <FaMinus size={16} /> : <FaPlus size={16} />}
          </button>
        </div>
      </div>
      {showHistory && type === "chat" && (
        <div className="bg-gray-800 p-4 rounded-lg max-h-60 overflow-y-auto">
          {history.map((item, index) => (
            <div
              key={index}
              className="mb-4 cursor-pointer"
              onClick={() => onItemClick && onItemClick(item)}
            >
              {item.role && (
                <div className="flex items-center mb-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      item.role === "assistant" ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  ></span>
                  <strong
                    className={`text-sm font-mono ${
                      item.role === "assistant"
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {item.role === "assistant" ? "AI" : "User"}
                  </strong>
                </div>
              )}
              <p className="text-gray-300 text-sm ml-4">{item.content}</p>
            </div>
          ))}
        </div>
      )}
      {showHistory && type === "image" && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {history.map((item, index) => (
            <img
              key={index}
              src={item.content}
              alt="Generated"
              className="border-8 border-white rounded-lg shadow-lg"
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
    </div>
  );
};

export default HistorySection;
