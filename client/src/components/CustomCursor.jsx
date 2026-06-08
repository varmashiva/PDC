import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => {
      const el = e.target;
      setHovering(
        el.tagName === 'A' || el.tagName === 'BUTTON' ||
        !!el.closest('a') || !!el.closest('button') ||
        window.getComputedStyle(el).cursor === 'pointer'
      );
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: hovering ? 10 : 6,
        height: hovering ? 10 : 6,
        borderRadius: '50%',
        backgroundColor: '#111',
        transform: `translate(${pos.x - (hovering ? 5 : 3)}px, ${pos.y - (hovering ? 5 : 3)}px)`,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'width 0.15s, height 0.15s, opacity 0.15s',
        opacity: 0.85,
      }}
    />
  );
}
