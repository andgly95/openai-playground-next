// components/ARChatWindow.tsx
"use client";

import React, { useRef } from "react";
import { useXR, Interactive } from "@react-three/xr";
import { Group } from "three";
import { Html } from "@react-three/drei";
import ChatSection from "./ChatSection";

const ARChatWindow: React.FC = () => {
  const chatWindowRef = useRef<Group>(null);
  const { isPresenting } = useXR();

  return (
    <>
      {isPresenting && (
        <Interactive onSelect={() => console.log("Chat window clicked")}>
          <group ref={chatWindowRef} position={[0, 1.5, -2]}>
            <mesh>
              <planeGeometry args={[1.5, 1]} />
              <meshBasicMaterial color="white" opacity={0.8} transparent />
            </mesh>
            <Html transform occlude style={{ width: "1.4m", height: "0.9m" }}>
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
