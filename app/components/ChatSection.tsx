// components/ChatSection.tsx

"use client";

import React, { useEffect, useState } from "react";

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
  const [isChangingModel, setIsChangingModel] = useState(false);
  const [model, setModel] = useState(modelOptions[0]);

  useEffect(() => {
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

    fetchInitialMessage();
  }, []);

  const handleSendMessage = async () => {
    const newMessage: Message = {
      role: "user",
      content: inputText,
    };
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
            model,
            messages: [...messages, newMessage],
          }),
        }
      );

      const data = await response.text();

      setMessages([
        ...messages,
        newMessage,
        { role: "assistant", content: data },
      ]);
      setInputText("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="bg-black p-2 rounded-md">
        {isApiError && !messages.length && (
          <div className="text-red-500 text-center">API Error</div>
        )}
        {messages.map((message, index) => (
          <div key={index} className="mb-2 text-white">
            <strong
              className={
                message.role === "assistant"
                  ? "text-green-500 capitalize"
                  : "text-yellow-100 capitalize"
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
          onKeyDown={(e) => {
            e.key === "Enter" && handleSendMessage();
          }}
          className="w-full border border-gray-300 bg-neutral-200 px-4 py-2 rounded-l-md"
          placeholder="Enter a message"
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

export default ChatSection;
