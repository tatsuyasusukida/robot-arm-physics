"use client";

import {
  CylinderProps,
  Physics,
  Triplet,
  useBox,
  useCylinder,
  usePlane,
} from "@react-three/cannon";
import { Box, Cylinder, OrbitControls, Plane } from "@react-three/drei";
import {
  BoxBufferGeometryProps,
  BoxGeometryProps,
  Canvas,
  CylinderBufferGeometryProps,
  CylinderGeometryProps,
  MeshProps,
  PlaneGeometryProps,
  useFrame,
} from "@react-three/fiber";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { Euler, Matrix4, Mesh, Quaternion, Vector3 } from "three";

export default function Home() {
  const [controller, setController] = useState({
    positionX: 0,
    positionZ: 0,
    axis0: 0,
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setController({
      ...controller,
      [event.target.name]: parseInt(event.target.value, 10),
    });

  const rangeInput = (name: string, value: number, max: number) => (
    <div className="mb-2 flex items-center">
      <label htmlFor={name} className="mr-2">
        {name}
      </label>
      <input
        type="range"
        id={name}
        name={name}
        max={max}
        min={-max}
        value={value}
        onChange={onChange}
      />
    </div>
  );

  const matrixController = new Matrix4()
    .makeTranslation(controller.positionX, 0, controller.positionZ)
    .multiply(new Matrix4().makeRotationY((controller.axis0 * Math.PI) / 180));

  const matrixLocalCylinder = new Matrix4().makeTranslation(0, 10, 0);
  const matrixLocalBox = new Matrix4().makeTranslation(15, 11, 0);

  const matrixCylinder = matrixController.clone().multiply(matrixLocalCylinder);
  const matrixBox = matrixController.clone().multiply(matrixLocalBox);

  const positionCylinder = new Vector3();
  const positionBox = new Vector3();

  const quaternionCylinder = new Quaternion();
  const quaternionBox = new Quaternion();

  matrixCylinder.decompose(positionCylinder, quaternionCylinder, new Vector3());
  matrixBox.decompose(positionBox, quaternionBox, new Vector3());

  return (
    <main className="container mx-auto">
      <h1 className="text-4xl mt-4 mb-4">Robot arm game</h1>
      <form className="mb-4">
        {rangeInput("positionX", controller.positionX, 80)}
        {rangeInput("positionZ", controller.positionZ, 80)}
        {rangeInput("axis0", controller.axis0, 180)}
      </form>
      <Canvas
        style={{
          width: "70%",
          height: "70vh",
        }}
        camera={{
          position: [50, 50, 50],
        }}
      >
        <Physics gravity={[0, -98.1, 0]}>
          <pointLight position={[100, 200, 100]} intensity={0.8}></pointLight>
          <ambientLight intensity={0.1}></ambientLight>
          <OrbitControls></OrbitControls>
          <MyPlane args={[200, 200]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={"#888"}></meshStandardMaterial>
          </MyPlane>
          <MyCylinder
            args={[10, 10, 20, 12]}
            position={positionCylinder}
            rotation={new Euler().setFromQuaternion(quaternionCylinder)}
          >
            <meshStandardMaterial></meshStandardMaterial>
          </MyCylinder>
          <MyBox
            args={[20, 4, 10]}
            position={positionBox}
            rotation={new Euler().setFromQuaternion(quaternionBox)}
          >
            <meshStandardMaterial></meshStandardMaterial>
          </MyBox>
          {[...Array(5)].map((_, i) => (
            <MyDynamicBox
              key={i}
              args={[20, 20, 20]}
              position={[50, 15 + 30 * i, 0]}
              mass={0.1}
            >
              <meshStandardMaterial></meshStandardMaterial>
            </MyDynamicBox>
          ))}
        </Physics>
      </Canvas>
    </main>
  );
}

type MyDynamicBoxProps = Omit<MeshProps, "args" | "position"> & {
  args: Triplet;
  position: Triplet;
  mass: number;
};

const MyDynamicBox: FC<MyDynamicBoxProps> = ({
  args,
  position,
  mass,
  children,
  ...rest
}) => {
  const [ref, api] = useBox(
    () => ({
      args,
      position,
      mass,
    }),
    useRef<Mesh>(null)
  );

  return (
    <Box ref={ref} args={args}>
      {children}
    </Box>
  );
};

type MyPlaneProps = Omit<MeshProps, "args" | "rotation"> & {
  args: PlaneGeometryProps["args"];
  rotation: Triplet;
};

const MyPlane: FC<MyPlaneProps> = ({ args, rotation, children }) => {
  const [ref] = usePlane(
    () => ({
      rotation,
    }),
    useRef<Mesh>(null)
  );

  return (
    <Plane ref={ref} args={args}>
      {children}
    </Plane>
  );
};

type MyCylinderProps = Omit<MeshProps, "args" | "position" | "rotation"> & {
  args: CylinderBufferGeometryProps["args"];
  position: Vector3;
  rotation: Euler;
};

const MyCylinder: FC<MyCylinderProps> = ({
  args,
  position,
  rotation,
  children,
  ...rest
}) => {
  const [ref, api] = useCylinder(
    () => ({
      args,
      position: [position.x, position.y, position.z],
      rotation: [rotation.x, rotation.y, rotation.z],
      type: "Static",
    }),
    useRef<Mesh>(null)
  );

  useEffect(() => {
    api.position.copy(position);
  }, [api.position, position]);

  useEffect(() => {
    api.rotation.copy(rotation);
  }, [api.rotation, rotation]);

  return (
    <Cylinder ref={ref} args={args} {...rest}>
      {children}
    </Cylinder>
  );
};

type MyBoxProps = Omit<MeshProps, "args" | "position" | "rotation"> & {
  args: Triplet;
  position: Vector3;
  rotation: Euler;
};

const MyBox: FC<MyBoxProps> = ({
  args,
  position,
  rotation,
  children,
  ...rest
}) => {
  const [ref, api] = useBox(
    () => ({
      args,
      position: [position.x, position.y, position.z],
      rotation: [rotation.x, rotation.y, rotation.z],
      type: "Static",
    }),
    useRef<Mesh>(null)
  );

  useEffect(() => {
    api.position.copy(position);
  }, [api.position, position]);

  useEffect(() => {
    api.rotation.copy(rotation);
  }, [api.rotation, rotation]);

  return (
    <Box ref={ref} args={args} {...rest}>
      {children}
    </Box>
  );
};
