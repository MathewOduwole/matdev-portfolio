import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../shared.jsx';

// Shared diagram clock — rAF-driven seconds counter that only runs while the
// element is on screen, and not at all under prefers-reduced-motion (the
// diagrams render a sensible static frame at the initial time).
export const useClock = (initial = 0.4) => {
  const ref = useRef(null);
  const [time, setTime] = useState(initial);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let raf;
    let running = false;
    const start = performance.now() - initial * 1000;
    const tick = (now) => {
      setTime((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }, { threshold: 0.15 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, time];
};

// Dots flowing along a straight segment, looping with a sine opacity fade.
export const FlowDots = ({ x1, y1, x2, y2, time, count = 3, speed = 0.28, offset = 0, r = 2.4, color = 'var(--ember)' }) => (
  <>
    {Array.from({ length: count }).map((_, k) => {
      const p = ((time * speed) + k / count + offset) % 1;
      return (
        <circle
          key={k}
          cx={x1 + (x2 - x1) * p}
          cy={y1 + (y2 - y1) * p}
          r={r}
          fill={color}
          opacity={Math.sin(p * Math.PI) * 0.95}
        />
      );
    })}
  </>
);

// Small labelled node box used by both diagrams.
export const Node = ({ x, y, w, h, label, sub, tone = 'var(--ink)', dashed = false, fontSize = 9 }) => (
  <g>
    <rect
      x={x} y={y} width={w} height={h} rx="6"
      fill="var(--bg-raised)"
      stroke={tone}
      strokeWidth="1"
      strokeDasharray={dashed ? '4 3' : 'none'}
    />
    <text
      x={x + w / 2} y={y + h / 2 + (sub ? -2 : 3.5)}
      textAnchor="middle"
      fontFamily="var(--font-mono)" fontSize={fontSize} letterSpacing="1.2"
      fill={tone}
    >
      {label}
    </text>
    {sub && (
      <text
        x={x + w / 2} y={y + h / 2 + 10}
        textAnchor="middle"
        fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="1"
        fill="var(--muted)"
      >
        {sub}
      </text>
    )}
  </g>
);

export const Wire = ({ x1, y1, x2, y2, dashed = true }) => (
  <line
    x1={x1} y1={y1} x2={x2} y2={y2}
    stroke="var(--line-strong)" strokeWidth="1"
    strokeDasharray={dashed ? '3 4' : 'none'}
  />
);
