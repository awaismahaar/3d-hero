import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

interface HeroModelProps {
  currentMaterial?: string;
}

export default function HeroModel({
  currentMaterial = "normalMap",
}: HeroModelProps) {
  const { camera, gl, size } = useThree();

  // Camera setup
  useEffect(() => {
    camera.position.z = 1.2;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [camera, gl]);

  return (
    <>
      <ambientLight intensity={1} />
      <SceneContent currentMaterial={currentMaterial} size={size} />
    </>
  );
}

/* ===========================
   SCENE CONTENT (Suspended)
=========================== */

function SceneContent({
  currentMaterial,
  size,
}: {
  currentMaterial: string;
  size: { width: number; height: number };
}) {
  const glbModel = useGLTF("/models/Nightmare.glb");

  const textures = useTexture({
    normalMap: "/background-m.png",
    mat1: "/mat-1.png",
    mat2: "/mat-2.png",
    mat3: "/mat-3.png",
    mat4: "/mat-4.png",
    mat5: "/mat-5.png",
    mat6: "/mat-6.png",
  });

  /* ===========================
     Texture Optimization
  =========================== */

  useEffect(() => {
    Object.values(textures).forEach((tex) => {
      if (!tex) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });
  }, [textures]);

  /* ===========================
     Shared Material
  =========================== */

  const matcapMaterialRef = useRef<THREE.MeshMatcapMaterial | null>(null);
  const currentTexName = useRef<string>(currentMaterial);
  const resolutionRef = useRef(new THREE.Vector2(size.width, size.height));

  useEffect(() => {
    resolutionRef.current.set(size.width, size.height);
  }, [size]);

  // Create material once
  useEffect(() => {
    if (matcapMaterialRef.current) return;

    const initialTex = textures[currentMaterial as keyof typeof textures];
    if (!initialTex) return;

    const material = new THREE.MeshMatcapMaterial({
      matcap: initialTex,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uMatcap2 = { value: initialTex };
      shader.uniforms.uProgress = { value: 0 };
      shader.uniforms.uResolution = {
        value: resolutionRef.current,
      };

      shader.fragmentShader = shader.fragmentShader.replace(
        "uniform sampler2D matcap;",
        `
        uniform sampler2D matcap;
        uniform sampler2D uMatcap2;
        uniform float uProgress;
        uniform vec2 uResolution;
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "vec4 matcapColor = texture2D( matcap, uv );",
        `
        vec4 matcapColor = texture2D( matcap, uv );
        vec4 matcapColor2 = texture2D( uMatcap2, uv );

        float screenY = gl_FragCoord.y / uResolution.y;
        float feather = 0.04;

        float wipe = smoothstep(
          uProgress - feather,
          uProgress + feather,
          screenY
        );

        matcapColor = mix(matcapColor2, matcapColor, wipe);
        `,
      );

      material.userData.shader = shader;
    };

    material.needsUpdate = true;
    matcapMaterialRef.current = material;
  }, [textures, currentMaterial]);

  // Apply material once
  useEffect(() => {
    if (!glbModel?.scene || !matcapMaterialRef.current) return;

    glbModel.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = matcapMaterialRef.current!;
      }
    });
  }, [glbModel]);

  /* ===========================
     Material Transition
  =========================== */

  useEffect(() => {
    const nextTex = textures[currentMaterial as keyof typeof textures];
    if (!nextTex) return;
    if (currentTexName.current === currentMaterial) return;

    const material = matcapMaterialRef.current;
    const shader = material?.userData.shader;
    if (!material || !shader) return;

    shader.uniforms.uMatcap2.value = nextTex;

    gsap.killTweensOf(shader.uniforms.uProgress);
    gsap.to(shader.uniforms.uProgress, {
      value: 1,
      duration: 0.3,
      onComplete: () => {
        material.matcap = nextTex;
        material.needsUpdate = true;
        shader.uniforms.uProgress.value = 0;
        currentTexName.current = currentMaterial;
      },
    });
  }, [currentMaterial, textures]);

  /* ===========================
     Scroll Animation
  =========================== */

  const modal = useRef(glbModel);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        endTrigger: "#section-5",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: false, // production safe
      },
    });

    const initialZ = modal.current.scene.position.z;

    tl.to(modal.current.scene.position, {
      z: initialZ - 0.5,
      duration: 2,
    })
      .to(
        modal.current.scene.rotation,
        {
          y: "+=" + Math.PI * 2,
          duration: 1,
        },
        2,
      )
      .to(
        modal.current.scene.position,
        {
          z: initialZ,
          duration: 1,
        },
        3,
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <primitive
      object={glbModel.scene}
      position={[0, -0.8, 0.2]}
      rotation={[0, -Math.PI / 6, 0]}
    />
  );
}

/* ===========================
   Preload Model (optional)
=========================== */

useGLTF.preload("/models/Nightmare.glb");

