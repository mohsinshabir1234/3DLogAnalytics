"use client";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useLogs } from "../logprovider";

export default function DataLayer() {
  const { filteredLogs, setSelectedLogId } = useLogs();

  const errors = useMemo(() => filteredLogs.filter(l => l.type === "error"), [filteredLogs]);
  const infos  = useMemo(() => filteredLogs.filter(l => l.type === "info"), [filteredLogs]);
  const warns  = useMemo(() => filteredLogs.filter(l => l.type === "warning"), [filteredLogs]);

  // Positioning by timestamp bucket: x = ts*10, z lane per type
  const posFor = (ts, lane) => [ts * 10, 0, lane * 10];

  // Refs for instanced meshes
  const errorRef = useRef();
  const infoRef  = useRef();
  const warnRef  = useRef();

  // Populate/refresh instances
  useEffect(() => {
    const m = new THREE.Matrix4();

    if (errorRef.current) {
      for (let i = 0; i < errors.length; i++) {
        const l = errors[i];
        const [x, y, z] = posFor(l.ts, 0);
        m.makeTranslation(x, y + 2, z);
        const scale = (l.severity ? 1 + l.severity * 0.4 : 1);
        m.multiply(new THREE.Matrix4().makeScale(scale, scale, scale));
        errorRef.current.setMatrixAt(i, m);
        errorRef.current.setColorAt(i, new THREE.Color("red"));
      }
      errorRef.current.instanceMatrix.needsUpdate = true;
      if (errorRef.current.instanceColor) errorRef.current.instanceColor.needsUpdate = true;
    }

    if (infoRef.current) {
      for (let i = 0; i < infos.length; i++) {
        const l = infos[i];
        const [x, y, z] = posFor(l.ts, 1);
        m.makeTranslation(x, y + 2, z);
        infoRef.current.setMatrixAt(i, m);
        infoRef.current.setColorAt(i, new THREE.Color("blue"));
      }
      infoRef.current.instanceMatrix.needsUpdate = true;
      if (infoRef.current.instanceColor) infoRef.current.instanceColor.needsUpdate = true;
    }

    if (warnRef.current) {
      for (let i = 0; i < warns.length; i++) {
        const l = warns[i];
        const [x, y, z] = posFor(l.ts, 2);
        m.makeTranslation(x, y + 2, z);
        warnRef.current.setMatrixAt(i, m);
        warnRef.current.setColorAt(i, new THREE.Color("yellow"));
      }
      warnRef.current.instanceMatrix.needsUpdate = true;
      if (warnRef.current.instanceColor) warnRef.current.instanceColor.needsUpdate = true;
    }
  }, [errors, infos, warns]);

  // Picking (click): instanceId => log
  const onClickInstance = (type, e) => {
    e.stopPropagation();
    const id = e.instanceId;
    if (id == null) return;
    let log = null;
    if (type === "error") log = errors[id];
    else if (type === "info") log = infos[id];
    else if (type === "warning") log = warns[id];
    if (log) setSelectedLogId(log.id);
  };

  // IP relationship lines (demo: connect same-src to same-dst across types)
  const lines = useMemo(() => {
    const pts = [];
    const mapByIp = new Map();
    filteredLogs.forEach(l => {
      const key = (l.ipSrc || "") + ">" + (l.ipDst || "");
      if (!mapByIp.has(key)) mapByIp.set(key, []);
      mapByIp.get(key).push(l);
    });
    for (const arr of mapByIp.values()) {
      if (arr.length < 2) continue;
      const a = arr[0], b = arr[arr.length - 1];
      const aPos = posFor(a.ts, a.type === "error" ? 0 : a.type === "info" ? 1 : 2);
      const bPos = posFor(b.ts, b.type === "error" ? 0 : b.type === "info" ? 1 : 2);
      pts.push({ from: aPos, to: bPos });
    }
    return pts;
  }, [filteredLogs]);

  // Heatmap plane (basic: shows activity spread along X)
  // For simplicity, we just draw a semi-transparent plane under objects.
  // Advanced heatmap (texture/shader) can be added later.
  return (
    <>
      {/* Underlay plane */}
      <mesh position={[250, -0.01, 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[600, 120, 1, 1]} />
        <meshStandardMaterial transparent opacity={0.15} color="#00ffaa" />
      </mesh>

      {/* Error spheres */}
      <instancedMesh
        ref={errorRef}
        args={[null, null, errors.length]}
        onClick={(e) => onClickInstance("error", e)}
      >
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial />
      </instancedMesh>

      {/* Info cubes */}
      <instancedMesh
        ref={infoRef}
        args={[null, null, infos.length]}
        onClick={(e) => onClickInstance("info", e)}
      >
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial />
      </instancedMesh>

      {/* Warning pyramids (cone with 4 segments) */}
      <instancedMesh
        ref={warnRef}
        args={[null, null, warns.length]}
        onClick={(e) => onClickInstance("warning", e)}
      >
        <coneGeometry args={[3, 5, 4]} />
        <meshStandardMaterial />
      </instancedMesh>

      {/* Connection lines */}
      {lines.map((l, i) => (
        <Line key={i} points={[l.from, l.to]} lineWidth={1} />
      ))}
    </>
  );
}
