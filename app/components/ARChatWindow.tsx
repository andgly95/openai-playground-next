// components/ARChatWindow.tsx
"use client";
import React, { useRef } from "react";
import { Text } from "@react-three/drei";
import { useXR, Interactive } from "@react-three/xr";
import { Group } from "three";

const ARChatWindow: React.FC = () => {
  const chatWindowRef = useRef<Group>(null);
  const { isPresenting } = useXR();

  return (
    <>
      {isPresenting && (
        <Interactive onSelect={() => console.log("Chat window clicked")}>
          <group ref={chatWindowRef}>
            <mesh position={[0, 0, -1]}>
              <planeGeometry args={[1, 0.6]} />
              <meshBasicMaterial color="white" opacity={0.8} transparent />
            </mesh>
            <Text position={[0, 0, -0.99]} fontSize={0.08} color="black">
              AR Chat Window
            </Text>
          </group>
        </Interactive>
      )}
    </>
  );
};

export default ARChatWindow;
