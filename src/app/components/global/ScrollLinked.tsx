"use client";

import { useTheme } from "@/app/providers/ThemeProvider";
import { motion, useScroll } from "framer-motion";

const ScrollLinked = () => {
  const { scrollYProgress } = useScroll();
  const { theme } = useTheme();

  return (
    <motion.div
      id="scroll-indicator"
      style={{
        scaleX: scrollYProgress,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        originX: 0,
        backgroundColor: theme === 'dark' ? '#4f46e5' : '#6366f1',
        boxShadow: theme === 'dark' 
          ? '0 2px 8px rgba(79, 70, 229, 0.3)' 
          : '0 2px 8px rgba(99, 102, 241, 0.3)',
        zIndex: 50,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 30
      }}
    />
  );
}

export default ScrollLinked;