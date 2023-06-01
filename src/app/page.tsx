"use client";

import { Physics, useBox, usePlane } from "@react-three/cannon";
import {
  Box,
  OrbitControls,
  PerspectiveCamera,
  Plane,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC, useRef } from "react";
import { Mesh } from "three";

export default function Home() {
  return (
    <main className="mx-auto container">
      <h1 className="text-4xl mt-4 mb-4">Robot arm physics</h1>
      <Canvas
        style={{
          width: "70%",
          height: "70vh",
        }}
      >
        <Physics>
          <OrbitControls></OrbitControls>
          <ambientLight intensity={0.2}></ambientLight>
          <pointLight position={[5, 10, 5]} intensity={0.6}></pointLight>
          <PerspectiveCamera
            makeDefault
            position={[5, 5, 5]}
          ></PerspectiveCamera>
          <MyBox mass={1} position={[0, 0.5, 0]} scale={[1, 1, 1]}></MyBox>
          <MyBox mass={1} position={[-0.5, 3, 0]} scale={[1, 1, 1]}></MyBox>
          <MyPlane scale={[10, 10, 10]} position={[0, 0, 0]}></MyPlane>
        </Physics>
      </Canvas>
    </main>
  );
}

const MyBox: FC<{
  mass: number;
  position: [number, number, number];
  scale: [number, number, number];
}> = ({ mass, position, scale }) => {
  const [ref] = useBox(
    () => ({
      args: scale,
      position,
      mass,
    }),
    useRef<Mesh>(null)
  );

  return (
    <Box ref={ref} scale={scale}>
      <meshStandardMaterial></meshStandardMaterial>
    </Box>
  );
};

const MyPlane: FC<{
  position: [number, number, number];
  scale: [number, number, number];
}> = ({ position, scale }) => {
  const [ref] = usePlane(
    () => ({
      rotation: [-Math.PI / 2, 0, 0],
      args: scale,
    }),
    useRef<Mesh>(null)
  );

  return (
    <Plane ref={ref} scale={scale}>
      <meshStandardMaterial></meshStandardMaterial>
    </Plane>
  );
};
