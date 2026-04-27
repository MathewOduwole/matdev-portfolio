import React, { useEffect, useRef } from 'react';

// Custom cursor — a tiny ink dot that follows the pointer 1:1 plus a larger
// ring that lerps behind. Hover targets (buttons, links, anything with
// data-cursor="hover") swap the ring into its expanded state via CSS.
//
// When the pointer is over an element with data-cursor-theme="dark"
// (the open terminal panel, project card backs, etc.) both the dot and the
// ring switch to a light variant so they remain visible against dark surfaces.
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(max-width: 900px)').matches) return undefined;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf;

    const setClass = (ref, cls, on) => {
      if (!ref.current) return;
      if (on) ref.current.classList.add(cls);
      else ref.current.classList.remove(cls);
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
      const t = e.target;
      if (t && t.closest) {
        const onHoverable = !!t.closest('[data-cursor="hover"], a, button, input, textarea');
        const onDark = !!t.closest('[data-cursor-theme="dark"]');
        setClass(ringRef, 'hover', onHoverable);
        setClass(dotRef, 'dark', onDark);
        setClass(ringRef, 'dark', onDark);
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
};

export default Cursor;
