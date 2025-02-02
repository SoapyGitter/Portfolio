'use client'

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const GameBackground = () => {
  return (
    <div className="fixed inset-x-0 top-16 bottom-0 overflow-hidden pointer-events-none -z-10">
      <svg
        className="absolute w-full h-[calc(100vh-4rem)]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Circuit board lines */}
        <motion.path
          d="M10 20 L40 20 Q50 25 60 20 L90 20 M20 30 L20 60 M80 35 L80 65"
          stroke="#e0e7ff"
          strokeWidth="0.3"
          fill="none"
          initial={{ strokeDasharray: 100, strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Animated nodes */}
        {[20, 40, 60, 80].map((x) => (
          [30, 50, 70].map((y) => (
            <motion.circle
              key={`node-${x}-${y}`}
              cx={x}
              cy={y}
              r="0.8"
              fill="#6366f1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 1
              }}
            />
          ))
        ))}

        {/* Binary code stream */}
        <motion.div
          className="absolute left-0 right-0 top-0 h-full opacity-10"
          initial={{ y: -100 }}
          animate={{ y: "100%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {Array(50).fill(null).map((_, i) => (
            <div 
              key={`binary-${i}`}
              className="text-indigo-200 text-xs font-mono whitespace-nowrap"
              style={{ marginLeft: `${Math.random() * 100}%` }}
            >
              01010101 00110011 01100110 01010101 00110011
            </div>
          ))}
        </motion.div>
      </svg>

      {/* Floating game controllers */}
      {['🎮', '🕹️'].map((emoji, i) => (
        <motion.div
          key={`controller-${i}`}
          className="absolute text-4xl opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default dynamic(() => Promise.resolve(GameBackground), {
  ssr: false,
  loading: () => <div className="fixed inset-x-0 top-16 bottom-0 bg-gray-50 -z-10" />
});