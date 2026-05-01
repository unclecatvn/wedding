"use client";

/* eslint-disable react-hooks/immutability -- React Three Fiber updates camera, refs and shader uniforms imperatively per frame. */

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { WeddingImage, WeddingThemeMode } from "@/types/wedding";

type WeddingWebGLSceneProps = {
  images: WeddingImage[];
  themeMode: WeddingThemeMode;
};

type ScrollState = {
  current: number;
  targetVelocity: number;
  target: number;
  velocity: number;
};

const vertexShader = `
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uWave;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin((uv.x + uProgress) * 8.0) * sin((uv.y + uProgress) * 6.0);
    pos.z += wave * uWave;
    pos.x += (uv.y - 0.5) * uWave * 0.45;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uImageAspect;
  uniform float uMaskStrength;
  uniform float uPlaneAspect;
  uniform float uProgress;
  uniform float uThemeLight;
  uniform float uVelocity;

  vec2 coverUv(vec2 uv) {
    vec2 centered = uv - 0.5;
    if (uPlaneAspect > uImageAspect) {
      centered.y *= uImageAspect / uPlaneAspect;
    } else {
      centered.x *= uPlaneAspect / uImageAspect;
    }
    return centered + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    float sweep = smoothstep(0.0, 1.0, uProgress);
    uv.x += sin(uv.y * 5.0 + sweep * 2.5) * 0.004;
    uv.y += cos(uv.x * 4.0 + sweep * 2.0) * 0.003;

    vec4 color = texture2D(uTexture, uv);
    float vignette = smoothstep(0.82, 0.28, distance(vUv, vec2(0.5)));
    float softMask = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    softMask *= smoothstep(0.0, 0.16, vUv.y) * smoothstep(1.0, 0.08, vUv.y);
    float diagonal = vUv.x + vUv.y + sin(vUv.y * 5.0 + uProgress * 3.0) * 0.06;
    float transitionMask = smoothstep(-0.18, 1.08, diagonal + uMaskStrength * 0.42);
    float velocityGlow = smoothstep(0.0, 0.8, uVelocity);
    color.rgb *= 0.78 + vignette * 0.28;
    color.rgb = mix(color.rgb, vec3(0.06, 0.045, 0.035), 0.18);
    color.rgb = mix(color.rgb, mix(color.rgb, vec3(0.95, 0.89, 0.78), 0.22), uThemeLight);
    color.rgb += vec3(0.035, 0.026, 0.014) * velocityGlow * transitionMask;

    gl_FragColor = vec4(color.rgb, color.a * uOpacity * softMask * mix(1.0, transitionMask, uMaskStrength));
  }
`;

export function WeddingWebGLScene({ images, themeMode }: WeddingWebGLSceneProps) {
  const scroll = useRef<ScrollState>({
    current: 0,
    target: 0,
    targetVelocity: 0,
    velocity: 0,
  });
  const sceneImages = useMemo(() => images.filter(Boolean).slice(0, 5), [images]);
  const isLight = themeMode === "light";

  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let velocityFrame = 0;

    const updateProgress = () => {
      const now = performance.now();
      const deltaTime = Math.max(now - lastTime, 16);
      const deltaY = Math.abs(window.scrollY - lastY);

      scroll.current.targetVelocity = THREE.MathUtils.clamp(
        deltaY / deltaTime / 2.4,
        0,
        1,
      );

      lastY = window.scrollY;
      lastTime = now;

      cancelAnimationFrame(velocityFrame);
      velocityFrame = window.requestAnimationFrame(() => {
        scroll.current.targetVelocity = 0;
      });
    };

    const updateFromChapter = (event: Event) => {
      const detail = (event as CustomEvent<{
        progress: number;
        velocity: number;
      }>).detail;

      scroll.current.target = THREE.MathUtils.clamp(detail.progress, 0, 1);
      scroll.current.targetVelocity = THREE.MathUtils.clamp(detail.velocity, 0, 1);

      cancelAnimationFrame(velocityFrame);
      velocityFrame = window.requestAnimationFrame(() => {
        scroll.current.targetVelocity = 0;
      });
    };

    updateProgress();
    window.addEventListener("wedding:webgl-progress", updateFromChapter);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      cancelAnimationFrame(velocityFrame);
      window.removeEventListener("wedding:webgl-progress", updateFromChapter);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [sceneImages.length]);

  if (sceneImages.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-background">
      <Canvas
        camera={{ position: [0, 0.12, 7.8], fov: 38 }}
        dpr={[1, 1.6]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={[isLight ? "#f6efe2" : "#100d0b"]} />
        <ambientLight intensity={0.7} />
        <SceneContent images={sceneImages} scroll={scroll} themeMode={themeMode} />
      </Canvas>
      <div
        className={
          isLight
            ? "absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(246,239,226,0.02)_0%,rgba(246,239,226,0.38)_52%,rgba(246,239,226,0.86)_100%)]"
            : "absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(16,13,11,0.1)_46%,rgba(16,13,11,0.72)_100%)]"
        }
      />
      <div
        className={
          isLight
            ? "absolute inset-0 bg-gradient-to-b from-cream/35 via-transparent to-background/95"
            : "absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background/90"
        }
      />
    </div>
  );
}

function SceneContent({
  images,
  scroll,
  themeMode,
}: {
  images: WeddingImage[];
  scroll: MutableRefObject<ScrollState>;
  themeMode: WeddingThemeMode;
}) {
  const group = useRef<THREE.Group>(null);
  const { camera, viewport } = useThree();
  const textures = useLoader(
    THREE.TextureLoader,
    images.map((image) => image.src),
  );

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
    });
  }, [textures]);

  useFrame((_, delta) => {
    scroll.current.current = THREE.MathUtils.damp(
      scroll.current.current,
      scroll.current.target,
      4,
      delta,
    );
    scroll.current.velocity = THREE.MathUtils.damp(
      scroll.current.velocity,
      scroll.current.targetVelocity,
      5.5,
      delta,
    );

    const progress = scroll.current.current;
    const velocity = scroll.current.velocity;
    camera.position.x = Math.sin(progress * Math.PI * 1.4) * (0.18 + velocity * 0.08);
    camera.position.y = THREE.MathUtils.lerp(0.16, -0.08, progress);
    camera.position.z = THREE.MathUtils.lerp(7.8, 7.25 - velocity * 0.22, progress);
    camera.rotation.z = Math.sin(progress * Math.PI * 2) * 0.008;
    camera.lookAt(0, 0, 0);

    if (group.current) {
      group.current.rotation.y = Math.sin(progress * Math.PI) * 0.018;
      group.current.rotation.x = Math.cos(progress * Math.PI) * 0.006;
    }
  });

  const planeWidth = Math.min(viewport.width * 0.92, 8.8);
  const planeHeight = Math.min(viewport.height * 0.74, 5.15);

  return (
    <group ref={group}>
      {textures.map((texture, index) => (
        <ImagePlane
          key={`${images[index]?.src}-${index}`}
          index={index}
          total={textures.length}
          texture={texture}
          themeMode={themeMode}
          scroll={scroll}
          size={[planeWidth, planeHeight]}
        />
      ))}
    </group>
  );
}

function ImagePlane({
  index,
  scroll,
  size,
  texture,
  themeMode,
  total,
}: {
  index: number;
  scroll: MutableRefObject<ScrollState>;
  size: [number, number];
  texture: THREE.Texture;
  themeMode: WeddingThemeMode;
  total: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTexture: { value: texture },
          uImageAspect: { value: 1.5 },
          uMaskStrength: { value: 0 },
          uOpacity: { value: 0 },
          uPlaneAspect: { value: size[0] / size[1] },
          uProgress: { value: 0 },
          uThemeLight: { value: themeMode === "light" ? 1 : 0 },
          uVelocity: { value: 0 },
          uWave: { value: 0.025 },
        },
        vertexShader,
        fragmentShader,
      }),
    [size, texture, themeMode],
  );

  useEffect(() => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    material.uniforms.uImageAspect.value =
      image?.width && image?.height ? image.width / image.height : 1.5;
    material.uniforms.uPlaneAspect.value = size[0] / size[1];
    material.uniforms.uThemeLight.value = themeMode === "light" ? 1 : 0;
  }, [material, size, texture, themeMode]);

  useFrame((_, delta) => {
    const progress = scroll.current.current;
    const velocity = scroll.current.velocity;
    const rawChapter = progress * Math.max(total - 1, 1);
    const activeChapter = Math.floor(rawChapter);
    const localProgress = THREE.MathUtils.smoothstep(rawChapter - activeChapter, 0, 1);
    const transitionDistance = Math.abs(0.5 - (rawChapter - activeChapter)) * 2;
    const maskStrength = THREE.MathUtils.clamp(
      (1 - transitionDistance) * 0.42 + velocity * 0.74,
      0,
      0.86,
    );
    const opacity =
      total === 1
        ? 1
        : index === activeChapter
          ? 1 - localProgress
          : index === activeChapter + 1
            ? localProgress
            : 0;

    material.uniforms.uOpacity.value = THREE.MathUtils.damp(
      material.uniforms.uOpacity.value as number,
      opacity,
      5,
      delta,
    );
    material.uniforms.uProgress.value = progress + index * 0.08;
    material.uniforms.uMaskStrength.value = maskStrength;
    material.uniforms.uVelocity.value = velocity;
    material.uniforms.uWave.value = THREE.MathUtils.lerp(0.01, 0.045 + velocity * 0.04, opacity);

    if (mesh.current) {
      mesh.current.position.x = Math.sin(progress * Math.PI + index) * (0.05 + velocity * 0.03);
      mesh.current.position.y = Math.cos(progress * Math.PI + index) * 0.035;
      mesh.current.position.z = -index * 0.015;
      mesh.current.rotation.z = (index % 2 === 0 ? -0.004 : 0.004) * opacity;
      mesh.current.rotation.y = (index % 2 === 0 ? 0.018 : -0.018) * opacity;
      mesh.current.scale.setScalar(1 + opacity * 0.035 + velocity * 0.018);
    }
  });

  return (
    <mesh ref={mesh} material={material}>
      <planeGeometry args={[size[0], size[1], 48, 32]} />
    </mesh>
  );
}
