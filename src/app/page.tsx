"use client";

import {
  BoxProps,
  Physics,
  PlaneProps,
  Triplet,
  useBox,
  usePlane,
} from "@react-three/cannon";
import {
  Box,
  OrbitControls,
  PerspectiveCamera,
  Plane,
} from "@react-three/drei";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { FC, useRef } from "react";
import { Mesh, Vector3 } from "three";

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
          <MyStaticBox
            position={[1, 0.5, 1]}
            args={[1, 1, 1]}
            type="Static"
          ></MyStaticBox>
          <MyBox mass={1} position={[-1, 0.5, -1]} args={[1, 1, 1]}></MyBox>
          <MyPlane
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[10, 10, 10]}
            position={[0, 0, 0]}
          ></MyPlane>
        </Physics>
      </Canvas>
    </main>
  );
}

type MyStaticBoxProps = Omit<BoxProps, "args" | "position" | "type"> & {
  args: Exclude<BoxProps["args"], undefined>;
  position: Exclude<BoxProps["position"], undefined>;
  type: "Static";
};

const MyStaticBox: FC<MyStaticBoxProps> = ({ args, position, ...rest }) => {
  const [ref, api] = useBox(
    () => ({
      args,
      position,
      ...rest,
    }),
    useRef<Mesh>(null)
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const [xx, yy, zz] = position;
    const length = Math.sqrt(xx * xx + zz * zz);
    const x = length * Math.sin(t);
    const y = yy;
    const z = length * Math.cos(t);
    api.position.set(x, y, z);
  });

  return (
    <Box ref={ref} scale={args}>
      <meshStandardMaterial></meshStandardMaterial>
    </Box>
  );
};

type MyBoxProps = BoxProps;

const MyBox: FC<MyBoxProps> = ({ args, ...rest }) => {
  const [ref] = useBox(
    () => ({
      args,
      ...rest,
    }),
    useRef<Mesh>(null)
  );

  return (
    <Box ref={ref} scale={args}>
      <meshStandardMaterial></meshStandardMaterial>
    </Box>
  );
};

type MyPlaneProps = PlaneProps & Pick<MeshProps, "scale">;

const MyPlane: FC<MyPlaneProps> = ({ scale, ...rest }) => {
  const [ref] = usePlane(
    () => ({
      ...rest,
    }),
    useRef<Mesh>(null)
  );

  return (
    <Plane ref={ref} scale={scale}>
      <meshStandardMaterial></meshStandardMaterial>
    </Plane>
  );
};
