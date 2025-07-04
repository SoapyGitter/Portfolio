"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { Project } from "../types";
import { useResponsive } from "../hooks/useResponsive";
import { useTheme } from "../providers/ThemeProvider";
import {
  EffectComposer,
  RenderPass,
  BloomEffect,
  EffectPass,
  BlendFunction,
  BokehEffect,
  VignetteEffect,
  ChromaticAberrationEffect,
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
  const { isMobile } = useResponsive();
  const { theme } = useTheme();
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

      const width = isMobile ? 400 : 512;
      const height = isMobile ? 250 : 320;
      canvas.width = width;
      canvas.height = height;

      // Card Background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      if (theme === 'light') {
        if (isActive) {
          gradient.addColorStop(0, "#ffffff");
          gradient.addColorStop(1, "#ffffff");
        } else {
          gradient.addColorStop(0, "#e2e8f0");
          gradient.addColorStop(1, "#cbd5e1");
        }
      } else {
        gradient.addColorStop(0, "#1d243a");
        gradient.addColorStop(1, "#111827");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle grid pattern
      ctx.strokeStyle = theme === 'light' 
        ? "rgba(0, 0, 0, 0.05)" 
        : "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Scan lines
      ctx.strokeStyle = theme === 'light'
        ? "rgba(59, 130, 246, 0.08)"
        : "rgba(100, 150, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vignette
      const vignetteGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        height / 3,
        width / 2,
        height / 2,
        width / 2 + 150
      );
      if (theme === 'light') {
        if (isActive) {
          vignetteGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
          vignetteGradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");
        } else {
          vignetteGradient.addColorStop(0, "rgba(226, 232, 240, 0)");
          vignetteGradient.addColorStop(1, "rgba(203, 213, 225, 0.6)");
        }
      } else {
        vignetteGradient.addColorStop(0, "rgba(29, 36, 58, 0)");
        vignetteGradient.addColorStop(1, "rgba(17, 24, 39, 0.6)");
      }
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, width, height);

      // Corner brackets
      const cornerSize = 25;
      const cornerLineWidth = 3;
      ctx.lineWidth = cornerLineWidth;
      ctx.strokeStyle = isActive
        ? "rgba(96, 165, 250, 0.7)"
        : theme === 'light' 
          ? "rgba(100, 116, 139, 0.6)"
          : "rgba(55, 65, 81, 0.6)";

      const p = cornerLineWidth / 2; // padding
      // Top-left
      ctx.beginPath();
      ctx.moveTo(p + cornerSize, p);
      ctx.lineTo(p, p);
      ctx.lineTo(p, p + cornerSize);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - p - cornerSize, p);
      ctx.lineTo(width - p, p);
      ctx.lineTo(width - p, p + cornerSize);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(p + cornerSize, height - p);
      ctx.lineTo(p, height - p);
      ctx.lineTo(p, height - p - cornerSize);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - p - cornerSize, height - p);
      ctx.lineTo(width - p, height - p);
      ctx.lineTo(width - p, height - p - cornerSize);
      ctx.stroke();

      // Border with potential glow
      ctx.strokeStyle = isActive ? "#60a5fa" : theme === 'light' ? "#64748b" : "#374151";
      ctx.lineWidth = 1.5;
      if (isActive) {
        ctx.shadowColor = "#60a5fa";
      }
      ctx.strokeRect(0, 0, width, height);
      ctx.shadowBlur = 0;

      // Content
      ctx.fillStyle = theme === 'light' ? "#0f172a" : "#f9fafb";
      ctx.font = `bold ${isMobile ? '28px' : '38px'} 'Segoe UI', Arial, sans-serif`;
      ctx.textAlign = "center";
      
      // Text outline for better visibility
      ctx.strokeStyle = theme === 'light' ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.7)";
      ctx.lineWidth = isMobile ? 4 : 6;
      ctx.lineJoin = "round";
      ctx.strokeText(project.title, width / 2, isMobile ? 55 : 75);
      ctx.fillText(project.title, width / 2, isMobile ? 55 : 75);

      ctx.fillStyle = theme === 'light' ? "#334155" : "#d1d5db";
      ctx.font = `${isMobile ? '14px' : '18px'} 'Segoe UI', Arial, sans-serif`;
      
      ctx.lineWidth = isMobile ? 3 : 4; // Thinner outline for description
      const words = project.description.split(" ");
      const maxWidth = width - (isMobile ? 60 : 80);
      let line = "";
      let y = isMobile ? 90 : 125;
      const lineHeight = isMobile ? 20 : 26;
      words.forEach((word) => {
        const testLine = line + word + " ";
        if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
          const trimmedLine = line.trim();
          ctx.strokeText(trimmedLine, width / 2, y);
          ctx.fillText(trimmedLine, width / 2, y);
          line = word + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      });
      const trimmedLine = line.trim();
      ctx.strokeText(trimmedLine, width / 2, y);
      ctx.fillText(trimmedLine, width / 2, y);

      if (project.technologies?.length) {
        ctx.fillStyle = theme === 'light' ? "#475569" : "#9ca3af";
        ctx.font = `${isMobile ? '12px' : '14px'} 'Segoe UI', Arial, sans-serif`;
        const techText = project.technologies.slice(0, 4).join("  •  ");
        ctx.fillText(techText, width / 2, height - (isMobile ? 55 : 85));
      }

      // Button
      if (project.link && project.link !== "#") {
        const buttonY = height - (isMobile ? 35 : 65);
        const buttonWidth = isMobile ? 120 : 150;
        const buttonHeight = isMobile ? 30 : 40;
        const borderRadius = 8;

        ctx.fillStyle = isActive ? "#3b82f6" : theme === 'light' ? "#64748b" : "#374151";
        if (isActive) {
          ctx.shadowColor = "#3b82f6";
        }
        ctx.beginPath();
        ctx.roundRect(
          width / 2 - buttonWidth / 2,
          buttonY,
          buttonWidth,
          buttonHeight,
          borderRadius
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${isMobile ? '14px' : '16px'} 'Segoe UI', Arial, sans-serif`;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 5;
        ctx.fillText("View Project", width / 2, buttonY + (isMobile ? 20 : 25));
        ctx.shadowBlur = 0;
      }

      return new THREE.CanvasTexture(canvas);
    },
    [isMobile, theme]
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
    updateCardTextures(focusedIndex);
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
    camera.position.set(55, 55, 18);
    cameraRef.current = camera;

    const composer = new EffectComposer(renderer);
    const bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.ADD,
      intensity: 0.75,
      luminanceThreshold: 0.25,
      luminanceSmoothing: 0.4,
      mipmapBlur: true,
    });

    const bokehEffect = new BokehEffect({
      focus: 20,
      dof: 0.01,
      aperture: 0.05,
      maxBlur: 0.015,
    });
    bokehEffectRef.current = bokehEffect;

    const vignetteEffect = new VignetteEffect({
      eskil: false,
      offset: 0.15,
      darkness: 0.6,
    });

    const chromaticAberrationEffect = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.0005, 0.0005),
      radialModulation: false,
      modulationOffset: 0.0,
    });

    composer.addPass(new RenderPass(scene, camera));

    composer.addPass(new EffectPass(camera, bloomEffect));
    composer.addPass(new EffectPass(camera, bokehEffect));
    composer.addPass(
      new EffectPass(camera, vignetteEffect, chromaticAberrationEffect)
    );

    composerRef.current = composer;

    // Theme-aware lighting setup
    const ambientIntensity = theme === 'light' ? 0.8 : 0.2;
    const directionalIntensity = theme === 'light' ? 2.0 : 1.0;
    const spotIntensity = theme === 'light' ? 80 : 60;
    
    scene.add(new THREE.AmbientLight(0xffffff, ambientIntensity));
    const dirLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Add additional fill light for light theme
    if (theme === 'light') {
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
      fillLight.position.set(-5, 5, 5);
      scene.add(fillLight);
    }

    const spot = new THREE.SpotLight(0x60a5fa, spotIntensity, 25, Math.PI / 7, 0.4, 1.5);
    spot.castShadow = true;
    spotLightRef.current = spot;
    scene.add(spot);

    const group = new THREE.Group();
    group.position.y = 5;
    carouselGroupRef.current = group;
    scene.add(group);

    cardMeshesRef.current = projects.map((project, index) => {
      const texture = createCardTexture(project, index === 0);
      const cardWidth = isMobile ? 2.0 : 5.76;
      const cardHeight = isMobile ? 1.5 : 3.6;
      const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
      // Theme-aware material properties
      const emissiveIntensity = theme === 'light' ? 0.05 : 0.1;
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: emissiveIntensity,
        roughness: theme === 'light' ? 0.7 : 0.5,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { index, project };
      group.add(mesh);
      return mesh;
    });

    const particleCount = 8000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const baseColor = new THREE.Color(0x60a5fa);

    for (let i = 0; i < particleCount; i++) {
      positions.set(
        [
          (Math.random() - 0.5) * 150,
          (Math.random() - 0.5) * 150,
          (Math.random() - 0.5) * 150,
        ],
        i * 3
      );
      const mixedColor = baseColor.clone();
      mixedColor.lerp(new THREE.Color(0xffffff), Math.random() * 0.5);
      colors.set([mixedColor.r, mixedColor.g, mixedColor.b], i * 3);
      velocities.set(
        [
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.01,
        ],
        i * 3
      );
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    particleGeometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(velocities, 3)
    );
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
      })
    );
    particlesRef.current = particles;
    scene.add(particles);

    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      const rotationY = carouselGroupRef.current!.rotation.y;
      const distanceToTarget = Math.abs(rotationY - targetRotationY.current);

      if (distanceToTarget > 0.0001) {
        carouselGroupRef.current!.rotation.y = THREE.MathUtils.lerp(
          rotationY,
          targetRotationY.current,
          0.05
        );
      } else if (carouselGroupRef.current) {
        carouselGroupRef.current!.rotation.y = targetRotationY.current;
      }

      if (particlesRef.current) {
        const p = particlesRef.current.geometry.attributes.position;
        const v = particlesRef.current.geometry.attributes.velocity;
        const positions = p.array as Float32Array;
        const velocities = v.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          if (positions[i + 1] < -75) positions[i + 1] = 75;
          if (positions[i + 1] > 75) positions[i + 1] = -75;

          if (positions[i] < -75 || positions[i] > 75) velocities[i] *= -1;
          if (positions[i + 2] < -75 || positions[i + 2] > 75)
            velocities[i + 2] *= -1;
        }
        p.needsUpdate = true;
      }

      camera.position.x +=
        (mouseRef.current.x * 0.5 - camera.position.x) * 0.05;
      camera.position.y +=
        (mouseRef.current.y * 0.5 + 6 - camera.position.y) * 0.05 - 0.05;
      camera.lookAt(0, 5, 0);

      let minDistance = Infinity;

      cardMeshesRef.current.forEach((mesh, index) => {
        const isFocused = index === stateRef.current.focusedIndex;
        const targetRadius = isFocused ? radius * 1.25 : radius;

        if (mesh.userData.currentRadius === undefined) {
          mesh.userData.currentRadius = radius;
        }

        mesh.userData.currentRadius = THREE.MathUtils.lerp(
          mesh.userData.currentRadius,
          targetRadius,
          0.05
        );
        
        if (mesh.userData.angle !== undefined) {
          mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.currentRadius;
          mesh.position.z = Math.sin(mesh.userData.angle) * mesh.userData.currentRadius;
        }

        mesh.position.y = Math.sin(elapsedTime * 0.5 + index * 0.5) * 0.2;
        mesh.lookAt(camera.position);
        const worldPosition = new THREE.Vector3();
        mesh.getWorldPosition(worldPosition);
        const distance = worldPosition.distanceTo(camera.position);
        if (distance < minDistance) {
          minDistance = distance;
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
      mesh.userData.angle = angle; // Store the angle
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${
        theme === 'light' 
          ? 'from-slate-50/50 to-slate-100/50' 
          : 'from-gray-900/50 to-gray-800/50'
      }`} />

      <div className="absolute inset-0 z-10 cursor-pointer"
        ref={mountRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />

      {/* Blur overlays to blend edges */}
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${
        theme === 'light'
          ? 'from-slate-50 via-slate-50/80 to-transparent'
          : 'from-gray-900 via-gray-900/80 to-transparent'
      } z-10 pointer-events-none`} />
      <div className={`absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t ${
        theme === 'light'
          ? 'from-slate-50 via-slate-50/80 to-transparent'
          : 'from-gray-900 via-gray-900/80 to-transparent'
      } z-10 pointer-events-none`} />

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setFocusedIndex(
            (prev) => (prev - 1 + projects.length) % projects.length
          )
        }
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full transition-colors ${
          theme === 'light'
            ? 'bg-white/20 text-gray-800 hover:bg-white/40'
            : 'bg-black/20 text-white hover:bg-black/40'
        }`}
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={() => setFocusedIndex((prev) => (prev + 1) % projects.length)}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full transition-colors ${
          theme === 'light'
            ? 'bg-white/20 text-gray-800 hover:bg-white/40'
            : 'bg-black/20 text-white hover:bg-black/40'
        }`}
      >
        <ChevronRight size={32} />
      </button>

      {/* <div
        className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-center text-white px-4 pointer-events-none transition-opacity duration-500 w-full max-w-2xl ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl shadow-black/30">
          <h3 className={"text-3xl font-bold mb-2 text-shadow-lg"}>
            {projects[focusedIndex]?.title}
          </h3>
          <p
            className={"text-base text-gray-300 max-w-xl mx-auto mb-4 text-shadow"}
          >
            {projects[focusedIndex]?.description}
          </p>
          <div className="flex justify-center items-center flex-wrap gap-2">
            {projects[focusedIndex]?.technologies?.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-sky-500/10 text-sky-300 text-xs rounded-full border border-sky-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
          {projects[focusedIndex]?.link &&
            projects[focusedIndex].link !== "#" && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    if (projects[focusedIndex].link) {
                      window.open(projects[focusedIndex].link, "_blank");
                    }
                  }}
                  className="pointer-events-auto inline-block rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  View Project
                </button>
              </div>
            )}
        </div>
      </div> */}

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 pointer-events-auto ${
              index === focusedIndex
                ? "bg-blue-400 scale-125 shadow-lg shadow-blue-400/50"
                : "bg-gray-500/50 hover:bg-gray-400"
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
