"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type SectionId = "about" | "experience" | "contact";
type Direction = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
type ControlState = Record<Direction, boolean>;
type JoystickVector = { x: number; y: number };
type CameraLookDelta = { x: number; y: number };

type StallData = {
  id: SectionId;
  label: string;
  food: string;
  callout: string;
  position: [number, number, number];
  color: string;
  trim: string;
  accent: string;
};

const STALLS: StallData[] = [
  {
    id: "about",
    label: "ABOUT ME",
    food: "dumplings",
    callout: "steamed dumplings!",
    position: [-5, 0, -2.4],
    color: "#f6a594",
    trim: "#fff1d9",
    accent: "#d85f54",
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    food: "fruit",
    callout: "fresh fruit!",
    position: [5, 0, -2.4],
    color: "#e9b8d6",
    trim: "#fff6de",
    accent: "#a65f8c",
  },
  {
    id: "contact",
    label: "CONTACT",
    food: "matcha",
    callout: "matcha lattes!",
    position: [0, 0, -5.4],
    color: "#a7c895",
    trim: "#f4f0c7",
    accent: "#61855b",
  },
];

const EMPTY_CONTROLS: ControlState = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

const MOVEMENT_KEYS: Record<string, Direction> = {
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  w: "ArrowUp",
  s: "ArrowDown",
  a: "ArrowLeft",
  d: "ArrowRight",
};

const FRUIT_GAME_BASKET_POSITION = new THREE.Vector3(6.9, 0, -1.15);

const sectionContent = {
  about: {
    eyebrow: "A little bowl of me",
    title: "Hi, I’m Emma!",
    intro:
      "I’m a UCLA Statistics and Data Science major with a minor in Data Science Engineering.",
  },
  experience: {
    eyebrow: "Fresh from the kitchen",
    title: "Where I’ve worked",
    intro:
      "My experience spans data engineering, business intelligence, and data science. I’m deeply passionate about using data to uncover insights and tell meaningful stories.",
  },
  contact: {
    eyebrow: "Let’s share a cup",
    title: "Say hello",
    intro:
      "Want to chat or have an excellent restaurant recommendation to share? Feel free to reach out by email or connect with me on LinkedIn!",
  },
};

function Petals() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petals = useMemo(
    () =>
      Array.from({ length: 52 }, (_, index) => ({
        x: ((index * 3.71) % 22) - 11,
        y: ((index * 2.43) % 13) + 1,
        z: ((index * 5.17) % 20) - 10,
        speed: 0.22 + (index % 7) * 0.035,
        drift: 0.35 + (index % 5) * 0.08,
        phase: index * 0.73,
        scale: 0.6 + (index % 4) * 0.12,
      })),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const time = clock.elapsedTime;
    petals.forEach((petal, index) => {
      petal.y -= petal.speed * delta * 3;
      if (petal.y < 0.25) petal.y = 13;
      dummy.position.set(
        petal.x + Math.sin(time * petal.drift + petal.phase) * 0.65,
        petal.y,
        petal.z + Math.cos(time * 0.28 + petal.phase) * 0.35,
      );
      dummy.rotation.set(time * 0.7 + petal.phase, time * 0.4, petal.phase);
      dummy.scale.setScalar(petal.scale);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, petals.length]}>
      <octahedronGeometry args={[0.075, 0]} />
      <meshStandardMaterial color="#c5a6e8" roughness={0.65} />
    </instancedMesh>
  );
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[
        [-0.7, 0, 0],
        [0, 0.18, 0],
        [0.72, 0, 0],
        [-0.18, -0.12, 0],
        [0.35, -0.12, 0],
      ].map((p, index) => (
        <mesh key={index} position={p as [number, number, number]} scale={[1.2, 0.75, 0.65]}>
          <sphereGeometry args={[0.62, 18, 14]} />
          <meshStandardMaterial color="#fffdf8" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function PlazaTitle() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 768;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "rgba(94, 59, 34, 0.27)";
    context.font = '900 356px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
    context.fillText("Emma Wu", 1038, 247);
    context.fillStyle = "#704729";
    context.fillText("Emma Wu", 1024, 224);
    context.fillStyle = "#7c5233";
    context.font = '900 72px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
    context.fillText("welcome to my personal website", 1024, 506);
    context.fillStyle = "#81583a";
    context.font = '900 58px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
    context.fillText("(talk to a cart to learn more!)", 1024, 624);

    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.anisotropy = 8;
    nextTexture.needsUpdate = true;
    setTexture(nextTexture);
    return () => nextTexture.dispose();
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0.115, 2.2]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
      <planeGeometry args={[11.7, 4.38]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Bush({ position, tint = "#79ad6a" }: { position: [number, number, number]; tint?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <sphereGeometry args={[0.62, 16, 12]} />
        <meshStandardMaterial color={tint} roughness={0.9} />
      </mesh>
      <mesh position={[0.45, 0.3, 0.12]} castShadow>
        <sphereGeometry args={[0.42, 16, 12]} />
        <meshStandardMaterial color={tint} roughness={0.9} />
      </mesh>
      <mesh position={[-0.38, 0.28, 0.1]} castShadow>
        <sphereGeometry args={[0.4, 16, 12]} />
        <meshStandardMaterial color={tint} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Flower({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.03, 0.44, 7]} />
        <meshStandardMaterial color="#588b4f" roughness={0.9} />
      </mesh>
      <group position={[0, 0.47, 0]} rotation={[-0.28, 0, 0]}>
        {[0, 1, 2, 3, 4].map((petal) => {
          const angle = (petal / 5) * Math.PI * 2;
          return (
            <mesh key={petal} position={[Math.cos(angle) * 0.13, Math.sin(angle) * 0.13, 0]} scale={[1.3, 0.78, 0.55]} castShadow>
              <sphereGeometry args={[0.105, 12, 9]} />
              <meshStandardMaterial color={color} roughness={0.84} />
            </mesh>
          );
        })}
        <mesh position={[0, 0, 0.055]}>
          <sphereGeometry args={[0.075, 12, 9]} />
          <meshStandardMaterial color="#f1c55e" roughness={0.82} />
        </mesh>
      </group>
    </group>
  );
}

function Tree({ position, pink = false }: { position: [number, number, number]; pink?: boolean }) {
  const leaf = pink ? "#eaa9c3" : "#78a964";
  return (
    <group position={position}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 2.2, 10]} />
        <meshStandardMaterial color="#a97955" roughness={0.95} />
      </mesh>
      {[
        [0, 2.5, 0],
        [-0.62, 2.2, 0.08],
        [0.64, 2.22, 0.12],
        [0, 2.1, 0.5],
      ].map((p, index) => (
        <mesh key={index} position={p as [number, number, number]} castShadow>
          <sphereGeometry args={[0.85, 18, 14]} />
          <meshStandardMaterial color={index === 3 && !pink ? "#8dbb74" : leaf} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function Plaza() {
  const tiles = useMemo(() => {
    const result: { position: [number, number, number]; color: string }[] = [];
    for (let x = -8; x <= 8; x += 1) {
      for (let z = -7; z <= 7; z += 1) {
        result.push({
          position: [x * 0.94, 0.04, z * 0.94],
          color: (x + z) % 2 === 0 ? "#d9b98f" : "#e2c49d",
        });
      }
    }
    return result;
  }, []);

  const edgeBushes = useMemo(
    () => [
      [-8.25, 0, -5.8],
      [-8.2, 0, -3.8],
      [-8.3, 0, -1.7],
      [-8.25, 0, 0.6],
      [-8.2, 0, 3],
      [-8.3, 0, 5.3],
      [8.25, 0, -5.8],
      [8.2, 0, -3.8],
      [8.3, 0, -1.7],
      [8.25, 0, 0.6],
      [8.2, 0, 3],
      [8.3, 0, 5.3],
    ] as [number, number, number][],
    [],
  );

  const flowers = useMemo(
    () => [
      { position: [-8.85, 0, -4.8], color: "#f4c3d7", scale: 0.95 },
      { position: [-8.72, 0, -0.8], color: "#d7c1ef", scale: 1.1 },
      { position: [-8.9, 0, 4.45], color: "#fff2ce", scale: 0.9 },
      { position: [8.8, 0, -4.9], color: "#d7c1ef", scale: 1.05 },
      { position: [8.72, 0, -0.35], color: "#f4c3d7", scale: 0.88 },
      { position: [8.88, 0, 4.7], color: "#fff2ce", scale: 1.08 },
      { position: [-6.5, 0, 7.55], color: "#d9c3ef", scale: 1 },
      { position: [-4.5, 0, 7.7], color: "#f7c6d8", scale: 0.86 },
      { position: [-2.2, 0, 7.52], color: "#fff2ce", scale: 1.06 },
      { position: [2.35, 0, 7.65], color: "#f7c6d8", scale: 0.94 },
      { position: [4.6, 0, 7.48], color: "#d9c3ef", scale: 1.08 },
      { position: [6.45, 0, 7.7], color: "#fff2ce", scale: 0.9 },
      { position: [-6.7, 0, -7.35], color: "#f4c3d7", scale: 0.9 },
      { position: [-2.7, 0, -7.42], color: "#d7c1ef", scale: 1.02 },
      { position: [3.1, 0, -7.38], color: "#fff2ce", scale: 0.92 },
      { position: [6.8, 0, -7.28], color: "#f4c3d7", scale: 1.06 },
    ] as const,
    [],
  );

  return (
    <group>
      <mesh position={[0, -0.18, 0]} receiveShadow>
        <boxGeometry args={[30, 0.3, 26]} />
        <meshStandardMaterial color="#9acb7d" roughness={0.96} />
      </mesh>
      {tiles.map((tile, index) => (
        <mesh key={index} position={tile.position} receiveShadow>
          <boxGeometry args={[0.9, 0.1, 0.9]} />
          <meshStandardMaterial color={tile.color} roughness={0.92} />
        </mesh>
      ))}
      <PlazaTitle />
      {edgeBushes.map((position, index) => (
        <Bush key={index} position={position} tint={index % 3 === 0 ? "#6fa85f" : "#84b875"} />
      ))}
      {flowers.map((flower, index) => (
        <Flower key={index} position={flower.position as [number, number, number]} color={flower.color} scale={flower.scale} />
      ))}
      <Tree position={[-9.4, 0, -6.8]} />
      <Tree position={[9.3, 0, -6.3]} pink />
      <Tree position={[-9.5, 0, 3.3]} pink />
      <Tree position={[9.6, 0, 3.9]} />
      <Tree position={[-6.7, 0, 8.4]} />
      <Tree position={[6.7, 0, 8.4]} pink />
      <Cloud position={[-9, 8.5, -10]} scale={1.5} />
      <Cloud position={[8, 10, -14]} scale={1.2} />
    </group>
  );
}

function Vendor({ color }: { color: string }) {
  return (
    <group position={[0, 2.08, -0.36]}>
      <mesh position={[0, 0.4, 0]} castShadow scale={[0.82, 0.78, 0.78]}>
        <sphereGeometry args={[0.45, 24, 18]} />
        <meshStandardMaterial color={color} roughness={0.78} />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow scale={[0.72, 0.68, 0.68]}>
        <sphereGeometry args={[0.42, 20, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[-0.14, 0.43, 0.35]}>
        <sphereGeometry args={[0.035, 12, 8]} />
        <meshStandardMaterial color="#33312f" />
      </mesh>
      <mesh position={[0.14, 0.43, 0.35]}>
        <sphereGeometry args={[0.035, 12, 8]} />
        <meshStandardMaterial color="#33312f" />
      </mesh>
    </group>
  );
}

function CartLabel({ label, active }: { label: string; active: boolean }) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#574740";
    context.font = '900 104px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
    context.fillText(label, 512, 130);
    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.anisotropy = 8;
    nextTexture.needsUpdate = true;
    setTexture(nextTexture);
    return () => nextTexture.dispose();
  }, [label]);

  if (!texture) return null;
  return (
    <mesh position={[0, 1.42, 1.185]} renderOrder={3}>
      <planeGeometry args={[2.32, 0.53]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} color={active ? "#f4e8ff" : "#ffffff"} toneMapped={false} />
    </mesh>
  );
}

function FoodDisplay({ type }: { type: SectionId }) {
  if (type === "about") {
    return (
      <group position={[0, 1.63, 0.56]}>
        <RoundedBox args={[1.5, 0.12, 0.55]} radius={0.06} smoothness={3}>
          <meshStandardMaterial color="#34302d" />
        </RoundedBox>
        {[-0.5, 0, 0.5].map((x) => (
          <group key={x} position={[x, 0.19, 0]}>
            <mesh scale={[1.12, 0.78, 0.7]} castShadow>
              <sphereGeometry args={[0.19, 18, 14]} />
              <meshStandardMaterial color="#f2dcc0" roughness={0.86} />
            </mesh>
            {[-0.055, 0, 0.055].map((fold) => (
              <mesh key={fold} position={[fold, 0.135, 0]} scale={[0.65, 1.15, 0.65]}>
                <sphereGeometry args={[0.037, 10, 8]} />
                <meshStandardMaterial color="#e5c49e" roughness={0.9} />
              </mesh>
            ))}
          </group>
        ))}
        <group position={[-1.03, 0.19, 0.02]} rotation={[0, -0.18, 0]}>
          {[-0.045, 0.045].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.018, 0.82, 8]} />
              <meshStandardMaterial color={x < 0 ? "#b77d43" : "#c58d4f"} roughness={0.88} />
            </mesh>
          ))}
        </group>
        <group position={[0.96, 0.22, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.105, 0.12, 0.38, 16]} />
            <meshStandardMaterial color="#6f3427" roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.058, 0.075, 0.12, 14]} />
            <meshStandardMaterial color="#cc6954" roughness={0.76} />
          </mesh>
          <mesh position={[0, -0.02, 0.105]}>
            <boxGeometry args={[0.14, 0.13, 0.012]} />
            <meshStandardMaterial color="#f4dfb8" roughness={0.9} />
          </mesh>
        </group>
      </group>
    );
  }
  if (type === "experience") {
    const fruits = [
      { position: [-0.68, 0.2, 0], color: "#e76f59", scale: [1, 1, 1] },
      { position: [-0.25, 0.23, 0.03], color: "#f2b744", scale: [1, 1, 1] },
      { position: [0.2, 0.2, -0.02], color: "#cf5a76", scale: [1, 1, 1] },
      { position: [0.64, 0.23, 0.02], color: "#86a95b", scale: [0.92, 1.14, 0.92] },
      { position: [-0.46, 0.47, -0.03], color: "#eb8b45", scale: [1, 1, 1] },
      { position: [0.02, 0.48, 0], color: "#e6584e", scale: [1, 1, 1] },
      { position: [0.45, 0.47, -0.02], color: "#efcc54", scale: [0.96, 1.08, 0.96] },
    ] as const;
    return (
      <group position={[0, 1.65, 0.69]}>
        <RoundedBox args={[1.8, 0.34, 0.72]} radius={0.09} smoothness={3} position={[0, 0.03, 0]}>
          <meshStandardMaterial color="#b98255" roughness={0.92} />
        </RoundedBox>
        {fruits.map((fruit, index) => (
          <group key={index} position={fruit.position as [number, number, number]}>
            <mesh scale={fruit.scale as [number, number, number]} castShadow>
              <sphereGeometry args={[0.2, 18, 14]} />
              <meshStandardMaterial color={fruit.color} roughness={0.78} />
            </mesh>
            <mesh position={[0.02, 0.2, 0]} rotation={[0, 0, index % 2 ? 0.3 : -0.25]}>
              <cylinderGeometry args={[0.018, 0.025, 0.16, 7]} />
              <meshStandardMaterial color="#6d7440" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }
  return (
    <group position={[0, 1.68, 0.55]}>
      {[-0.68, -0.27].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.17, 0.14, 0.38, 18]} />
            <meshStandardMaterial color="#f1f3d9" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.21, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.05, 18]} />
            <meshStandardMaterial color="#86aa69" />
          </mesh>
        </group>
      ))}
      <group position={[0.32, 0.02, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.29, 22, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#e6dfbc" roughness={0.86} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.027, 8, 24]} />
          <meshStandardMaterial color="#d0c58e" roughness={0.84} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.225, 0.225, 0.026, 22]} />
          <meshStandardMaterial color="#79a85e" roughness={0.78} />
        </mesh>
      </group>
      <group position={[0.82, 0.22, 0.01]} rotation={[0, 0, -0.7]} scale={0.22}>
        <MatchaWhiskModel />
      </group>
    </group>
  );
}

function Cart({ data, active, onOpen }: { data: StallData; active: boolean; onOpen: () => void }) {
  return (
    <group
      position={data.position}
      rotation={[0, data.id === "about" ? 0.12 : data.id === "experience" ? -0.12 : 0, 0]}
      onClick={(event) => {
        event.stopPropagation();
        if (active) onOpen();
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
      }}
    >
      <group position={[0, -0.12, 0]}>
        <RoundedBox args={[3.25, 1.55, 1.75]} radius={0.22} smoothness={4} position={[0, 0.9, 0]} castShadow>
          <meshStandardMaterial color={data.color} roughness={0.78} />
        </RoundedBox>
        <RoundedBox args={[2.65, 0.7, 0.35]} radius={0.12} smoothness={4} position={[0, 1.35, 1]}>
          <meshStandardMaterial color={data.trim} roughness={0.82} />
        </RoundedBox>
        <CartLabel label={data.label} active={active} />
        <FoodDisplay type={data.id} />
        <Vendor color={data.id === "experience" ? "#fff8ed" : "#fffdf5"} />

        {[-1.45, 1.45].map((x) => (
          <mesh key={x} position={[x, 2.34, -0.02]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 1.72, 10]} />
            <meshStandardMaterial color={data.accent} roughness={0.82} />
          </mesh>
        ))}

        <group position={[0, 3.15, 0]}>
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[3.55, 0.28, 2.15]} />
            <meshStandardMaterial color={data.trim} roughness={0.85} />
          </mesh>
          {[-1.32, -0.45, 0.45, 1.32].map((x, index) => (
            <mesh key={x} position={[x, -0.04, 0.04]} rotation={[0, 0, index % 2 ? 0.05 : -0.05]}>
              <boxGeometry args={[0.82, 0.34, 2.22]} />
              <meshStandardMaterial color={index % 2 ? data.trim : data.color} roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {active && (
        <Float speed={2.8} floatIntensity={0.25}>
          <Html position={[0, 4.7, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
            <div className="near-bubble">{data.callout}</div>
          </Html>
        </Float>
      )}
    </group>
  );
}

function Player({
  controls,
  joystick,
  paused,
  playerPosition,
  onNearChange,
  onNearGameChange,
  onMove,
}: {
  controls: React.MutableRefObject<ControlState>;
  joystick: React.MutableRefObject<JoystickVector>;
  paused: boolean;
  playerPosition: React.MutableRefObject<THREE.Vector3>;
  onNearChange: (id: SectionId | null) => void;
  onNearGameChange: (isNear: boolean) => void;
  onMove: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const lastNear = useRef<SectionId | null>(null);
  const lastNearGame = useRef(false);
  const wasMoving = useRef(false);
  const direction = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const torsoProfile = useMemo(
    () =>
      new THREE.SplineCurve([
        new THREE.Vector2(0, -0.56),
        new THREE.Vector2(0.18, -0.55),
        new THREE.Vector2(0.27, -0.48),
        new THREE.Vector2(0.31, -0.32),
        new THREE.Vector2(0.33, -0.04),
        new THREE.Vector2(0.325, 0.12),
        new THREE.Vector2(0.3, 0.25),
        new THREE.Vector2(0.26, 0.35),
        new THREE.Vector2(0.21, 0.42),
        new THREE.Vector2(0.155, 0.47),
        new THREE.Vector2(0.115, 0.52),
      ]).getPoints(36),
    [],
  );
  const armProfile = useMemo(
    () =>
      new THREE.SplineCurve([
        new THREE.Vector2(0, -0.7),
        new THREE.Vector2(0.055, -0.69),
        new THREE.Vector2(0.075, -0.63),
        new THREE.Vector2(0.082, -0.45),
        new THREE.Vector2(0.09, -0.24),
        new THREE.Vector2(0.105, -0.08),
        new THREE.Vector2(0.122, 0.015),
        new THREE.Vector2(0.08, 0.065),
        new THREE.Vector2(0, 0.08),
      ]).getPoints(28),
    [],
  );
  const legProfile = useMemo(
    () => [
      new THREE.Vector2(0, -0.56),
      new THREE.Vector2(0.075, -0.55),
      new THREE.Vector2(0.115, -0.49),
      new THREE.Vector2(0.12, -0.28),
      new THREE.Vector2(0.115, -0.08),
      new THREE.Vector2(0.14, 0.06),
      new THREE.Vector2(0.12, 0.12),
      new THREE.Vector2(0, 0.13),
    ],
    [],
  );
  const { camera } = useThree();

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const keys = controls.current;
    const horizontal = THREE.MathUtils.clamp(
      (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0) + joystick.current.x,
      -1,
      1,
    );
    const vertical = THREE.MathUtils.clamp(
      (keys.ArrowUp ? 1 : 0) - (keys.ArrowDown ? 1 : 0) + joystick.current.y,
      -1,
      1,
    );
    const inputStrength = Math.min(1, Math.hypot(horizontal, vertical));
    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    forward.current.normalize();
    right.current.crossVectors(forward.current, camera.up).normalize();
    direction.current.copy(forward.current).multiplyScalar(vertical).addScaledVector(right.current, horizontal);

    const moving = !paused && direction.current.lengthSq() > 0;
    if (moving && !wasMoving.current) onMove();
    wasMoving.current = moving;
    if (moving) {
      direction.current.normalize();
      const nextX = THREE.MathUtils.clamp(group.current.position.x + direction.current.x * delta * 3.25 * inputStrength, -7.2, 7.2);
      const nextZ = THREE.MathUtils.clamp(group.current.position.z + direction.current.z * delta * 3.25 * inputStrength, -6.8, 6.6);
      const blocked = STALLS.some((stall) => {
        const dx = Math.abs(nextX - stall.position[0]);
        const dz = Math.abs(nextZ - stall.position[2]);
        return dx < 1.95 && dz < 1.52;
      });
      if (!blocked) group.current.position.set(nextX, 0, nextZ);
      group.current.rotation.y = Math.atan2(direction.current.x, direction.current.z);
    }

    const stride = moving ? Math.sin(clock.elapsedTime * 10) * 0.48 * inputStrength : 0;
    if (leftLeg.current) leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, stride, 0.24);
    if (rightLeg.current) rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, -stride, 0.24);
    if (leftArm.current) leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, -stride * 0.68, 0.2);
    if (rightArm.current) rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, stride * 0.68, 0.2);
    group.current.position.y = moving ? Math.abs(Math.sin(clock.elapsedTime * 10)) * 0.05 : 0;
    playerPosition.current.set(group.current.position.x, 0, group.current.position.z);

    const basketDistance = Math.hypot(
      group.current.position.x - FRUIT_GAME_BASKET_POSITION.x,
      group.current.position.z - FRUIT_GAME_BASKET_POSITION.z,
    );
    const nearGame = basketDistance < 1.75;
    if (nearGame !== lastNearGame.current) {
      lastNearGame.current = nearGame;
      onNearGameChange(nearGame);
    }

    let near: SectionId | null = null;
    if (!nearGame) {
      let nearestDistance = Infinity;
      STALLS.forEach((stall) => {
        const dx = group.current!.position.x - stall.position[0];
        const dz = group.current!.position.z - stall.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        if (distance < 3.15 && distance < nearestDistance) {
          nearestDistance = distance;
          near = stall.id;
        }
      });
    }
    if (near !== lastNear.current) {
      lastNear.current = near;
      onNearChange(near);
    }

  }, -1);

  return (
    <group ref={group} position={[0, 0, 5.3]}>
      {/* A buried shoulder bridge gives both moving arms a continuous rounded socket. */}
      <mesh position={[0, 1.3, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.9]} castShadow>
        <capsuleGeometry args={[0.13, 0.43, 24, 36]} />
        <meshStandardMaterial color="#fffdf7" roughness={0.78} />
      </mesh>

      {/* One continuous torso profile narrows naturally into the head. */}
      <mesh position={[0, 1.02, 0]} scale={[1, 1, 0.9]} castShadow>
        <latheGeometry args={[torsoProfile, 40]} />
        <meshStandardMaterial color="#fffdf7" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.88, 0]} scale={[0.43, 0.42, 0.4]} castShadow>
        <sphereGeometry args={[1, 36, 28]} />
        <meshStandardMaterial color="#fffdf7" roughness={0.76} />
      </mesh>
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 1.91, 0.385]}>
          <mesh scale={[0.76, 1.08, 0.3]}>
            <sphereGeometry args={[0.064, 18, 14]} />
            <meshStandardMaterial color="#3e3c3a" roughness={0.58} />
          </mesh>
          <mesh position={[-0.014, 0.021, 0.021]}>
            <sphereGeometry args={[0.012, 10, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      <group ref={leftArm} position={[-0.285, 1.31, 0]} rotation={[0, 0, -0.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.126, 28, 20]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.8} />
        </mesh>
        <mesh scale={[1.14, 1, 1.14]} castShadow>
          <latheGeometry args={[armProfile, 32]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.8} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.285, 1.31, 0]} rotation={[0, 0, 0.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.126, 28, 20]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.8} />
        </mesh>
        <mesh scale={[1.14, 1, 1.14]} castShadow>
          <latheGeometry args={[armProfile, 32]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.8} />
        </mesh>
      </group>

      <group ref={leftLeg} position={[-0.18, 0.58, 0]}>
        <mesh scale={[1, 1, 1.08]} castShadow>
          <latheGeometry args={[legProfile, 32]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.82} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.18, 0.58, 0]}>
        <mesh scale={[1, 1, 1.08]} castShadow>
          <latheGeometry args={[legProfile, 32]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.82} />
        </mesh>
      </group>
    </group>
  );
}

function CameraRig({
  playerPosition,
  mobileLook,
}: {
  playerPosition: React.MutableRefObject<THREE.Vector3>;
  mobileLook: React.MutableRefObject<CameraLookDelta>;
}) {
  const orbit = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const previousPlayerPosition = useRef(playerPosition.current.clone());
  const movementDelta = useRef(new THREE.Vector3());
  const cameraOffset = useRef(new THREE.Vector3());
  const spherical = useRef(new THREE.Spherical());
  const { camera } = useThree();

  useFrame(({ size }) => {
    if (!orbit.current) return;
    movementDelta.current.subVectors(playerPosition.current, previousPlayerPosition.current);
    if (movementDelta.current.lengthSq() > 0) {
      camera.position.add(movementDelta.current);
      orbit.current.target.add(movementDelta.current);
      previousPlayerPosition.current.copy(playerPosition.current);
    }

    const lookX = THREE.MathUtils.clamp(mobileLook.current.x, -48, 48);
    const lookY = THREE.MathUtils.clamp(mobileLook.current.y, -48, 48);
    if (lookX !== 0 || lookY !== 0) {
      cameraOffset.current.subVectors(camera.position, orbit.current.target);
      spherical.current.setFromVector3(cameraOffset.current);
      const radiansPerPixel = (Math.PI * 2 * 0.52) / Math.max(size.height, 1);
      spherical.current.theta -= lookX * radiansPerPixel;
      spherical.current.phi = THREE.MathUtils.clamp(
        spherical.current.phi - lookY * radiansPerPixel,
        0.54,
        1.28,
      );
      cameraOffset.current.setFromSpherical(spherical.current);
      camera.position.copy(orbit.current.target).add(cameraOffset.current);
      mobileLook.current.x = 0;
      mobileLook.current.y = 0;
    }

    orbit.current.update();
  });

  return (
    <OrbitControls
      ref={orbit}
      target={[0, 1.15, 5.3]}
      enablePan={false}
      enableDamping
      dampingFactor={0.075}
      minDistance={7.5}
      maxDistance={17}
      minPolarAngle={0.54}
      maxPolarAngle={1.28}
      rotateSpeed={0.62}
      zoomSpeed={0.75}
    />
  );
}

function World({
  controls,
  joystick,
  mobileLook,
  activeSection,
  gameOpen,
  nearSection,
  nearGameBasket,
  onNearChange,
  onNearGameChange,
  onMove,
  onOpen,
  onStartGame,
}: {
  controls: React.MutableRefObject<ControlState>;
  joystick: React.MutableRefObject<JoystickVector>;
  mobileLook: React.MutableRefObject<CameraLookDelta>;
  activeSection: SectionId | null;
  gameOpen: boolean;
  nearSection: SectionId | null;
  nearGameBasket: boolean;
  onNearChange: (id: SectionId | null) => void;
  onNearGameChange: (isNear: boolean) => void;
  onMove: () => void;
  onOpen: (id: SectionId) => void;
  onStartGame: () => void;
}) {
  const playerPosition = useRef(new THREE.Vector3(0, 0, 5.3));

  return (
    <>
      <color attach="background" args={["#a9d9ec"]} />
      <fog attach="fog" args={["#b9deeb", 17, 40]} />
      <ambientLight intensity={1.7} />
      <hemisphereLight args={["#dff7ff", "#8dac71", 1.3]} />
      <directionalLight
        position={[-5, 13, 7]}
        intensity={2.4}
        color="#fff4d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={35}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <Plaza />
      {STALLS.map((stall) => (
        <Cart key={stall.id} data={stall} active={nearSection === stall.id && activeSection === null && !gameOpen} onOpen={() => onOpen(stall.id)} />
      ))}
      <PlazaGameBasket active={nearGameBasket && activeSection === null && !gameOpen} onOpen={onStartGame} />
      <Player
        controls={controls}
        joystick={joystick}
        paused={activeSection !== null || gameOpen}
        playerPosition={playerPosition}
        onNearChange={onNearChange}
        onNearGameChange={onNearGameChange}
        onMove={onMove}
      />
      <CameraRig playerPosition={playerPosition} mobileLook={mobileLook} />
      <Petals />
      <ContactShadows position={[0, 0.1, 0]} opacity={0.28} scale={24} blur={2.6} far={13} />
    </>
  );
}

type FruitKind = "apple" | "orange" | "pear" | "grape";

type FallingFruitData = {
  id: number;
  kind: FruitKind;
  x: number;
  speed: number;
  phase: number;
};

const FRUIT_KINDS: FruitKind[] = ["apple", "orange", "pear", "grape"];

function FruitModel({ kind }: { kind: FruitKind }) {
  const leaf = (
    <mesh position={[0.13, 0.49, 0]} rotation={[0, 0, -0.45]} scale={[0.16, 0.065, 0.09]} castShadow>
      <sphereGeometry args={[1, 14, 9]} />
      <meshStandardMaterial color="#789854" roughness={0.82} />
    </mesh>
  );

  if (kind === "grape") {
    const grapes: [number, number, number][] = [
      [-0.18, 0.26, 0], [0, 0.29, 0.03], [0.18, 0.24, 0],
      [-0.12, 0.07, 0.05], [0.1, 0.08, 0], [0, -0.12, 0.03],
    ];
    return (
      <group>
        {grapes.map((position, index) => (
          <mesh key={index} position={position} castShadow>
            <sphereGeometry args={[0.17, 16, 12]} />
            <meshStandardMaterial color={index % 2 ? "#9b72ad" : "#ad82ba"} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 0.53, 0]} rotation={[0, 0, 0.16]} castShadow>
          <cylinderGeometry args={[0.026, 0.036, 0.26, 9]} />
          <meshStandardMaterial color="#795f3f" roughness={0.88} />
        </mesh>
        {leaf}
      </group>
    );
  }

  if (kind === "pear") {
    return (
      <group>
        <mesh position={[0, -0.04, 0]} scale={[0.4, 0.46, 0.38]} castShadow>
          <sphereGeometry args={[1, 22, 16]} />
          <meshStandardMaterial color="#acd16f" roughness={0.76} />
        </mesh>
        <mesh position={[0, 0.31, 0]} scale={[0.27, 0.31, 0.26]} castShadow>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color="#b6d979" roughness={0.76} />
        </mesh>
        <mesh position={[0, 0.59, 0]} rotation={[0, 0, 0.12]} castShadow>
          <cylinderGeometry args={[0.026, 0.036, 0.24, 9]} />
          <meshStandardMaterial color="#795f3f" roughness={0.88} />
        </mesh>
        <group position={[0.01, 0.09, 0]}>{leaf}</group>
      </group>
    );
  }

  const isApple = kind === "apple";
  return (
    <group>
      <mesh scale={isApple ? [0.48, 0.43, 0.46] : [0.45, 0.45, 0.44]} castShadow>
        <sphereGeometry args={[1, 24, 18]} />
        <meshStandardMaterial color={isApple ? "#e97169" : "#f1a34f"} roughness={isApple ? 0.72 : 0.82} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0.14]} castShadow>
        <cylinderGeometry args={[0.025, 0.036, 0.24, 9]} />
        <meshStandardMaterial color="#795f3f" roughness={0.88} />
      </mesh>
      {leaf}
    </group>
  );
}

function PlazaGameBasket({ active, onOpen }: { active: boolean; onOpen: () => void }) {
  const group = useRef<THREE.Group>(null);
  const hover = useRef(false);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const targetScale = active || hover.current ? 1.08 : 1;
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, 8, delta));
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.75) * 0.025;
  });

  return (
    <group
      ref={group}
      position={FRUIT_GAME_BASKET_POSITION}
      onClick={(event) => {
        event.stopPropagation();
        if (active) onOpen();
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        hover.current = true;
      }}
      onPointerLeave={() => {
        hover.current = false;
      }}
    >
      <RoundedBox args={[1.25, 0.55, 0.8]} radius={0.14} smoothness={4} position={[0, 0.37, 0]} castShadow>
        <meshStandardMaterial color="#c98f58" roughness={0.86} />
      </RoundedBox>
      <RoundedBox args={[1.34, 0.14, 0.86]} radius={0.055} smoothness={3} position={[0, 0.63, 0]} castShadow>
        <meshStandardMaterial color="#9f663f" roughness={0.84} />
      </RoundedBox>
      {[-0.42, 0, 0.42].map((x) => (
        <mesh key={x} position={[x, 0.36, 0.41]}>
          <boxGeometry args={[0.045, 0.39, 0.025]} />
          <meshStandardMaterial color="#f0cf9e" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.78, -0.08]} rotation={[0, 0, 0]} scale={[1, 1.1, 0.72]} castShadow>
        <torusGeometry args={[0.47, 0.045, 10, 32, Math.PI]} />
        <meshStandardMaterial color="#9f663f" roughness={0.84} />
      </mesh>

      <group position={[-0.34, 0.84, 0.03]} scale={0.32} rotation={[0.05, -0.3, -0.1]}>
        <FruitModel kind="apple" />
      </group>
      <group position={[0.02, 0.83, 0.09]} scale={0.3} rotation={[0.08, 0.2, 0.05]}>
        <FruitModel kind="orange" />
      </group>
      <group position={[0.36, 0.89, 0]} scale={0.29} rotation={[0, 0.3, 0.12]}>
        <FruitModel kind="pear" />
      </group>

      {active && (
        <>
          <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.82, 0.93, 36]} />
            <meshBasicMaterial color="#f2d8ff" transparent opacity={0.68} side={THREE.DoubleSide} />
          </mesh>
          <Float speed={2.3} floatIntensity={0.18}>
            <Html position={[0, 1.75, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
              <div className="near-bubble game-basket-bubble">play fruit catch!</div>
            </Html>
          </Float>
        </>
      )}
    </group>
  );
}

function InteractiveBackdropFruit({
  kind,
  position,
  scale,
  phase,
}: {
  kind: FruitKind;
  position: [number, number, number];
  scale: number;
  phase: number;
}) {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const hoverAmount = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    hoverAmount.current = THREE.MathUtils.damp(hoverAmount.current, hovered.current ? 1 : 0, 8, delta);
    const time = clock.elapsedTime + phase;
    const outward = Math.sign(position[0]) || 1;
    group.current.position.set(
      position[0] + Math.sin(time * 0.75) * 0.06 + hoverAmount.current * outward * 0.22,
      position[1] + Math.cos(time * 0.9) * 0.07 + hoverAmount.current * 0.2,
      position[2],
    );
    group.current.rotation.y += delta * (0.25 + hoverAmount.current * 1.1);
    group.current.rotation.z = Math.sin(time * 0.7) * 0.12 + hoverAmount.current * outward * 0.16;
    group.current.scale.setScalar(scale * (1 + hoverAmount.current * 0.12));
  });

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onPointerEnter={(event) => {
        event.stopPropagation();
        hovered.current = true;
      }}
      onPointerLeave={() => {
        hovered.current = false;
      }}
    >
      <FruitModel kind={kind} />
    </group>
  );
}

function FruitBackdropLayer() {
  const fruits: { kind: FruitKind; position: [number, number, number]; scale: number; phase: number }[] = [
    { kind: "apple", position: [-4.6, 2.55, 0], scale: 1.05, phase: 0.2 },
    { kind: "orange", position: [4.65, 2.65, -0.2], scale: 1.1, phase: 1.2 },
    { kind: "pear", position: [-5.1, -0.2, -0.4], scale: 1.15, phase: 2.4 },
    { kind: "grape", position: [5.1, 0.2, 0], scale: 1.08, phase: 3.5 },
    { kind: "orange", position: [-4.2, -2.8, 0.1], scale: 0.92, phase: 4.4 },
    { kind: "apple", position: [4.35, -2.75, -0.2], scale: 0.98, phase: 5.1 },
    { kind: "grape", position: [-2.9, 3.55, -0.5], scale: 0.75, phase: 1.9 },
    { kind: "pear", position: [3.1, 3.5, -0.4], scale: 0.78, phase: 2.9 },
  ];

  return (
    <div className="fruit-backdrop-layer" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 11], fov: 43 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.55} />
        <directionalLight position={[-4, 6, 7]} intensity={2.2} />
        {fruits.map((fruit, index) => <InteractiveBackdropFruit key={index} {...fruit} />)}
      </Canvas>
    </div>
  );
}

type DumplingBackdropKind = "dumpling" | "chopsticks" | "soy";

function DumplingModel() {
  return (
    <group>
      <mesh position={[0, -0.14, 0]} scale={[0.92, 0.58, 0.62]} castShadow>
        <sphereGeometry args={[0.72, 30, 22]} />
        <meshStandardMaterial color="#f2d7b7" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.12, -0.015]} scale={[0.76, 0.38, 0.46]} castShadow>
        <sphereGeometry args={[0.66, 28, 20]} />
        <meshStandardMaterial color="#f6dfc3" roughness={0.84} />
      </mesh>
      {[-0.38, -0.19, 0, 0.19, 0.38].map((x, index) => (
        <mesh
          key={x}
          position={[x, 0.35 - Math.abs(x) * 0.16, 0.02]}
          rotation={[0, 0, (index - 2) * -0.1]}
          scale={[0.14, 0.32, 0.16]}
          castShadow
        >
          <sphereGeometry args={[0.55, 18, 14]} />
          <meshStandardMaterial color={index % 2 ? "#e7c49e" : "#efd0ac"} roughness={0.88} />
        </mesh>
      ))}
      <mesh position={[0, -0.47, 0.02]} scale={[0.68, 0.12, 0.48]}>
        <sphereGeometry args={[0.65, 22, 14]} />
        <meshStandardMaterial color="#dfbd99" roughness={0.9} />
      </mesh>
    </group>
  );
}

function ChopsticksModel() {
  return (
    <group>
      {[-0.13, 0.13].map((x, index) => (
        <group key={x} position={[x, 0, 0]} rotation={[0, 0, index ? -0.025 : 0.025]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.075, 3.2, 12]} />
            <meshStandardMaterial color={index ? "#bd8145" : "#ca9051"} roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.25, 0]}>
            <cylinderGeometry args={[0.041, 0.041, 0.32, 12]} />
            <meshStandardMaterial color="#9e6037" roughness={0.84} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SoySauceBottleModel() {
  return (
    <group>
      <mesh position={[0, -0.22, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.4, 1.15, 26]} />
        <meshPhysicalMaterial color="#713927" roughness={0.48} transmission={0.06} thickness={0.18} />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.34, 24, 16]} />
        <meshStandardMaterial color="#7b3e2a" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.73, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.24, 0.48, 22]} />
        <meshStandardMaterial color="#6b3325" roughness={0.58} />
      </mesh>
      <mesh position={[0, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.19, 0.25, 22]} />
        <meshStandardMaterial color="#cf6754" roughness={0.7} />
      </mesh>
      <RoundedBox args={[0.5, 0.5, 0.035]} radius={0.07} smoothness={3} position={[0, -0.24, 0.385]}>
        <meshStandardMaterial color="#f3dfb8" roughness={0.88} />
      </RoundedBox>
      <mesh position={[0, -0.23, 0.41]}>
        <circleGeometry args={[0.1, 24]} />
        <meshStandardMaterial color="#d97c60" roughness={0.8} />
      </mesh>
    </group>
  );
}

function DumplingBackdropModel({ kind }: { kind: DumplingBackdropKind }) {
  if (kind === "dumpling") return <DumplingModel />;
  if (kind === "chopsticks") return <ChopsticksModel />;
  return <SoySauceBottleModel />;
}

function InteractiveDumplingItem({
  kind,
  position,
  scale,
  phase,
  rotation = [0, 0, 0],
}: {
  kind: DumplingBackdropKind;
  position: [number, number, number];
  scale: number;
  phase: number;
  rotation?: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const hoverAmount = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    hoverAmount.current = THREE.MathUtils.damp(hoverAmount.current, hovered.current ? 1 : 0, 8, delta);
    const time = clock.elapsedTime + phase;
    const outward = Math.sign(position[0]) || 1;
    group.current.position.set(
      position[0] + Math.sin(time * 0.68) * 0.07 + hoverAmount.current * outward * 0.24,
      position[1] + Math.cos(time * 0.82) * 0.08 + hoverAmount.current * 0.2,
      position[2],
    );
    group.current.rotation.y = Math.sin(time * 0.5) * 0.14 + hoverAmount.current * outward * 0.22;
    group.current.rotation.z = Math.sin(time * 0.62) * 0.08 + hoverAmount.current * outward * 0.12;
    group.current.scale.setScalar(scale * (1 + hoverAmount.current * 0.11));
  });

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onPointerEnter={(event) => {
        event.stopPropagation();
        hovered.current = true;
      }}
      onPointerLeave={() => {
        hovered.current = false;
      }}
    >
      <group rotation={rotation}>
        <DumplingBackdropModel kind={kind} />
      </group>
    </group>
  );
}

function DumplingBackdropLayer() {
  const items: { kind: DumplingBackdropKind; position: [number, number, number]; scale: number; phase: number; rotation?: [number, number, number] }[] = [
    { kind: "dumpling", position: [-4.7, 2.35, -0.1], scale: 1.2, phase: 0.3, rotation: [0.08, -0.2, -0.08] },
    { kind: "chopsticks", position: [4.65, 1.95, -0.2], scale: 0.82, phase: 1.8, rotation: [0.06, -0.1, -0.68] },
    { kind: "soy", position: [-4.65, -2.05, 0], scale: 1.08, phase: 3.4, rotation: [0.02, 0.18, 0.04] },
    { kind: "dumpling", position: [4.72, -2.15, -0.1], scale: 1.08, phase: 4.9, rotation: [-0.02, 0.28, 0.1] },
  ];

  return (
    <div className="dumpling-backdrop-layer" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 11], fov: 43 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.6} />
        <directionalLight position={[-4, 7, 8]} intensity={2.25} />
        <pointLight position={[5, -1, 5]} intensity={0.6} color="#f7dcc2" />
        {items.map((item, index) => <InteractiveDumplingItem key={`${item.kind}-${index}`} {...item} />)}
      </Canvas>
    </div>
  );
}

type MatchaBackdropKind = "whisk" | "latte" | "milk";

function MatchaWhiskModel() {
  const bristles = useMemo(
    () => Array.from({ length: 28 }, (_, index) => {
      const angle = (index / 28) * Math.PI * 2;
      const variation = (index % 3) * 0.025;
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 0.2, -0.04, Math.sin(angle) * 0.2),
        new THREE.Vector3(Math.cos(angle) * (0.43 + variation), 0.54, Math.sin(angle) * (0.43 + variation)),
        new THREE.Vector3(Math.cos(angle) * (0.62 + variation), 1.08, Math.sin(angle) * (0.62 + variation)),
        new THREE.Vector3(Math.cos(angle) * (0.47 + variation), 1.27, Math.sin(angle) * (0.47 + variation)),
      ]);
    }),
    [],
  );

  return (
    <group>
      <mesh position={[0, -0.74, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.38, 1.36, 28]} />
        <meshStandardMaterial color="#d4a04d" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.31, 0.34, 24]} />
        <meshStandardMaterial color="#dbae5d" roughness={0.78} />
      </mesh>
      <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.31, 0.045, 10, 30]} />
        <meshStandardMaterial color="#bd843d" roughness={0.82} />
      </mesh>
      {bristles.map((curve, index) => (
        <mesh key={index} castShadow={index % 3 === 0}>
          <tubeGeometry args={[curve, 14, 0.018, 5, false]} />
          <meshStandardMaterial color={index % 2 ? "#dfb467" : "#d09a49"} roughness={0.86} />
        </mesh>
      ))}
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.22, 18]} />
        <meshStandardMaterial color="#c99042" roughness={0.86} />
      </mesh>
    </group>
  );
}

function MatchaLatteModel() {
  const heart = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.28);
    shape.bezierCurveTo(-0.5, 0.03, -0.44, 0.42, -0.18, 0.42);
    shape.bezierCurveTo(-0.06, 0.42, 0, 0.32, 0, 0.23);
    shape.bezierCurveTo(0, 0.32, 0.06, 0.42, 0.18, 0.42);
    shape.bezierCurveTo(0.44, 0.42, 0.5, 0.03, 0, -0.28);
    return shape;
  }, []);

  return (
    <group>
      <mesh position={[0, -0.34, 0]} castShadow>
        <cylinderGeometry args={[0.49, 0.43, 0.68, 32]} />
        <meshStandardMaterial color="#f2ecdb" roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.53, 0.48, 0.62, 32]} />
        <meshStandardMaterial color="#96b66f" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.59, 0]}>
        <cylinderGeometry args={[0.53, 0.53, 0.075, 32]} />
        <meshStandardMaterial color="#82a45f" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.57, 0.47, 1.35, 32, 1, true]} />
        <meshPhysicalMaterial color="#e9fbf4" transparent opacity={0.3} roughness={0.12} transmission={0.32} thickness={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.69, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.035, 10, 32]} />
        <meshStandardMaterial color="#e9f4ed" transparent opacity={0.72} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.64, 0.015]} rotation={[-Math.PI / 2, 0, -0.08]} scale={0.48}>
        <extrudeGeometry args={[heart, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.014, bevelSegments: 2 }]} />
        <meshStandardMaterial color="#fff8e9" roughness={0.72} />
      </mesh>
      <mesh position={[0.29, 1.02, -0.08]} rotation={[0.14, 0, -0.17]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.18, 10]} />
        <meshStandardMaterial color="#e2b6cf" roughness={0.72} />
      </mesh>
    </group>
  );
}

function MilkCartonLabel() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 220;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#5f7c55";
    context.font = '900 108px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
    context.fillText("MILK", 256, 116);
    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.anisotropy = 8;
    nextTexture.needsUpdate = true;
    setTexture(nextTexture);
    return () => nextTexture.dispose();
  }, []);

  if (!texture) return null;
  return (
    <mesh position={[0, -0.13, 0.405]}>
      <planeGeometry args={[0.62, 0.27]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function MilkCartonModel() {
  const carton = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.52, -0.76);
    shape.lineTo(0.52, -0.76);
    shape.lineTo(0.52, 0.38);
    shape.lineTo(0, 0.84);
    shape.lineTo(-0.52, 0.38);
    shape.closePath();
    return shape;
  }, []);

  return (
    <group>
      <mesh position={[0, 0, -0.34]} castShadow>
        <extrudeGeometry args={[carton, { depth: 0.68, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 3 }]} />
        <meshStandardMaterial color="#fff3dc" roughness={0.78} />
      </mesh>
      <RoundedBox args={[0.7, 0.62, 0.04]} radius={0.08} smoothness={3} position={[0, -0.13, 0.38]}>
        <meshStandardMaterial color="#dce9c8" roughness={0.82} />
      </RoundedBox>
      <MilkCartonLabel />
      <mesh position={[0.27, 0.54, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.08, 18]} />
        <meshStandardMaterial color="#99bb78" roughness={0.76} />
      </mesh>
    </group>
  );
}

function MatchaBackdropModel({ kind }: { kind: MatchaBackdropKind }) {
  if (kind === "whisk") return <MatchaWhiskModel />;
  if (kind === "latte") return <MatchaLatteModel />;
  return <MilkCartonModel />;
}

function InteractiveMatchaItem({
  kind,
  position,
  scale,
  phase,
  rotation = [0, 0, 0],
}: {
  kind: MatchaBackdropKind;
  position: [number, number, number];
  scale: number;
  phase: number;
  rotation?: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const hoverAmount = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    hoverAmount.current = THREE.MathUtils.damp(hoverAmount.current, hovered.current ? 1 : 0, 8, delta);
    const time = clock.elapsedTime + phase;
    const outward = Math.sign(position[0]) || 1;
    group.current.position.set(
      position[0] + Math.sin(time * 0.62) * 0.07 + hoverAmount.current * outward * 0.24,
      position[1] + Math.cos(time * 0.76) * 0.08 + hoverAmount.current * 0.2,
      position[2],
    );
    group.current.rotation.y = Math.sin(time * 0.46) * 0.13 + hoverAmount.current * outward * 0.2;
    group.current.rotation.z = Math.sin(time * 0.58) * 0.06 + hoverAmount.current * outward * 0.1;
    group.current.scale.setScalar(scale * (1 + hoverAmount.current * 0.1));
  });

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onPointerEnter={(event) => {
        event.stopPropagation();
        hovered.current = true;
      }}
      onPointerLeave={() => {
        hovered.current = false;
      }}
    >
      <group rotation={rotation}>
        <MatchaBackdropModel kind={kind} />
      </group>
    </group>
  );
}

function MatchaBackdropLayer() {
  const items: { kind: MatchaBackdropKind; position: [number, number, number]; scale: number; phase: number; rotation?: [number, number, number] }[] = [
    { kind: "whisk", position: [-4.65, 0.1, -0.2], scale: 1.28, phase: 0.4, rotation: [0.03, -0.16, -0.08] },
    { kind: "latte", position: [4.62, 1.45, -0.1], scale: 1.04, phase: 2.1, rotation: [0.02, -0.18, 0.05] },
    { kind: "milk", position: [4.55, -2.1, 0], scale: 1.0, phase: 4.2, rotation: [0.02, -0.22, -0.04] },
  ];

  return (
    <div className="matcha-backdrop-layer" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 11], fov: 43 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.65} />
        <directionalLight position={[-4, 7, 8]} intensity={2.3} />
        <pointLight position={[5, -1, 5]} intensity={0.7} color="#f5e7c4" />
        {items.map((item) => <InteractiveMatchaItem key={item.kind} {...item} />)}
      </Canvas>
    </div>
  );
}

function Basket({ basketX }: { basketX: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ pointer }, delta) => {
    if (!group.current) return;
    const targetX = pointer.x * 4.35;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 10, delta);
    basketX.current = group.current.position.x;
  });

  return (
    <group ref={group} position={[0, -3.15, 0]}>
      <mesh position={[0, 0.34, -0.18]} rotation={[0, 0, 0]} scale={[1, 1.08, 0.8]} castShadow>
        <torusGeometry args={[0.58, 0.045, 10, 32, Math.PI]} />
        <meshStandardMaterial color="#a96f45" roughness={0.82} />
      </mesh>
      <RoundedBox args={[1.65, 0.58, 0.72]} radius={0.16} smoothness={4} castShadow>
        <meshStandardMaterial color="#c78b55" roughness={0.84} />
      </RoundedBox>
      <RoundedBox args={[1.76, 0.16, 0.78]} radius={0.07} smoothness={3} position={[0, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#a96f45" roughness={0.82} />
      </RoundedBox>
      {[-0.52, 0, 0.52].map((x) => (
        <mesh key={x} position={[x, -0.03, 0.37]}>
          <boxGeometry args={[0.055, 0.43, 0.025]} />
          <meshStandardMaterial color="#efd0a0" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function FallingFruit({
  item,
  playing,
  basketX,
  onCatch,
  onMiss,
}: {
  item: FallingFruitData;
  playing: boolean;
  basketX: React.MutableRefObject<number>;
  onCatch: (id: number) => void;
  onMiss: (id: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const resolved = useRef(false);

  useFrame(({ clock }, delta) => {
    if (!group.current || !playing || resolved.current) return;
    group.current.position.y -= item.speed * delta;
    group.current.position.x = item.x + Math.sin(clock.elapsedTime * 1.3 + item.phase) * 0.12;
    group.current.rotation.x += delta * 0.65;
    group.current.rotation.z += delta * 0.9;

    if (group.current.position.y < -2.72 && group.current.position.y > -3.55 && Math.abs(group.current.position.x - basketX.current) < 0.9) {
      resolved.current = true;
      onCatch(item.id);
    } else if (group.current.position.y < -3.72) {
      resolved.current = true;
      onMiss(item.id);
    }
  });

  return (
    <group ref={group} position={[item.x, 4.55, 0]} scale={0.62}>
      <FruitModel kind={item.kind} />
    </group>
  );
}

function FruitGameScene({
  playing,
  onCatch,
  onMiss,
}: {
  playing: boolean;
  onCatch: () => void;
  onMiss: () => void;
}) {
  const basketX = useRef(0);
  const [fruits, setFruits] = useState<FallingFruitData[]>([]);
  const startTime = useRef<number | null>(null);
  const lastSpawn = useRef(-1.2);
  const nextId = useRef(1);

  useFrame(({ clock }) => {
    if (!playing) return;
    if (startTime.current === null) startTime.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - startTime.current;
    const interval = Math.max(0.48, 1.58 - elapsed * 0.019);
    if (elapsed - lastSpawn.current < interval) return;
    lastSpawn.current = elapsed;
    const id = nextId.current++;
    setFruits((current) => [
      ...current,
      {
        id,
        kind: FRUIT_KINDS[Math.floor(Math.random() * FRUIT_KINDS.length)],
        x: THREE.MathUtils.randFloat(-4.05, 4.05),
        speed: Math.min(3.2, 0.86 + elapsed * 0.032 + Math.random() * 0.22),
        phase: Math.random() * Math.PI * 2,
      },
    ]);
  });

  const caught = useCallback((id: number) => {
    setFruits((current) => current.filter((fruit) => fruit.id !== id));
    onCatch();
  }, [onCatch]);

  const missed = useCallback((id: number) => {
    setFruits((current) => current.filter((fruit) => fruit.id !== id));
    onMiss();
  }, [onMiss]);

  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight position={[-4, 7, 8]} intensity={2.3} castShadow />
      <pointLight position={[5, 1, 5]} intensity={0.8} color="#f5d8b3" />
      <Basket basketX={basketX} />
      {fruits.map((item) => (
        <FallingFruit key={item.id} item={item} playing={playing} basketX={basketX} onCatch={caught} onMiss={missed} />
      ))}
    </>
  );
}

function FruitMiniGame({ onClose, audioContext }: { onClose: () => void; audioContext: AudioContext | null }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState<"playing" | "gameover">("playing");

  useEffect(() => {
    if (lives === 0) setStatus("gameover");
  }, [lives]);

  const playCatchBoop = useCallback(() => {
    if (!audioContext) return;

    const play = () => {
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(690, now);
      oscillator.frequency.exponentialRampToValueAtTime(470, now + 0.13);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.115, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    };

    if (audioContext.state === "suspended") void audioContext.resume().then(play);
    else play();
  }, [audioContext]);

  const handleCatch = useCallback(() => {
    playCatchBoop();
    setScore((current) => current + 1);
  }, [playCatchBoop]);
  const handleMiss = useCallback(() => setLives((current) => Math.max(0, current - 1)), []);
  const restart = () => {
    setScore(0);
    setLives(3);
    setStatus("playing");
    setRound((current) => current + 1);
  };

  return (
    <div className="fruit-game-overlay" role="dialog" aria-modal="true" aria-label="Catch the falling fruit game">
      <Canvas className="fruit-game-canvas" shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 11], fov: 44 }}>
        <color attach="background" args={["#badfed"]} />
        <fog attach="fog" args={["#badfed", 10, 20]} />
        <FruitGameScene key={round} playing={status === "playing"} onCatch={handleCatch} onMiss={handleMiss} />
      </Canvas>

      <button className="game-close-button" type="button" onClick={onClose} aria-label="Close fruit game">×</button>
      <div className="fruit-game-hud">
        <div className="game-score" aria-live="polite"><span>score</span><strong>{score}</strong></div>
        <div className="game-heading"><small>Emma’s fruit cart presents</small><strong>Catch the fruit!</strong></div>
        <div className="game-lives" aria-label={`${lives} lives remaining`}>
          <span>lives</span>
          <div>{[0, 1, 2].map((index) => <b key={index} className={index < lives ? "is-full" : ""}>♥</b>)}</div>
        </div>
      </div>

      {status === "gameover" && (
        <div className="game-over-card">
          <span>fruit basket closed!</span>
          <h2>Game over</h2>
          <p>You caught <strong>{score}</strong> {score === 1 ? "fruit" : "fruits"}.</p>
          <div><button type="button" onClick={restart}>play again</button><button type="button" onClick={onClose}>back to the plaza</button></div>
        </div>
      )}

      {status === "playing" && <div className="game-instructions">Move your cursor to guide the basket · Miss three fruits and the game ends</div>}
    </div>
  );
}

type MatchaGameStatus = "playing" | "won" | "lost";

function MatchaWhiskScene({ whiskTrigger, status }: { whiskTrigger: number; status: MatchaGameStatus }) {
  const whisk = useRef<THREE.Group>(null);
  const whiskActive = useRef(false);
  const whiskProgress = useRef(0);
  const ripples = useRef<THREE.Group>(null);
  const sparklePositions = useMemo(
    () => [
      [-0.85, 1.05, 0], [0.8, 1.45, 0.1], [-1.15, 0.15, 0], [1.2, 0.35, 0],
      [-0.55, 2.0, -0.1], [0.35, 2.25, 0], [1.65, 1.7, -0.2], [-1.65, 1.5, 0],
    ] as [number, number, number][],
    [],
  );

  useEffect(() => {
    if (whiskTrigger <= 0) return;
    whiskProgress.current = 0;
    whiskActive.current = true;
  }, [whiskTrigger]);

  useFrame(({ clock }, delta) => {
    if (whisk.current) {
      if (whiskActive.current) {
        whiskProgress.current = Math.min(1, whiskProgress.current + delta * 2.35);
        const swing = Math.sin(whiskProgress.current * Math.PI * 2);
        whisk.current.position.x = swing * 0.5;
        whisk.current.position.y = 0.28 + Math.abs(swing) * 0.055;
        whisk.current.rotation.z = Math.PI + swing * 0.16;
        if (whiskProgress.current >= 1) whiskActive.current = false;
      } else {
        whisk.current.position.x = THREE.MathUtils.damp(whisk.current.position.x, 0, 7, delta);
        whisk.current.position.y = THREE.MathUtils.damp(whisk.current.position.y, 0.28, 7, delta);
        whisk.current.rotation.z = THREE.MathUtils.damp(whisk.current.rotation.z, Math.PI, 7, delta);
      }
    }
    if (ripples.current) {
      const pulse = whiskActive.current ? 1 + Math.sin(clock.elapsedTime * 17) * 0.045 : 1;
      ripples.current.scale.setScalar(pulse);
      ripples.current.rotation.y += delta * (whiskActive.current ? 0.9 : 0.15);
    }
  });

  return (
    <>
      <ambientLight intensity={1.65} />
      <directionalLight position={[-4, 7, 8]} intensity={2.35} castShadow />
      <pointLight position={[4, 2, 4]} intensity={0.7} color="#fff0cf" />

      <mesh position={[0, -2.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7, 64]} />
        <meshStandardMaterial color="#e7d8b5" roughness={0.93} />
      </mesh>

      <group position={[-0.65, 0, 0]}>
        <mesh position={[0, -1.1, 0]} scale={[1.45, 0.72, 1.45]} castShadow>
          <sphereGeometry args={[1, 36, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#f1e7c8" roughness={0.84} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -1.06, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[1.38, 0.095, 12, 42]} />
          <meshStandardMaterial color="#d3c393" roughness={0.84} />
        </mesh>
        <mesh position={[0, -1.08, 0]}>
          <cylinderGeometry args={[1.24, 1.24, 0.075, 42]} />
          <meshStandardMaterial color="#7fa45d" roughness={0.68} />
        </mesh>
        <group ref={ripples} position={[0, -1.025, 0]}>
          {[0.38, 0.72, 1.02].map((radius, index) => (
            <mesh key={radius} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.016, 7, 30]} />
              <meshBasicMaterial color={index % 2 ? "#dce7c8" : "#f3efd8"} transparent opacity={0.55 - index * 0.1} />
            </mesh>
          ))}
        </group>

        <group ref={whisk} position={[0, 0.28, 0]} rotation={[0, 0, Math.PI]} scale={0.82}>
          <MatchaWhiskModel />
        </group>
      </group>

      {status === "won" && (
        <Float speed={2.1} floatIntensity={0.22} rotationIntensity={0.08}>
          <group position={[2.2, -0.25, 0]} scale={1.18}>
            <MatchaLatteModel />
            {sparklePositions.map((position, index) => (
              <mesh key={index} position={position} scale={index % 2 ? 0.09 : 0.13}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={index % 2 ? "#fff2b8" : "#f7d5e4"} emissive={index % 2 ? "#fff2b8" : "#f7d5e4"} emissiveIntensity={0.35} />
              </mesh>
            ))}
          </group>
        </Float>
      )}

      <ContactShadows position={[0, -1.98, 0]} opacity={0.24} scale={11} blur={2.7} far={7} />
    </>
  );
}

function MatchaWhiskGame({ onClose }: { onClose: () => void }) {
  const markerElement = useRef<HTMLSpanElement>(null);
  const markerPosition = useRef(10);
  const markerDirection = useRef(1);
  const markerSpeed = useRef(39);
  const inputLocked = useRef(false);
  const feedbackTimer = useRef<number | null>(null);
  const [lives, setLives] = useState(3);
  const [whisks, setWhisks] = useState(0);
  const [whiskTrigger, setWhiskTrigger] = useState(0);
  const [status, setStatus] = useState<MatchaGameStatus>("playing");
  const [feedback, setFeedback] = useState<{ kind: "good" | "bad"; text: string } | null>(null);

  const resetMarker = useCallback(() => {
    const fromLeft = Math.random() > 0.5;
    markerPosition.current = fromLeft ? 8 : 92;
    markerDirection.current = fromLeft ? 1 : -1;
    if (markerElement.current) markerElement.current.style.left = `${markerPosition.current}%`;
  }, []);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (status === "playing" && !inputLocked.current) {
        let next = markerPosition.current + markerDirection.current * markerSpeed.current * delta;
        if (next >= 98) {
          next = 98;
          markerDirection.current = -1;
        } else if (next <= 2) {
          next = 2;
          markerDirection.current = 1;
        }
        markerPosition.current = next;
        if (markerElement.current) markerElement.current.style.left = `${next}%`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status]);

  useEffect(() => () => {
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
  }, []);

  const finishRound = useCallback((nextStatus?: MatchaGameStatus) => {
    if (nextStatus) {
      setStatus(nextStatus);
      return;
    }
    resetMarker();
    setFeedback(null);
    inputLocked.current = false;
  }, [resetMarker]);

  const attemptWhisk = useCallback(() => {
    if (status !== "playing" || inputLocked.current) return;
    inputLocked.current = true;
    markerSpeed.current = Math.min(98, markerSpeed.current + 5.5);
    const hitGreen = markerPosition.current >= 34 && markerPosition.current <= 66;

    if (hitGreen) {
      const nextWhisks = whisks + 1;
      setWhisks(nextWhisks);
      setWhiskTrigger((current) => current + 1);
      setFeedback({ kind: "good", text: nextWhisks === 10 ? "latte complete!" : "perfect whisk!" });
      feedbackTimer.current = window.setTimeout(() => finishRound(nextWhisks >= 10 ? "won" : undefined), 720);
    } else {
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      setWhisks(0);
      setFeedback({ kind: "bad", text: "red zone — streak reset!" });
      feedbackTimer.current = window.setTimeout(() => finishRound(nextLives <= 0 ? "lost" : undefined), 620);
    }
  }, [finishRound, lives, status, whisks]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === " " || event.key === "Enter") && status === "playing") {
        event.preventDefault();
        attemptWhisk();
      }
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [attemptWhisk, status]);

  const restart = () => {
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
    setLives(3);
    setWhisks(0);
    setFeedback(null);
    setStatus("playing");
    setWhiskTrigger(0);
    markerSpeed.current = 39;
    inputLocked.current = false;
    resetMarker();
  };

  return (
    <div className="matcha-game-overlay" role="dialog" aria-modal="true" aria-label="Matcha whisking timing game">
      <Canvas className="matcha-game-canvas" shadows dpr={[1, 1.5]} camera={{ position: [0, 0.4, 8.7], fov: 44 }}>
        <color attach="background" args={["#c8dfbd"]} />
        <fog attach="fog" args={["#c8dfbd", 9, 18]} />
        <MatchaWhiskScene whiskTrigger={whiskTrigger} status={status} />
      </Canvas>

      <button className="game-close-button" type="button" onClick={onClose} aria-label="Close matcha game">×</button>

      <div className="matcha-game-hud">
        <div className="matcha-game-title"><small>Emma’s matcha cart presents</small><strong>Whisk it!</strong></div>
        <div className="matcha-whisk-progress" aria-label={`${whisks} of 10 successful whisks`}>
          <span>streak</span>
          <div>{Array.from({ length: 10 }, (_, index) => <b key={index} className={index < whisks ? "is-filled" : ""} />)}</div>
          <strong>{whisks}/10</strong>
        </div>
        <div className="matcha-game-lives" aria-label={`${lives} lives remaining`}>
          <span>lives</span><div>{[0, 1, 2].map((index) => <b key={index} className={index < lives ? "is-full" : ""}>♥</b>)}</div>
        </div>
      </div>

      {status === "playing" && (
        <div className="matcha-timing-panel">
          <div className="matcha-meter-labels"><span>too early</span><strong>perfect</strong><span>too late</span></div>
          <div className="matcha-meter-track" aria-label="Timing meter with red edges and green center">
            <span ref={markerElement} className="matcha-meter-marker" style={{ left: "10%" }} />
          </div>
          <div className={`matcha-feedback ${feedback ? `is-${feedback.kind}` : ""}`} aria-live="polite">
            {feedback?.text ?? "Press when the white marker reaches green"}
          </div>
          <button className="matcha-whisk-button" type="button" onClick={attemptWhisk} disabled={inputLocked.current}>
            whisk! <small>click · tap · space</small>
          </button>
          <p>Land 10 green-zone whisks in a row. A red hit costs one life and resets your streak.</p>
        </div>
      )}

      {status !== "playing" && (
        <div className={`matcha-result-card result-${status}`}>
          <span>{status === "won" ? "perfectly whisked!" : "the café is closing…"}</span>
          <h2>{status === "won" ? "Matcha latte complete!" : "Game over"}</h2>
          <p>{status === "won" ? "You made a smooth, frothy matcha latte with ten perfect whisks." : "The matcha needs another try. Keep your eye on the green zone!"}</p>
          <div><button type="button" onClick={restart}>play again</button><button type="button" onClick={onClose}>exit game</button></div>
        </div>
      )}
    </div>
  );
}

function InfoPanel({ section, onClose, onStartMatchaGame }: { section: SectionId; onClose: () => void; onStartMatchaGame: () => void }) {
  const content = sectionContent[section];
  const foodEmoji = section === "about" ? "◌" : section === "experience" ? "✦" : "⌁";

  return (
    <div className="panel-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      {section === "about" && <DumplingBackdropLayer />}
      {section === "experience" && <FruitBackdropLayer />}
      {section === "contact" && <MatchaBackdropLayer />}
      <section className={`info-panel panel-${section}`} role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <div className="panel-tape" />
        <button className="close-button" onClick={onClose} aria-label="Close menu">
          ×
        </button>
        {section === "contact" && <button className="play-game-button" type="button" onClick={onStartMatchaGame}>want a matcha?</button>}
        <div className="panel-content-frame">
        <div className="panel-heading">
          <span className="panel-stamp" aria-hidden="true">{foodEmoji}</span>
          <div>
            <p>{content.eyebrow}</p>
            <h2 id="panel-title">{content.title}</h2>
          </div>
        </div>
        <p className="panel-intro">{content.intro}</p>

        {section === "about" && (
          <div className="about-grid">
            <div className="mini-card portrait-card">
              <img src="/emma-headshot.png" alt="Portrait of Emma Wu at UCLA" />
              <small>Emma Wu · UCLA</small>
            </div>
            <div className="about-notes">
              <section>
                <h3>Currently into</h3>
                <ul>
                  <li>Playing basketball</li>
                  <li>Exploring new restaurants</li>
                  <li>Lifting</li>
                </ul>
              </section>

              <section className="school-involvements">
                <h3>School involvements</h3>
                <div className="involvement-links">
                  <a href="https://datascienceunion.com/" target="_blank" rel="noreferrer">
                    <strong>UCLA Data Science Union</strong><span>Visit organization ↗</span>
                  </a>
                  <a href="https://statisticsucla.com/" target="_blank" rel="noreferrer">
                    <strong>UCLA Statistics Club</strong><span>Marketing Chair · Visit organization ↗</span>
                  </a>
                </div>
              </section>

              <div className="fun-fact"><span>Fun fact</span><strong>Terrible with spicy food</strong></div>
            </div>
          </div>
        )}

        {section === "experience" && (
          <div className="experience-content">
            <div className="timeline">
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-meta" /></span>
                <div>
                  <small>Jun 2026–Present · Menlo Park, CA</small>
                  <h3>Meta</h3>
                  <p><strong>Data Engineer Intern</strong><br />Central Product · Experimentation Platform</p>
                </div>
              </article>
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-kohls" /></span>
                <div>
                  <small>Oct 2025–Mar 2026 · Remote</small>
                  <h3>Kohl’s Corporate</h3>
                  <p><strong>Data Scientist</strong><br />Contract through UCLA Data Science Union</p>
                </div>
              </article>
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-sentry" /></span>
                <div>
                  <small>Jun–Sep 2025 · San Francisco, CA</small>
                  <h3>Sentry (Sentry.io)</h3>
                  <p><strong>Business Intelligence Intern</strong></p>
                  <a
                    className="experience-link"
                    href="https://blog.sentry.io/meet-sentrys-2025-summer-interns/"
                    target="_blank"
                    rel="noreferrer"
                  >Meet Sentry’s 2025 summer interns ↗</a>
                </div>
              </article>
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-break-through" /></span>
                <div>
                  <small>Mar 2024–Apr 2025 · Los Angeles, CA</small>
                  <h3>Break Through Tech AI</h3>
                  <p><strong>Fellow</strong><br />UCLA · Cornell Tech</p>
                </div>
              </article>
            </div>

            <section className="experience-toolkit" aria-labelledby="toolkit-title">
              <h3 id="toolkit-title">Technical toolkit</h3>
              <div className="skill-group">
                <strong>Programming languages</strong>
                <div className="skill-chips"><span>Python</span><span>R</span><span>SQL</span><span>LookML</span><span>C++</span></div>
              </div>
              <div className="skill-group">
                <strong>Tools &amp; libraries</strong>
                <div className="skill-chips"><span>Git</span><span>BigQuery</span><span>Google Cloud Platform</span><span>AI tooling</span><span>Apache Hive</span><span>Jupyter</span><span>Looker</span><span>NumPy</span><span>Pandas</span></div>
              </div>
              <div className="skill-group">
                <strong>Concepts</strong>
                <div className="skill-chips"><span>Data Science</span><span>Data Visualization</span><span>Machine Learning</span><span>Business Intelligence</span><span>ETL/ELT</span><span>Semantic Modeling</span></div>
              </div>
            </section>

            <section className="experience-awards" aria-labelledby="awards-title">
              <h3 id="awards-title">Awards</h3>
              <ul>
                <li>UCLA ASA DataFest 2025 Finalist</li>
                <li>LA Hacks 2024 Sponsor Track — 1st Place</li>
                <li>UCLA ACM HOTH XI — 1st Place</li>
              </ul>
            </section>
          </div>
        )}

        {section === "contact" && (
          <div className="contact-card">
            <a href="mailto:emmawu@ucla.edu"><span>email</span>emmawu@ucla.edu</a>
            <div><span>citizenship</span>U.S. Citizen</div>
            <div className="contact-links">
              <a className="linkedin-button" href="https://www.linkedin.com/in/emmawu155" target="_blank" rel="noreferrer">
                <span className="linkedin-mark" aria-hidden="true">in</span>
                <strong>LinkedIn</strong>
                <small aria-hidden="true">↗</small>
              </a>
            </div>
          </div>
        )}

        <div className="panel-footer"><span>made with care</span><span>Emma’s plaza · 2026</span></div>
        </div>
      </section>
    </div>
  );
}

function MobileJoystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const base = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });

  const reset = useCallback(() => {
    activePointer.current = null;
    setKnobOffset({ x: 0, y: 0 });
    onMove(0, 0);
  }, [onMove]);

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!base.current) return;
    const bounds = base.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const maxTravel = bounds.width * 0.3;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);
    const clampScale = distance > maxTravel ? maxTravel / distance : 1;
    const offsetX = deltaX * clampScale;
    const offsetY = deltaY * clampScale;
    const rawX = offsetX / maxTravel;
    const rawY = -offsetY / maxTravel;
    const magnitude = Math.hypot(rawX, rawY);
    const deadZone = 0.12;

    setKnobOffset({ x: offsetX, y: offsetY });
    if (magnitude <= deadZone) {
      onMove(0, 0);
      return;
    }

    const adjustedMagnitude = Math.min(1, (magnitude - deadZone) / (1 - deadZone));
    onMove((rawX / magnitude) * adjustedMagnitude, (rawY / magnitude) * adjustedMagnitude);
  }, [onMove]);

  useEffect(() => () => onMove(0, 0), [onMove]);

  return (
    <div
      ref={base}
      className="mobile-joystick"
      role="group"
      aria-label="Movement joystick. Drag in any direction to walk."
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        activePointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        updateFromPointer(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (activePointer.current !== event.pointerId) return;
        event.preventDefault();
        event.stopPropagation();
        updateFromPointer(event.clientX, event.clientY);
      }}
      onPointerUp={(event) => {
        if (activePointer.current !== event.pointerId) return;
        event.preventDefault();
        event.stopPropagation();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        reset();
      }}
      onPointerCancel={reset}
    >
      <div className="joystick-orbit" aria-hidden="true" />
      <div
        className="joystick-knob"
        aria-hidden="true"
        style={{ transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)` }}
      >
        <span>✦</span>
      </div>
    </div>
  );
}

function MobileLookSurface({ onLook }: { onLook: (deltaX: number, deltaY: number) => void }) {
  const activePointer = useRef<number | null>(null);
  const lastPosition = useRef({ x: 0, y: 0 });

  const finishLook = useCallback((pointerId?: number) => {
    if (pointerId !== undefined && activePointer.current !== pointerId) return;
    activePointer.current = null;
  }, []);

  return (
    <div
      className="mobile-look-surface"
      aria-hidden="true"
      onPointerDown={(event) => {
        if (activePointer.current !== null) return;
        event.preventDefault();
        event.stopPropagation();
        activePointer.current = event.pointerId;
        lastPosition.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (activePointer.current !== event.pointerId) return;
        event.preventDefault();
        event.stopPropagation();
        const deltaX = THREE.MathUtils.clamp(event.clientX - lastPosition.current.x, -28, 28);
        const deltaY = THREE.MathUtils.clamp(event.clientY - lastPosition.current.y, -28, 28);
        lastPosition.current = { x: event.clientX, y: event.clientY };
        onLook(deltaX, deltaY);
      }}
      onPointerUp={(event) => {
        if (activePointer.current !== event.pointerId) return;
        event.preventDefault();
        event.stopPropagation();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        finishLook(event.pointerId);
      }}
      onPointerCancel={(event) => finishLook(event.pointerId)}
    />
  );
}

export default function Home() {
  const controls = useRef<ControlState>({ ...EMPTY_CONTROLS });
  const joystick = useRef<JoystickVector>({ x: 0, y: 0 });
  const mobileLook = useRef<CameraLookDelta>({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const gameAudioRef = useRef<AudioContext | null>(null);
  const [nearSection, setNearSection] = useState<SectionId | null>(null);
  const [nearGameBasket, setNearGameBasket] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [hintAvailable, setHintAvailable] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [gameOpen, setGameOpen] = useState(false);
  const [matchaGameOpen, setMatchaGameOpen] = useState(false);

  const openSection = useCallback((id: SectionId) => setActiveSection(id), []);
  const startGame = useCallback(() => {
    if (!gameAudioRef.current) gameAudioRef.current = new AudioContext();
    void gameAudioRef.current.resume();
    controls.current = { ...EMPTY_CONTROLS };
    joystick.current = { x: 0, y: 0 };
    setShowIntro(false);
    setGameOpen(true);
  }, []);
  const setJoystick = useCallback((x: number, y: number) => {
    joystick.current.x = x;
    joystick.current.y = y;
  }, []);
  const updateMobileLook = useCallback((deltaX: number, deltaY: number) => {
    mobileLook.current.x = THREE.MathUtils.clamp(mobileLook.current.x + deltaX, -48, 48);
    mobileLook.current.y = THREE.MathUtils.clamp(mobileLook.current.y + deltaY, -48, 48);
  }, []);
  const collapseIntro = useCallback(() => {
    setShowIntro(false);
    setHintAvailable(true);
  }, []);

  useEffect(() => {
    const getMovementDirection = (key: string) => MOVEMENT_KEYS[key] ?? MOVEMENT_KEYS[key.toLowerCase()];
    const keyDown = (event: KeyboardEvent) => {
      const direction = getMovementDirection(event.key);
      if (direction) {
        event.preventDefault();
        controls.current[direction] = true;
      }
      if ((event.key === "Enter" || event.key === " ") && nearGameBasket && !activeSection && !gameOpen) {
        event.preventDefault();
        startGame();
      } else if ((event.key === "Enter" || event.key === " ") && nearSection && !activeSection && !gameOpen) {
        event.preventDefault();
        openSection(nearSection);
      }
      if (event.key === "Escape") {
        if (matchaGameOpen) setMatchaGameOpen(false);
        else if (gameOpen) setGameOpen(false);
        else if (activeSection) setActiveSection(null);
      }
    };
    const keyUp = (event: KeyboardEvent) => {
      const direction = getMovementDirection(event.key);
      if (direction) controls.current[direction] = false;
    };
    window.addEventListener("keydown", keyDown, { passive: false });
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [activeSection, gameOpen, matchaGameOpen, nearGameBasket, nearSection, openSection, startGame]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.16;

    if (!musicEnabled) {
      audio.pause();
      return;
    }

    const startMusic = () => {
      void audio.play().catch(() => {
        // Browsers may wait for a gesture; the listeners below retry unobtrusively.
      });
    };

    startMusic();
    window.addEventListener("pointerdown", startMusic, { once: true });
    window.addEventListener("keydown", startMusic, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
    };
  }, [musicEnabled]);

  const toggleMusic = useCallback(() => {
    setMusicEnabled((enabled) => {
      const next = !enabled;
      if (next) void audioRef.current?.play().catch(() => undefined);
      else audioRef.current?.pause();
      return next;
    });
  }, []);

  const nearStall = STALLS.find((stall) => stall.id === nearSection);

  return (
    <main className="game-shell">
      <audio ref={audioRef} src="/lofi-plaza.wav" loop preload="auto" aria-hidden="true" />

      <div className={`loading-screen ${loaded ? "is-hidden" : ""}`} aria-hidden={loaded}>
        <div className="loading-mochi">•　•</div>
        <p>sweeping the plaza…</p>
      </div>

      <Canvas
        className="world-canvas"
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [7.6, 10.4, 16.9], fov: 42, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <World
            controls={controls}
            joystick={joystick}
            mobileLook={mobileLook}
            activeSection={activeSection}
            gameOpen={gameOpen || matchaGameOpen}
            nearSection={nearSection}
            nearGameBasket={nearGameBasket}
            onNearChange={setNearSection}
            onNearGameChange={setNearGameBasket}
            onMove={collapseIntro}
            onOpen={openSection}
            onStartGame={startGame}
          />
        </Suspense>
      </Canvas>

      {!activeSection && !gameOpen && !matchaGameOpen && <MobileLookSurface onLook={updateMobileLook} />}

      <div className="top-left-badge"><span>✿</span> Emma’s little plaza</div>
      <button
        className={`music-toggle ${musicEnabled ? "is-on" : ""}`}
        type="button"
        aria-label={musicEnabled ? "Mute background music" : "Play background music"}
        aria-pressed={musicEnabled}
        onClick={toggleMusic}
      >
        <span aria-hidden="true">♫</span>
        {musicEnabled ? "music on" : "music off"}
      </button>

      {showIntro && !activeSection && !gameOpen && !matchaGameOpen && (
        <aside className="intro-card">
          <button onClick={collapseIntro} aria-label="Collapse navigation instructions">×</button>
          <span className="intro-icon">⌁</span>
          <div><strong>Welcome, friend!</strong><p>Drag anywhere to look around, then use WASD, the arrow keys, or the joystick (mobile only) to walk. Visit a cart—or find the little fruit basket to play!</p></div>
        </aside>
      )}

      {hintAvailable && !showIntro && !activeSection && !gameOpen && !matchaGameOpen && (
        <button
          className="intro-hint-button"
          type="button"
          aria-label="Open navigation instructions"
          onClick={() => setShowIntro(true)}
        >
          !
        </button>
      )}

      <div className="stall-key" aria-label="Plaza destinations">
        {STALLS.map((stall) => (
          <div key={stall.id} className={nearSection === stall.id ? "is-near" : ""}>
            <span style={{ background: stall.color }} />{stall.label.toLowerCase()}
          </div>
        ))}
      </div>

      {nearGameBasket && !activeSection && !gameOpen && (
        <button className="action-prompt game-action-prompt" onClick={startGame}>
          <span>♪</span><div><small>You found the fruit basket!</small>Play catch the fruit</div>
        </button>
      )}

      {nearStall && !nearGameBasket && !activeSection && !gameOpen && (
        <button className="action-prompt" onClick={() => openSection(nearStall.id)}>
          <span>↵</span><div><small>You found a cart!</small>Open {nearStall.label.toLowerCase()}</div>
        </button>
      )}

      {!activeSection && !gameOpen && !matchaGameOpen && <MobileJoystick onMove={setJoystick} />}

      <div className="navigation-blurb navigation-desktop"><span>WASD</span><strong>Use WASD or arrow keys</strong><small>Drag to look around · Enter to open</small></div>
      <div className="navigation-blurb navigation-mobile"><span>MOVE</span><strong>Drag the joystick to walk</strong><small>Drag elsewhere to look around</small></div>

      {activeSection && (
        <InfoPanel
          section={activeSection}
          onClose={() => {
            setGameOpen(false);
            setMatchaGameOpen(false);
            setActiveSection(null);
          }}
          onStartMatchaGame={() => setMatchaGameOpen(true)}
        />
      )}
      {gameOpen && <FruitMiniGame onClose={() => setGameOpen(false)} audioContext={gameAudioRef.current} />}
      {matchaGameOpen && <MatchaWhiskGame onClose={() => setMatchaGameOpen(false)} />}
    </main>
  );
}
