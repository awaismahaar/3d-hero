import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

interface HeroModelProps {
  currentMaterial?: string;
}

const HeroModel = ({ currentMaterial = "normalMap" }: HeroModelProps) => {
  const { camera, gl, size } = useThree();

  // Load GLB Model
  const glbModel = useGLTF("/models/Nightmare.glb");
  // use multiple textures on 3D model
  const textures = useTexture({
    normalMap: "/background-m.png",
    mat1: "/mat-1.png",
    mat2: "/mat-2.png",
    mat3: "/mat-3.png",
    mat4: "/mat-4.png",
    mat5: "/mat-5.png",
    mat6: "/mat-6.png",
  });

  // const {actions} = useAnimations(glbModel.animations, glbModel.scene);
  // after const textures = useTexture(...)
  Object.values(textures).forEach((tex) => {
    if (!tex) return;
    // tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  });

  // Keep one shared material for the whole model
  const matcapMaterialRef = useRef<THREE.MeshMatcapMaterial | null>(null);
  const currentTexName = useRef<string>(currentMaterial);
  const resolutionRef = useRef(new THREE.Vector2(size.width, size.height));

  // Camera + renderer setup (run once on mount)
  useEffect(() => {
    camera.position.z! = 1.2;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace; // correct color rendering
  }, [camera, gl]);

  // Keep the shader resolution in sync with canvas size
  useEffect(() => {
    resolutionRef.current.set(size.width, size.height);
  }, [size]);

  useEffect(() => {
    // Create a single MeshMatcapMaterial and inject only fragment shader code
    if (!matcapMaterialRef.current) {
      const initialTex = textures[currentMaterial as keyof typeof textures];
      if (!initialTex) return;
      const matcapMaterial = new THREE.MeshMatcapMaterial({
        matcap: initialTex,
        //normalMap: textures.normalMap,
      });

      // Fragment-only injection (no custom vertex shader needed)
      matcapMaterial.onBeforeCompile = (shader) => {
        // Extra uniforms for the wipe transition
        shader.uniforms.uMatcap2 = { value: initialTex };
        shader.uniforms.uProgress = { value: 0 };
        shader.uniforms.uResolution = { value: resolutionRef.current };

        // Add uniforms
        shader.fragmentShader = shader.fragmentShader.replace(
          "uniform sampler2D matcap;",
          [
            "uniform sampler2D matcap;",
            "uniform sampler2D uMatcap2;",
            "uniform float uProgress;",
            "uniform vec2 uResolution;",
          ].join("\n"),
        );

        // Replace the matcap sample with a bottom-to-top wipe
        shader.fragmentShader = shader.fragmentShader.replace(
          "vec4 matcapColor = texture2D( matcap, uv );",
          [
            "vec4 matcapColor = texture2D( matcap, uv );",
            "vec4 matcapColor2 = texture2D( uMatcap2, uv );",
            "",
            "// Screen-space Y (0 bottom -> 1 top)",
            "float screenY = gl_FragCoord.y / uResolution.y;",
            "",
            "// Feather controls the softness of the wipe edge",
            "float feather = 0.04;",
            "",
            "// uProgress goes 0 -> 1, new matcap grows upward",
            "float wipe = smoothstep(uProgress - feather, uProgress + feather, screenY);",
            "",
            "// Mix: new at bottom, old at top",
            "matcapColor = mix(matcapColor2, matcapColor, wipe);",
          ].join("\n"),
        );

        // Save reference so we can animate uniforms later
        matcapMaterial.userData.shader = shader;
      };

      matcapMaterial.needsUpdate = true;
      matcapMaterialRef.current = matcapMaterial;
      currentTexName.current = currentMaterial;
    }

    // Apply the material to every mesh once
    glbModel.scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      mesh.material = matcapMaterialRef.current as THREE.MeshMatcapMaterial;
    });
  }, [glbModel, textures, currentMaterial]);

  // Listen for material changes to trigger a bottom-to-top wipe
  useEffect(() => {
    const nextTex = textures[currentMaterial as keyof typeof textures];
    if (!nextTex) return;
    if (currentTexName.current === currentMaterial) return;

    const matcapMaterial = matcapMaterialRef.current;
    const shader = matcapMaterial?.userData.shader;
    if (!matcapMaterial || !shader) return;

    // Set the next texture and animate uProgress (0 -> 1)
    shader.uniforms.uMatcap2.value = nextTex;
    gsap.killTweensOf(shader.uniforms.uProgress);
    gsap.to(shader.uniforms.uProgress, {
      value: 1,
      duration: 0.3,
      // ease: "bounce.inOut",
      onComplete: () => {
        // Lock the new texture as the main matcap
        matcapMaterial.matcap = nextTex;
        matcapMaterial.needsUpdate = true;
        shader.uniforms.uProgress.value = 0;
        currentTexName.current = currentMaterial;
      },
    });
  }, [currentMaterial, textures]);

  const modal = useRef(glbModel);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        endTrigger: "#section-5",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: true,
      },
    });

    // Get initial z position
    const initialZ = modal.current.scene.position.z;

    // Animation 1: Section 1-2 - Move z back (0 to -0.5)
    tl.to(
      modal.current.scene.position,
      {
        z: initialZ - 0.5,
        duration: 2,
      },
      0,
    ); // Position 0 on timeline

    // Animation 2: Rotate during section 3-4 (positioned on timeline)
    tl.to(
      modal.current.scene.rotation,
      {
        y: "+=" + Math.PI * 2,
        duration: 1,
      },
      2,
    ); // Start at position 2 on timeline

    // Animation 3: Move z back to original at section 4-5
    tl.to(
      modal.current.scene.position,
      {
        z: initialZ,
        duration: 1,
      },
      3,
    ); // Start at position 3 on timeline

    return () => {
      tl.kill();
    };
  });
  return (
    <>
      <ambientLight intensity={7} />
      {/* <spotLight  /> */}
      <primitive
        object={glbModel.scene}
        position={[0, -0.8, 0.2]}
        rotation={[0, -Math.PI / 6, 0]}
      />
      {/* <OrbitControls /> */}
    </>
  );
};

export default HeroModel;
