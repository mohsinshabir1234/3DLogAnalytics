"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DataLayer from "./layers/dataLayer";

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 50, 120], fov: 60 }}
      dpr={[1, 2]}
      style={{ background: "#0b0e14", height: "100vh", width: "100vw" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[50, 100, 50]} intensity={0.8} />
      <gridHelper args={[500, 50]} />
      <OrbitControls enableDamping />
      <DataLayer />
    </Canvas>
  );
}
