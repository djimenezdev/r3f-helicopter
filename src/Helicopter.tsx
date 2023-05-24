import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useRef, useState } from "react";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Object_6: THREE.Mesh;
    Object_8: THREE.Mesh;
    Object_4: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

type HelicopterProps = {
  mode: "light" | "dark";
};

const Helicopter = (props: JSX.IntrinsicElements["mesh"] & HelicopterProps) => {
  const largePropellerRef = useRef<THREE.Mesh>(null);
  const smallPropellerRef = useRef<THREE.Mesh>(null);
  const helicopterRef = useRef<THREE.Mesh>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  const { heliPosX, heliPosY, heliPosZ, intensity, distance, angle } =
    useControls({
      helicopter: folder({
        heliPosX: {
          value: -40,
          min: -innerWidth / 2,
          max: innerWidth / 2,
          step: 0.1,
        },
        heliPosY: {
          value: 16.3,
          min: -10,
          max: 100,
          step: 0.1,
        },
        heliPosZ: {
          value: -14.9,
          min: -100,
          max: 100,
          step: 0.1,
        },
      }),
      heliLight: folder({
        intensity: {
          value: 0.4,
          min: 0,
          max: 1,
          step: 0.01,
        },
        distance: {
          value: 100,
          min: 0,
          max: 100,
          step: 0.01,
        },
        angle: {
          value: -0.9,
          min: -1,
          max: Math.PI / 2,
          step: 0.01,
        },
      }),
    });

  const { nodes, materials } = useGLTF("/models/helicopter.glb") as GLTFResult;
  const { viewport, camera } = useThree();
  const { width } = viewport.getCurrentViewport(camera, [0, 0, -10]);

  const [data] = useState({
    x: -width / 2,
  });

  // useHelper(props.mode === "dark" && spotLightRef, SpotLightHelper);

  useFrame(({ clock }) => {
    if (largePropellerRef.current) {
      largePropellerRef.current.rotation.y = clock.getElapsedTime() * 10;
    }
    if (smallPropellerRef.current) {
      smallPropellerRef.current.rotation.x = clock.getElapsedTime() * 10;
    }
    if (helicopterRef.current) {
      if (spotLightRef.current) {
        spotLightRef.current.position.copy(helicopterRef.current.position);
        spotLightRef.current.target.position.x =
          helicopterRef.current.position.x;
        spotLightRef.current.target.position.z =
          helicopterRef.current.position.z;
        spotLightRef.current.target.updateMatrixWorld(true);
      }
      helicopterRef.current.position.setX((data.x += 0.25));
      if (data.x > width) {
        data.x = -width * 4;
      }
    }
  });

  return (
    <group>
      <mesh
        {...props}
        ref={helicopterRef}
        position={[heliPosX, heliPosY, heliPosZ]}
      >
        <mesh geometry={nodes.Object_4.geometry}>
          {props.mode === "light" ? (
            <meshStandardMaterial {...materials.Material} />
          ) : (
            <meshBasicMaterial />
          )}
        </mesh>
        <mesh
          ref={largePropellerRef}
          geometry={nodes.Object_6.geometry}
          position={[0, 2.97, -0.69]}
        >
          {props.mode === "light" ? (
            <meshStandardMaterial {...materials.Material} />
          ) : (
            <meshBasicMaterial />
          )}
        </mesh>
        <mesh
          ref={smallPropellerRef}
          geometry={nodes.Object_8.geometry}
          position={[0.06, 1.81, -8.01]}
        >
          {props.mode === "light" ? (
            <meshStandardMaterial {...materials.Material} />
          ) : (
            <meshBasicMaterial />
          )}{" "}
        </mesh>
      </mesh>
      {props.mode === "dark" && (
        <group>
          <spotLight
            ref={spotLightRef}
            args={[0xffffff, intensity, distance, angle]}
          />
        </group>
      )}
    </group>
  );
};

export default Helicopter;

useGLTF.preload("/models/helicopter.glb");
