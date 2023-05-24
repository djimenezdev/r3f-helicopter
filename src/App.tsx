import { OrbitControls, PerspectiveCamera, Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, folder, useControls } from "leva";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Helicopter from "./Helicopter";
import { Land } from "./Land";
import { ReactComponent as Moon } from "./assets/moon.svg";
import { ReactComponent as Sun } from "./assets/sun.svg";

function App() {
  const [hidden, setHidden] = useState(true);
  const [mode, setMode] = useState<"dark" | "light">("light");
  const { cPosX, cPosY, cPosZ, cRotX, cRotY, cRotZ } = useControls("Debug", {
    camera: folder({
      cPosX: {
        value: 5,
        min: -10,
        max: 100,
        step: 0.1,
      },
      cPosY: {
        value: 0.4,
        min: -10,
        max: 100,
        step: 0.1,
      },
      cPosZ: {
        value: 38.1,
        min: -10,
        max: 100,
        step: 0.1,
      },
      cRotX: {
        value: 0.2,
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
      },
      cRotY: {
        value: 0,
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
      },
      cRotZ: {
        value: 0,
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
      },
    }),
    plane: folder({
      planeRotation: {
        rotationX: -Math.PI * 0.5,
        rotationY: 0,
        rotationZ: 0,
      },
    }),
  });
  useEffect(() => {
    const urlQueries = new URLSearchParams(window.location.search);
    const debugQuery = urlQueries.get("debug");
    if (typeof debugQuery === "string" && debugQuery === "1") {
      setHidden(false);
    }
  }, []);

  return (
    <AppContainer>
      <MiniMenu>
        {mode === "light" ? (
          <MoonIcon mode={mode} onClick={() => setMode("dark")} />
        ) : (
          <SunIcon mode={mode} onClick={() => setMode("light")} />
        )}
      </MiniMenu>
      <Canvas dpr={[1, 1.5]}>
        <OrbitControls />
        {mode === "light" ? (
          <color attach={"background"} args={["#87CEEB"]} />
        ) : (
          <color attach={"background"} args={["#002"]} />
        )}
        {mode === "light" ? (
          <>
            <ambientLight intensity={0.1} />
            <directionalLight position={[5, 10, 0]} intensity={0.4} />
          </>
        ) : null}
        <PerspectiveCamera
          position={[cPosX, cPosY, cPosZ]}
          rotation={[cRotX, cRotY, cRotZ]}
          makeDefault
        />
        <Plane args={[100, 100]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <meshStandardMaterial attach="material" color="#85E749" />
        </Plane>
        <Land />
        <Helicopter rotation={[0, Math.PI / 2, 0]} mode={mode} />
      </Canvas>
      <Leva hidden={hidden} />
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
`;

const MiniMenu = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
  z-index: 100;
`;

const MoonIcon = styled(Moon)`
  width: 25px;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
  fill: ${({ mode }) => (mode === "light" ? "#000" : "#fdd835")};
  &:hover {
    transform: scale(1.2);
    fill: #fff;
  }
`;

const SunIcon = styled(Sun)`
  width: 30px;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
  fill: ${({ mode }) => (mode === "light" ? "#000" : "#fdd835")};
  &:hover {
    transform: scale(1.2);
    fill: #fff;
  }
`;
