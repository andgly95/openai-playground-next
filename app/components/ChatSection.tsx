// components/ChatSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import ModelSelector from "./ModelSelector";
import HistorySection from "./HistorySection";

interface Message {
  role: string;
  content: string;
}

const modelOptions = ["gpt-4-turbo", "gpt-3.5-turbo"];

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApiError, setIsApiError] = useState(false);
  const [model, setModel] = useState(modelOptions[0]);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    fetchInitialMessage();
  }, []);

  const fetchInitialMessage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://f759-70-23-243-115.ngrok-free.app/generate_chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are a chatbot. You are designed to assist users with their queries.",
              },
            ],
          }),
        }
      );

      const data = await response.text();
      const assistantMessage: Message = {
        role: "assistant",
        content: data,
      };

      setMessages([assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsApiError(true);
      setIsLoading(false);
    }
  };
  const handleSendMessage = async () => {
    const newMessage: Message = {
      role: "user",
      content: inputText,
    };
    setIsLoading(true);
    setMessages([...messages, newMessage]);
    try {
      const response = await fetch(
        "https://f759-70-23-243-115.ngrok-free.app/generate_chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [...messages, newMessage],
          }),
        }
      );

      const data = await response.text();
      const assistantMessage: Message = {
        role: "assistant",
        content: data,
      };

      const updatedMessages = [...messages, newMessage, assistantMessage];
      setMessages(updatedMessages);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        newMessage,
        assistantMessage,
      ]);
      localStorage.setItem(
        "chatHistory",
        JSON.stringify([...chatHistory, newMessage, assistantMessage])
      );
      setInputText("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleClearConversation = () => {
    setMessages([]);
    fetchInitialMessage();
  };
  return (
    <>
      <div className="bg-gray-900 p-4 rounded-lg min-h-40 max-h-[80vh] lg:max-h-[60vh] overflow-y-auto">
        {" "}
        {isApiError && !messages.length && (
          <div className="text-red-500 text-center mb-4">API Error</div>
        )}{" "}
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            {" "}
            <div className="flex items-center mb-1">
              {" "}
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  message.role === "assistant" ? "bg-blue-500" : "bg-gray-500"
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
            <p className="text-gray-300 text-sm ml-4">{message.content}</p>{" "}
          </div>
        ))}{" "}
        {messages.length > 1 && (
          <button
            onClick={handleClearConversation}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 float-right"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && handleSendMessage();
          }}
          className={`w-full border border-gray-300 bg-neutral-200 px-4 py-2 rounded-l-md ${
            isLoading && "opacity-50 cursor-not-allowed"
          }`}
          placeholder="Enter a message"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className={`bg-indigo-500 text-white px-8 py-2 rounded-r-md ${
            !inputText || isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-600"
          }`}
          disabled={!inputText || isLoading}
        >
          Send
        </button>
      </div>
      <ModelSelector
        model={model}
        modelOptions={modelOptions}
        setModel={setModel}
      />
      {chatHistory.length > 0 && (
        <HistorySection
          title="Chat History"
          history={chatHistory}
          showHistory={showChatHistory}
          type="chat"
          setShowHistory={setShowChatHistory}
          clearHistory={() => {
            setChatHistory([]);
            localStorage.removeItem("chatHistory");
          }}
        />
      )}
    </>
  );
};

export default ChatSection;
