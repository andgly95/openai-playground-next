// components/ChatSection.tsx

"use client";

import React, { useEffect, useState } from "react";

interface Message {
  role: string;
  content: string;
}

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
                content: "You are a helpful assistant.",
              },
            ],
          }),
        });

        const data = await response.text();
        const assistantMessage: Message = {
          role: "assistant",
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Chat Section</h2>
      <div className="mb-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-md"
      />
      <button
        onClick={handleSendMessage}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md ml-2 ${
          !inputText || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600"
        }`}
        disabled={!inputText || isLoading}
      >
        Send
      </button>
    </div>
  );
};

export default ChatSection;
