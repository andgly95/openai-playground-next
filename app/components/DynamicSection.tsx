"use client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import dynamic from "next/dynamic";
import { Popover } from "react-tiny-popover";
import { FaXmark } from "react-icons/fa6";

const ComponentsArray = [
  {
    id: 1,
    name: "Chat with AI",
    component: dynamic(() => import("./ChatSection")),
    icon: "💬",
  },
  {
    id: 2,
    name: "Generate Images",
    component: dynamic(() => import("./ImageGenerator")),
    icon: "🖼️",
  },
  {
    id: 3,
    name: "Speech to Text",
    component: dynamic(() => import("./SpeechToTextSection")),
    icon: "🎤",
  },
  {
    id: 4,
    name: "Text to Speech",
    component: dynamic(() => import("./TextToSpeechSection")),
    icon: "🔊",
  },
  {
    id: 5,
    name: "Voice Chat",
    component: dynamic(() => import("./VoiceChatSection")),
    icon: "🗣️",
  },
];

const DynamicSection = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [components, setComponents] = useState<any[]>([]);

  const addComponent = (component: any) => {
    setComponents([...components, component]);
    setIsPopoverOpen(false);
  };

  return (
    <div className="container">
      <div className="grid grid-cols-2 gap-8">
        {components.map((Component: any, index: number) => (
          <div>
            <Component.component key={index} />
          </div>
        ))}
      </div>
      <Popover
        isOpen={isPopoverOpen}
        positions={["bottom", "right", "top", "left"]}
        content={
          <div className="flex flex-col bg-white rounded mt-4">
            {ComponentsArray.map((comp) => (
              <button
                className="p-4"
                key={comp.id}
                onClick={() => addComponent(comp)}
              >
                {comp.icon} {comp.name}
              </button>
            ))}
          </div>
        }
      >
        <button
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className={
            "bg-white text-black p-2 rounded-full " +
            (!!components.length && " fixed bottom-4 right-4")
          }
        >
          {isPopoverOpen ? <FaXmark /> : <FaPlus />}
        </button>
      </Popover>
    </div>
  );
};

export default DynamicSection;
