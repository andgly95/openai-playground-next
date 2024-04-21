// components/ARChatWindow.tsx
"use client";
import React, { useRef } from "react";
import { Html, Text } from "@react-three/drei";
import { useXR, Interactive } from "@react-three/xr";
import { Group } from "three";
import ChatSection from "./ChatSection";

const ARChatWindow: React.FC = () => {
  const chatWindowRef = useRef<Group>(null);
  const { isPresenting } = useXR();

  return (
    <>
      {isPresenting && (
        <Interactive onSelect={() => console.log("Chat window clicked")}>
          <group ref={chatWindowRef}>
            <mesh position={[0, 0, -1]}>
              <planeGeometry args={[2, 1.5]} />
              <meshBasicMaterial color="white" opacity={0.8} transparent />
            </mesh>
            <Html
              position={[0, 0, -0.99]}
              style={{ width: "1.9m", height: "1.4m" }}
            >
              <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
                <ChatSection />
              </div>
            </Html>
          </group>
        </Interactive>
      )}
    </>
  );
};
export default ARChatWindow;
