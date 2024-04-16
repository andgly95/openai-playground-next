// components/ChatSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import GlassmorphicCard from "./GlassmorphicCard";

interface Message {
  role: string;
  content: string;
}

const modelOptions = ["gpt-4-turbo", "gpt-3.5-turbo"];

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingModel, setIsChangingModel] = useState(false);
  const [model, setModel] = useState(modelOptions[0]);

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8080/generate_chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are playing a game where a human battles an AI with a chat and image generator. First come up with a prompt that the user can enter into the image generator",
              },
            ],
          }),
        });

        const data = await response.text();
        const assistantMessage: Message = {
          role: "Assistant",
          content: data,
        };

        setMessages([assistantMessage]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    fetchInitialMessage();
  }, []);

  const handleSendMessage = async () => {
    const newMessage: Message = {
      role: "user",
      content: inputText,
    };

    try {
      const response = await fetch("http://localhost:8080/generate_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...messages, newMessage],
        }),
      });

      const data = await response.text();
      const assistantMessage: Message = {
        role: "assistant",
        content: data,
      };

      setMessages([...messages, newMessage, assistantMessage]);
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <GlassmorphicCard>
      <h2 className="text-2xl font-bold text-white">Chat Section</h2>
      <div className="bg-black p-2 rounded-md">
        {messages.map((message, index) => (
          <div key={index} className="mb-2 text-white">
            <strong
              className={
                message.role === "Assistant"
                  ? "text-green-500"
                  : "text-yellow-100"
              }
            >
              {message.role}:
            </strong>{" "}
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full border border-gray-300 bg-neutral-400 px-4 py-2 rounded-md"
        />
        <button
          onClick={handleSendMessage}
          className={`bg-indigo-500 text-white px-8 py-2 rounded-md ml-2 ${
            !inputText || isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-600"
          }`}
          disabled={!inputText || isLoading}
        >
          Send
        </button>
      </div>
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
    </GlassmorphicCard>
  );
};

export default ChatSection;
