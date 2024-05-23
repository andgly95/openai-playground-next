// components/ChatSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import ModelSelector from "./ModelSelector";
import HistorySection from "./HistorySection";
import ReactMarkdown from "react-markdown";
import GlassmorphicCard from "./GlassmorphicCard";
import LoadingSpinner from "./LoadingSpinner";

export interface Conversation {
  id: string;
  timestamp: number;
  messages: Message[];
}
export interface Message {
  role: string;
  content: string;
}

const modelOptions = [
  "gpt-4o",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240229",
];
const initialSystemPrompt =
  "You are a chatbot. You are designed to assist users with their queries.";

const ChatSection: React.FC = () => {
  const [systemPrompt, setSystemPrompt] = useState<string>();
  const [systemPromptInput, setSystemPromptInput] = useState<string>();
  const [isSystemPromptEditable, setIsSystemPromptEditable] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApiError, setIsApiError] = useState(false);
  const [model, setModel] = useState(modelOptions[0]);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(
    null
  );
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] =
    useState<string>("");

  useEffect(() => {
    // Load conversations from localStorage
    const storedConversations = localStorage.getItem("conversations");
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    }
  }, []);

  useEffect(() => {
    // Load systemPrompt from localStorage
    const savedSystemPrompt = localStorage.getItem("systemPrompt");
    if (savedSystemPrompt) {
      setSystemPrompt(savedSystemPrompt);
      setSystemPromptInput(savedSystemPrompt);
    } else {
      setSystemPrompt(initialSystemPrompt);
      setSystemPromptInput(initialSystemPrompt);
    }
  }, []);

  useEffect(() => {
    // Create a new conversation if there are no conversations
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, [conversations]);

  useEffect(() => {
    // Fetch initial message when systemPrompt changes
    createNewConversation();
  }, [systemPrompt]);

  const createNewConversation = () => {
    const newConversationId = `conversation_${Date.now()}`;
    setCurrentConversationId(newConversationId);
    setMessages([]);
    fetchInitialMessage();
  };

  const saveConversation = (newMessages: Message[]) => {
    const updatedConversations = conversations.map((conversation) => {
      if (conversation.id === currentConversationId) {
        return {
          ...conversation,
          messages: newMessages,
        };
      }
      return conversation;
    });

    if (!conversations.some((c) => c.id === currentConversationId)) {
      updatedConversations.push({
        id: currentConversationId,
        messages: newMessages,
        timestamp: Date.now(),
      });
    }

    setConversations(updatedConversations);
    localStorage.setItem("conversations", JSON.stringify(updatedConversations));
  };
  const fetchInitialMessage = async () => {
    try {
      if (!systemPrompt) {
        return;
      }
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
                content: systemPrompt,
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
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              ...messages,
              newMessage,
            ],
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
      saveConversation(updatedMessages);
      setInputText("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleClearConversation = () => {
    setMessages([]);
    createNewConversation();
  };
  const handleSaveSystemPrompt = () => {
    setSystemPrompt(systemPromptInput);
    localStorage.setItem(
      "systemPrompt",
      systemPromptInput || initialSystemPrompt
    );
    setIsSystemPromptEditable(false);
  };

  const handleMessageClick = (index: number) => {
    setEditingMessageIndex(editingMessageIndex === index ? null : index);
  };

  const handleMessageEdit = (index: number, content: string) => {
    const updatedMessages = messages.map((message, i) => {
      if (i === index) {
        return { ...message, content };
      }
      return message;
    });
    setMessages(updatedMessages);
    saveConversation(updatedMessages);
  };

  const handleMessageDelete = (index: number) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
    saveConversation(updatedMessages);
    setEditingMessageIndex(null);
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <GlassmorphicCard title="Chat with AI">
        <div className="bg-gray-900 p-4 rounded-lg min-h-20 max-h-[80vh] lg:max-h-[60vh] overflow-y-auto">
          {isLoading && !messages.length && (
            <div className="text-gray-300 text-center mb-4">
              <LoadingSpinner />
            </div>
          )}
          {isApiError && !messages.length && (
            <div className="text-red-500 text-center mb-4">API Error</div>
          )}
          {isSystemPromptEditable && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 bg-white`}
                ></span>
                <strong className={`text-sm font-mono text-white`}>
                  {" System "}
                </strong>
              </div>
              <textarea
                value={systemPromptInput}
                onChange={(e) => setSystemPromptInput(e.target.value)}
                className="w-full bg-neutral-600 text-white px-4 py-2 rounded-md"
              ></textarea>
            </div>
          )}
          {!isSystemPromptEditable &&
            messages.map((message, index) => (
              <div
                key={index}
                className="mb-4 rounded-md p-2 hover:bg-neutral-700 transition duration-500 ease-in-out cursor-pointer"
                onClick={() =>
                  editingMessageIndex == null && handleMessageClick(index)
                }
              >
                <div className="flex items-center mb-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      message.role === "assistant"
                        ? "bg-blue-500"
                        : "bg-gray-500"
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

                {editingMessageIndex === index ? (
                  <>
                    <textarea
                      value={message.content}
                      onChange={(e) => handleMessageEdit(index, e.target.value)}
                      className="w-full bg-neutral-600 text-white px-4 py-2 rounded-md"
                    ></textarea>
                    <button
                      onClick={() => handleMessageClick(index)}
                      className="text-white mx-4 my-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleMessageDelete(index)}
                      className="text-red-500 hover:text-red-600 mx-4 my-2"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <div className="text-gray-300 text-sm ml-4">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          {messages.length > 1 && (
            <button
              onClick={handleClearConversation}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 float-right"
            >
              Clear
            </button>
          )}
          {messages.length === 1 && (
            <div className="flex items-center gap-2 float-right">
              {isSystemPromptEditable && (
                <button
                  onClick={(_) => setIsSystemPromptEditable(false)}
                  className="text-neutral-500 px-4 py-2 rounded-md hover:bg-neutral-600 hover:text-white"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={(_) =>
                  isSystemPromptEditable
                    ? handleSaveSystemPrompt()
                    : setIsSystemPromptEditable(!isSystemPromptEditable)
                }
                className="text-indigo-500  px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white"
              >
                {isSystemPromptEditable ? "Save" : "Edit"} System Prompt
              </button>
            </div>
          )}
        </div>
        <div className="flex">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              !e.shiftKey && e.key === "Enter" && handleSendMessage();
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
      </GlassmorphicCard>
      {conversations.length > 0 && (
        <HistorySection
          title="Conversations"
          history={conversations}
          showHistory={showChatHistory}
          type="chat"
          setShowHistory={setShowChatHistory}
          clearHistory={() => {
            setConversations([]);
            localStorage.removeItem("conversations");
          }}
          onItemClick={(item) => {
            setCurrentConversationId((item as Conversation).id);
            setMessages((item as Conversation).messages);
          }}
          onDeleteItem={(item) => {
            const updatedConversations = conversations.filter(
              (c) => c.id !== (item as Conversation).id
            );
            setConversations(updatedConversations);
            localStorage.setItem(
              "conversations",
              JSON.stringify(updatedConversations)
            );
          }}
        />
      )}
    </div>
  );
};

export default ChatSection;
