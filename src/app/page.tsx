"use client";

import { Box, Cylinder, OrbitControls, Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ChangeEvent, useState } from "react";
import { Matrix4 } from "three";

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

  const matrixCylinder = new Matrix4().makeTranslation(0, 10, 0);
  const matrixBox = new Matrix4().makeTranslation(15, 11, 0);

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
        <pointLight position={[100, 200, 100]} intensity={0.8}></pointLight>
        <ambientLight intensity={0.1}></ambientLight>
        <OrbitControls></OrbitControls>
        <Cylinder
          args={[10, 10, 20, 12]}
          matrixAutoUpdate={false}
          matrix={matrixController.clone().multiply(matrixCylinder)}
        >
          <meshStandardMaterial></meshStandardMaterial>
        </Cylinder>
        <Box
          args={[20, 4, 10]}
          matrixAutoUpdate={false}
          matrix={matrixController.clone().multiply(matrixBox)}
        >
          <meshStandardMaterial></meshStandardMaterial>
        </Box>
        <Plane args={[200, 200]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={"#888"}></meshStandardMaterial>
        </Plane>
      </Canvas>
    </main>
  );
}
