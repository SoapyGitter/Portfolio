'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface TextProps {
  text: string;
  className?: string;
  speed?: number;
}

const Text = ({ text, className = '', speed = 30 }: TextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { once: true });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShouldAnimate(true);
    }
  }, [isInView]);

  useEffect(() => {
    if (!shouldAnimate) return;

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, shouldAnimate]);

  return (
    <motion.p
      ref={elementRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayedText}
      {shouldAnimate && displayedText.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      )}
    </motion.p>
  );
};

export default Text;