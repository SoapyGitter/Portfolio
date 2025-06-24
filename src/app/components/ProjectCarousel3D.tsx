"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { Project } from "../types";
import { useResponsive } from "../hooks/useResponsive";
import {
  EffectComposer,
  RenderPass,
  BloomEffect,
  EffectPass,
  BlendFunction,
  BokehEffect,
} from "postprocessing";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectCarousel3DProps {
  projects: Project[];
  autoRotate?: boolean;
  radius: number;
  rotationSpeed: number;
}

export default function ProjectCarousel3D({
  projects,
  autoRotate = true,
  radius,
  rotationSpeed,
}: ProjectCarousel3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const carouselGroupRef = useRef<THREE.Group | null>(null);
  const cardMeshesRef = useRef<THREE.Mesh[]>([]);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const bokehEffectRef = useRef<BokehEffect | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const animationFrameRef = useRef<number | null>(null);
  const targetRotationY = useRef(0);
  const lastInteractionTime = useRef(0);
  const autoRotateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const stateRef = useRef({
    isHovered,
    autoRotate,
    rotationSpeed,
    focusedIndex,
  });
  useEffect(() => {
    stateRef.current = { isHovered, autoRotate, rotationSpeed, focusedIndex };
  });

  const createCardTexture = useCallback(
    (project: Project, isActive: boolean = false) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const width = 512;
      const height = 320;
      canvas.width = width;
      canvas.height = height;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#1e293b");
      gradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      if (isActive) {
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      ctx.strokeStyle = isActive ? "#3b82f6" : "#475569";
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, width - 4, height - 4);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.fillText(project.title, width / 2, 80);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "20px Arial";
      const words = project.description.split(" ");
      const maxWidth = width - 60;
      let line = "";
      let y = 130;

      words.forEach((word) => {
        const testLine = line + word + " ";
        if (ctx.measureText(testLine).width > maxWidth) {
          ctx.fillText(line, width / 2, y);
          line = word + " ";
          y += 28;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, width / 2, y);

      if (project.technologies?.length) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "16px Arial";
        const techText = project.technologies.slice(0, 3).join(" • ");
        ctx.fillText(techText, width / 2, y + 40);
      }

      const buttonY = height - 60;
      const buttonWidth = 140;
      const buttonHeight = 35;
      ctx.fillStyle = isActive ? "#3b82f6" : "#475569";
      ctx.fillRect(
        (width - buttonWidth) / 2,
        buttonY,
        buttonWidth,
        buttonHeight
      );

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px Arial";
      ctx.fillText("Explore", width / 2, buttonY + 23);

      return new THREE.CanvasTexture(canvas);
    },
    []
  );

  const updateCardTextures = useCallback(
    (activeIndex: number) => {
      cardMeshesRef.current.forEach((mesh, index) => {
        const texture = createCardTexture(
          projects[index],
          index === activeIndex
        );
        if (texture && mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.map = texture;
          mesh.material.emissiveMap = texture;
          mesh.material.needsUpdate = true;
        }
      });
    },
    [projects, createCardTexture]
  );

  useEffect(() => {
    if (focusedIndex !== stateRef.current.focusedIndex) {
      updateCardTextures(focusedIndex);
    }
  }, [focusedIndex, updateCardTextures]);

  const setTargetRotationByIndex = useCallback(
    (index: number) => {
      if (!carouselGroupRef.current) return;
      // Calculate the angle to bring the selected project to the front (accounting for initial Math.PI/2 offset)
      const targetAngle = (index / projects.length) * (Math.PI * 2);
      const currentRotation = carouselGroupRef.current.rotation.y;
      const twoPi = Math.PI * 2;
      const diff =
        ((targetAngle - currentRotation + Math.PI) % twoPi) - Math.PI;
      targetRotationY.current =
        currentRotation + (diff < -Math.PI ? diff + twoPi : diff);
    },
    [projects.length]
  );

  useEffect(() => {
    setTargetRotationByIndex(focusedIndex);
  }, [focusedIndex, setTargetRotationByIndex]);

  useEffect(() => {
    if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
    }
    if (autoRotate && !isHovered) {
      autoRotateIntervalRef.current = setInterval(() => {
        setFocusedIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
      }, 5000); // Rotate every 5 seconds
    }
    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }
    };
  }, [autoRotate, isHovered, projects.length]);

  // Scene setup effect
  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 18);
    cameraRef.current = camera;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.ADD,
      intensity: 0.7,
      luminanceThreshold: 0.15,
      luminanceSmoothing: 0.2,
    });
    const bokehEffect = new BokehEffect({
      focus: 20,
      dof: 0.001,
      aperture: 0.0005,
      maxBlur: 0.001,
    });
    bokehEffectRef.current = bokehEffect;
    composer.addPass(new EffectPass(camera, bloomEffect, bokehEffect));
    composerRef.current = composer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const spot = new THREE.SpotLight(0x3b82f6, 50, 20, Math.PI / 8, 0.5, 1);
    spot.castShadow = true;
    spotLightRef.current = spot;
    scene.add(spot);

    const group = new THREE.Group();
    carouselGroupRef.current = group;
    scene.add(group);

    cardMeshesRef.current = projects.map((project, index) => {
      const texture = createCardTexture(project, index === 0);
      const geometry = new THREE.PlaneGeometry(4.8, 3);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.05,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { index, project };
      group.add(mesh);
      return mesh;
    });

    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions.set(
        [
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
        ],
        i * 3
      );
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x555555,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
      })
    );
    particlesRef.current = particles;
    scene.add(particles);

    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const rotationY = carouselGroupRef.current!.rotation.y;
      const distanceToTarget = Math.abs(rotationY - targetRotationY.current);

      if (distanceToTarget > 0.0001) {
        carouselGroupRef.current!.rotation.y = THREE.MathUtils.lerp(
          rotationY,
          targetRotationY.current,
          0.1
        );
      } else if (carouselGroupRef.current) {
        carouselGroupRef.current!.rotation.y = targetRotationY.current;
      }

      particlesRef.current!.rotation.y += delta * 0.01;

      camera.position.x +=
        (mouseRef.current.x * 0.5 - camera.position.x) * 0.05;
      camera.position.y +=
        (mouseRef.current.y * 0.5 + 2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      let minDistance = Infinity;
      let closestMesh: THREE.Mesh | null = null;

      cardMeshesRef.current.forEach((mesh, index) => {
        mesh.lookAt(camera.position);
        const worldPosition = new THREE.Vector3();
        mesh.getWorldPosition(worldPosition);
        const distance = worldPosition.distanceTo(camera.position);
        if (distance < minDistance) {
          minDistance = distance;
          closestMesh = mesh;
        }
        if (index === stateRef.current.focusedIndex) {
          (mesh.material as THREE.MeshStandardMaterial).opacity = 1.0;
        } else {
          (mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(
            0.3,
            1 - Math.pow(distance / (radius * 2), 2)
          );
        }
      });

      const focusedMesh = cardMeshesRef.current[stateRef.current.focusedIndex];
      if (spotLightRef.current && focusedMesh) {
        const targetPosition = new THREE.Vector3();
        focusedMesh.getWorldPosition(targetPosition);
        targetPosition.y += 3;
        spotLightRef.current.position.lerp(targetPosition, 0.1);
        spotLightRef.current.target = focusedMesh;
      }

      if (bokehEffectRef.current && focusedMesh) {
        const focusedPosition = new THREE.Vector3();
        focusedMesh.getWorldPosition(focusedPosition);
        const focusedDistance = focusedPosition.distanceTo(camera.position);
        bokehEffectRef.current.uniforms.get("focus")!.value = focusedDistance;
      }

      composer.render(delta);
    };

    animate();

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
      composer.dispose();
      if (currentMount) currentMount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  // Layout effect
  useEffect(() => {
    cardMeshesRef.current.forEach((mesh, index) => {
      // Position index 0 at the front (positive Z), others arranged clockwise
      const angle = (index / projects.length) * Math.PI * 2 + Math.PI / 2;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.position.y = 0;
    });

    const handleResize = () => {
      if (
        !mountRef.current ||
        !cameraRef.current ||
        !rendererRef.current ||
        !composerRef.current
      )
        return;
      const { clientWidth, clientHeight } = mountRef.current;
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
      composerRef.current.setSize(clientWidth, clientHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [radius, projects.length]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!mountRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastInteractionTime.current < 800) return;
      lastInteractionTime.current = now;

      if (event.deltaY > 0) {
        setFocusedIndex((prev) => (prev + 1) % projects.length);
      } else {
        setFocusedIndex(
          (prev) => (prev - 1 + projects.length) % projects.length
        );
      }
    },
    [projects.length]
  );

  const handleClick = useCallback((event: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current) return;
    
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    
    const intersects = raycaster.intersectObjects(cardMeshesRef.current);
    
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const clickedIndex = clickedMesh.userData.index;
      
      if (clickedIndex === focusedIndex) {
        // If clicking on already focused project, open its link
        const { link } = projects[focusedIndex];
        if (link && link !== "#") window.open(link, "_blank");
      } else {
        // If clicking on a different project, select it
        setFocusedIndex(clickedIndex);
      }
    }
  }, [focusedIndex, projects]);

  return (
    <div
      className="relative w-full h-full min-h-[600px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50" />

      <div
        ref={mountRef}
        className="relative w-full h-full z-10 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      />

      {/* Navigation Arrows */}
      <button
        onClick={() => setFocusedIndex((prev) => (prev + 1) % projects.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={() =>
          setFocusedIndex(
            (prev) => (prev - 1 + projects.length) % projects.length
          )
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
      >
        <ChevronRight size={32} />
      </button>

      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-center text-white px-4 pointer-events-none transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <h3 className={`${"text-2xl"} font-bold mb-1 text-shadow`}>
          {projects[focusedIndex]?.title}
        </h3>
        <p
          className={`${"text-sm"} text-gray-300 max-w-md mx-auto mb-3 text-shadow`}
        >
          {projects[focusedIndex]?.description}
        </p>
        <div className="flex justify-center space-x-1 flex-wrap">
          {projects[focusedIndex]?.technologies?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className={`px-2 py-1 bg-blue-500/20 text-blue-300 ${"text-xs"} rounded-full border border-blue-500/30 mb-1`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 pointer-events-auto ${
              index === focusedIndex
                ? "bg-blue-500 scale-125"
                : "bg-gray-400/50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setFocusedIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
