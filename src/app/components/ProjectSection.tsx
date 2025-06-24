'use client';

import React from 'react';
import ProjectCarousel3D from './ProjectCarousel3D';
import { projects } from '../data';
import { useResponsive } from '../hooks/useResponsive';

export default function ProjectSection() {
  const { radius, rotationSpeed } = useResponsive();

  return (
    <section >
      {/* Background effects */}
      
    

      {/* 3D Carousel */}
      <div className="relative z-10 h-[600px] md:h-[700px] lg:h-[800px]">
        <ProjectCarousel3D 
          projects={projects}
          autoRotate={true}
          radius={radius}
          rotationSpeed={rotationSpeed}
        />
      </div>

     
    </section>
  );
} 