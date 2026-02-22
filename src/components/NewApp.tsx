import {
  FirstPersonControls,
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
  OrbitControls,
  useHelper,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import MenuPage from "./MenuPage";
import { useRef, useEffect, useState } from "react";
import { useControls } from "leva";
import {
  CameraHelper,
  Color,
  CubeTextureLoader,
  DirectionalLightHelper,
  Scene,
  SpotLightHelper,
  SRGBColorSpace,
  TextureLoader,
  Audio,
  AudioListener,
  AudioLoader,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function Model() {
  const result = useLoader(GLTFLoader, "/models/Nightmare.glb");
  return <primitive object={result.scene} />;
}
function DirectionalLightWithHelper() {
  const light = useRef(null);
  useHelper(light, DirectionalLightHelper, 2, "crimson");

  const shadow = useRef(null);
  useHelper(shadow, CameraHelper);

  return (
    <directionalLight ref={light} position={[-5, 8, 0]} castShadow>
      <orthographicCamera
        attach="shadow-camera"
        ref={shadow}
        // args={[-2, 2, 2, -2]}
        top={8}
        left={14}
      />
    </directionalLight>
  );
}

function SphereWithTexture() {
  const texture = useLoader(TextureLoader, "/mat-1.png");

  return (
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
function UpdateSceneBackground() {
  const { scene } = useThree();

  const texture = useLoader(TextureLoader, "/mat-1.png");

  scene.background = texture;

  return null;
}
/* function UpdateSceneBackground() {
  const { scene } = useThree();

  const texture = useLoader(TextureLoader, "/mat-3.png");

  texture.colorSpace = SRGBColorSpace;
  scene.background! = texture;

  return null;
} 
  */
function BoxWithTexture() {
  const texture1 = useTexture("/mat-1.png");
  const texture2 = useTexture("/mat-2.png");
  const texture3 = useTexture("/mat-3.png");
  const texture4 = useTexture("/mat-4.png");
  const texture5 = useTexture("/mat-5.png");
  const texture6 = useTexture("/mat-6.png");
  texture1.colorSpace! = SRGBColorSpace;
  texture2.colorSpace! = SRGBColorSpace;
  texture3.colorSpace! = SRGBColorSpace;
  texture4.colorSpace! = SRGBColorSpace;
  texture5.colorSpace! = SRGBColorSpace;
  texture6.colorSpace! = SRGBColorSpace;

  return (
    <mesh position={[0, 2, -4]}>
      <boxGeometry />
      <meshBasicMaterial attach="material-0" map={texture1} />
      <meshBasicMaterial attach="material-1" map={texture2} />
      <meshBasicMaterial attach="material-2" map={texture3} />
      <meshBasicMaterial attach="material-3" map={texture4} />
      <meshBasicMaterial attach="material-4" map={texture5} />
      <meshBasicMaterial attach="material-5" map={texture6} />
    </mesh>
  );
}

function SpotLightHelp() {
  const light = useRef(null);
  const { angle, penumbra } = useControls({
    angle: Math.PI / 8,
    penumbra: {
      value: 0.0,
      min: 0.0,
      max: 1.0,
      step: 0.1,
    },
  });
  useHelper(light, SpotLightHelper, "yellow");
  return (
    <spotLight
      ref={light}
      intensity={80}
      angle={angle}
      penumbra={penumbra}
      position={[2, 5, 1]}
      castShadow
    />
  );
}

function AudioComponent() {
  const { camera } = useThree();

  useEffect(() => {
    const listener = new AudioListener();
    camera.add(listener);
    const sound = new Audio(listener);
    const audioLoader = new AudioLoader();

    audioLoader.load("/sound.mp3", (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(0.5);
    });
    const handleClick = () => {
      sound.play();
    };
    window.addEventListener("click", handleClick);
  }, []);

  return null;
}

function RenderMeshShape() {
  const animateBox = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  // Handle click event to toggle the wireframe mode
  const handleClick = () => {
    setWireframe(wireframe === false ? true : false);
  };
  const { speed, color } = useControls({
    color: "red",
    speed: {
      value: 0.005,
      min: 0.0,
      max: 0.03,
      step: 0.001,
    },
  });

  // render loop
  useFrame(() => {
    animateBox.current.rotation.x += speed;
    // animateBox.current.rotation.y += 0.005
    // animateBox.current.rotation.z += 0.005
  });
  return (
    <mesh
      ref={animateBox}
      position={[0, 3, 0]}
      castShadow
      onPointerDown={() => {
        console.log("Hello");

        animateBox.current.position.y += 0.2;
      }}
      onClick={handleClick}
    >
      {/* Geometry means shape 
      <boxGeometry args={[3, 3, 2]} />
      Material means colors, surface 
      <meshStandardMaterial color={color} wireframe={wireframe} /> */}
    </mesh>
  );
}
const NewApp = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        shadows
        fallback={
          <div
            style={{
              position: "absolute",
              zIndex: 1000,
              left: 0,
              right: 0,
              fontSize: 45,
            }}
          >
            Sorry no WebGL supported!
          </div>
        }
        // camera={{ position: [2, 2, 0] }}
        // style={{ backgroundColor: "blue" }}
      >
        <Model />
        <OrbitControls />
        {/* <SphereWithTexture />  */}

        <BoxWithTexture />

        <UpdateSceneBackground />
        {/*  <mesh scale={[2,2,2]} rotation={[2,22,Math.PI/8]}>  
         <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper></mesh> */}
        <RenderMeshShape />
        {/* <directionalLight position={[8, 8, 8]} />
        <RenderMeshShape />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <pointLight intensity={50} position={[4, 2, 3]} />
        <spotLight penumbra={2} intensity={50} position={[-4, 2, 3]} />
        <OrbitControls />
        <DirectionalLightWithHelper />
        <AudioComponent />
        <SpotLightHelp /> 
        <axesHelper args={[10]} /> 
        <gridHelper args={[20, 20, "red", "yellow"]} /> */}
      </Canvas>
    </div>
  );
};

export default NewApp;
