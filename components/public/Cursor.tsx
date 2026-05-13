'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.bento-card') ||
        target.closest('.service-card') ||
        target.closest('.nav-link') ||
        target.closest('.play-btn-v3');
        
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Inner Dot */}
      <motion.div 
        className="cursor-dot-v3"
        style={{
          translateX: cursorX,
          translateY: cursorY,
        }}
      />
      
      {/* Outer Ring */}
      <motion.div 
        className="cursor-ring-v3"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? 'rgba(255, 77, 0, 0.1)' : 'transparent',
          borderColor: isHovering ? 'rgba(255, 77, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)',
        }}
      />

      <style jsx global>{`
        .cursor-dot-v3 {
          position: fixed;
          top: -4px;
          left: -4px;
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          pointer-events: none;
          z-index: 999999;
        }

        .cursor-ring-v3 {
          position: fixed;
          top: -20px;
          left: -20px;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          pointer-events: none;
          z-index: 999998;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        @media (max-width: 1024px) {
          .cursor-dot-v3, .cursor-ring-v3 { display: none; }
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}
