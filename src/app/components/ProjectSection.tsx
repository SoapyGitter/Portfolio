'use client';

import React from 'react';
import ProjectCarousel3D from './ProjectCarousel3D';
import { projects } from '../data';
import { useResponsive } from '../hooks/useResponsive';

export default function ProjectSection() {
  const { radius, rotationSpeed } = useResponsive();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-900"></div>
      
    

      {/* 3D Carousel */}
      <div className="relative z-10 h-[600px] md:h-[700px] lg:h-[800px]">
        <ProjectCarousel3D 
          projects={projects}
          autoRotate={true}
          radius={radius}
          rotationSpeed={rotationSpeed}
        />
      </div>

      {/* Additional info */}
      <div className="relative z-10 text-center mt-16">
        <p className="text-sm text-gray-400 mb-4">
          🎮 Use your mouse to interact • 🔄 Auto-rotation pauses on hover
        </p>
        <div className="flex justify-center space-x-6 text-sm text-gray-500">
          <span>🖱️ Hover to focus</span>
          <span>👆 Click to explore</span>
          <span>📱 Mobile friendly</span>
        </div>
      </div>
    </section>
  );
} 