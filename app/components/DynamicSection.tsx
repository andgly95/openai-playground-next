"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { FaXmark } from "react-icons/fa6";

const ComponentsArray = [
  {
    id: 1,
    name: "Fun and Games",
    components: [
      {
        heading: "Image Generation",
        subheading: "Create stunning visuals",
        component: dynamic(() => import("./ImageGenerator")),
        icon: "🖼️",
      },
      {
        heading: "Guessing Game",
        subheading: "Test your intuition",
        component: dynamic(() => import("./GuessScoreSection")),
        icon: "🎯",
      },
    ],
  },
  {
    id: 2,
    name: "Communication",
    components: [
      {
        heading: "Chat with AI",
        subheading: "Engage in intelligent conversations",
        component: dynamic(() => import("./ChatSection")),
        icon: "💬",
      },
    ],
  },
  {
    id: 3,
    name: "Audio Processing",
    components: [
      {
        heading: "Speech to Text",
        subheading: "Convert speech to written text",
        component: dynamic(() => import("./SpeechToTextSection")),
        icon: "🎤",
      },
      {
        heading: "Text to Speech",
        subheading: "Convert written text to speech",
        component: dynamic(() => import("./TextToSpeechSection")),
        icon: "🔊",
      },
    ],
  },
  {
    id: 4,
    name: "Real-time Communication",
    components: [
      {
        heading: "Voice Chat",
        subheading: "Communicate with others using voice",
        component: dynamic(() => import("./VoiceChatSection")),
        icon: "🗣️",
      },
    ],
  },
];

const DynamicSection = () => {
  const [components, setComponents] = useState<any[]>([]);

  const addComponents = (selectedComponents: any[]) => {
    setComponents([...components, ...selectedComponents]);
  };

  const removeComponent = (index: number) => {
    const updatedComponents = [...components];
    updatedComponents.splice(index, 1);
    setComponents(updatedComponents);
  };

  return (
    <div className="container">
      <div className="grid grid-cols-2 gap-8 mb-8">
        {ComponentsArray.map((preset) => (
          <div
            key={preset.id}
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg hover:bg-neutral-200 transition-shadow duration-300"
            onClick={() => addComponents(preset.components)}
          >
            <h2 className="text-xl font-semibold mb-4">{preset.name}</h2>
            <ul className="space-y-2">
              {preset.components.map((component, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">{component.icon}</span>
                  <div>
                    <h3 className="font-medium">{component.heading}</h3>
                    <p className="text-gray-500 text-sm">
                      {component.subheading}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-8">
        {components.map((Component: any, index: number) => (
          <div key={index} className="relative">
            <Component.component />
            <button
              onClick={() => removeComponent(index)}
              className="absolute top-2 right-2 bg-white text-black p-1 rounded-full shadow-md"
            >
              <FaXmark />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicSection;
