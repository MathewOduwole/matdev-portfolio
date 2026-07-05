import React, { useEffect, useRef, useState } from 'react';
import { useClock } from './diagrams/useClock.jsx';

// FIG. 01 — the engineer. A hand-drawn SVG character in the site's ink-on-
// paper style, animated per-frame: breathing, head parallax toward the
// cursor, eye tracking, deterministic blinks, brow-raise + wider smile on
// hover, and data packets orbiting the head (some pass behind it).
// Re-renders on the shared visibility-gated clock; static under
// prefers-reduced-motion.

const SKIN = '#8A5A3B';
const SKIN_SHADE = '#7A4C30';
const HAIR = '#221910';
const HAIR_HI = '#4A3826';
const TEE = '#AFC6D8';
const TEE_SHADE = '#93AFC6';
const INK = '#14110D';

const AvatarFig = () => {
  const [ref, time] = useClock(0.4);
  const [hovered, setHovered] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0, hover: 0 });

  useEffect(() => {
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      target.current.x = Math.max(-1, Math.min(1, (e.clientX - cx) / 500));
      target.current.y = Math.max(-1, Math.min(1, (e.clientY - cy) / 500));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth-follow — the clock re-renders every frame, so a small lerp per
  // render gives the easing without extra machinery.
  cur.current.x += (target.current.x - cur.current.x) * 0.07;
  cur.current.y += (target.current.y - cur.current.y) * 0.07;
  cur.current.hover += ((hovered ? 1 : 0) - cur.current.hover) * 0.09;

  const px = cur.current.x;
  const py = cur.current.y;
  const hov = cur.current.hover;

  // Idle motion
  const breathe = Math.sin(time * 1.15) * 2.2;
  const bob = Math.sin(time * 1.5 + 0.8) * 3.2;

  // Head pose
  const tx = px * 15;
  const ty = py * 9 + bob;
  const rot = px * 5;

  // Eyes
  const ex = px * 4.2;
  const ey = py * 2.6;

  // Deterministic blink: every ~4.2s, occasionally doubled
  const cycle = time % 4.2;
  const beat = Math.floor(time / 4.2);
  let blink = 1;
  if (cycle < 0.13) blink = 0.08;
  else if (beat % 3 === 0 && cycle > 0.24 && cycle < 0.37) blink = 0.08;

  // Hover expression
  const browLift = hov * 6;
  const smileW = 24 + hov * 5;
  const smileD = 470 + hov * 9;

  // Orbiting packets — pass behind the head on the far side of the ellipse
  const ORBIT = { cx: 300, cy: 355, rx: 238, ry: 78, tilt: (-10 * Math.PI) / 180 };
  const packets = [0, 1, 2].map((k) => {
    const a = time * 0.55 + (k * Math.PI * 2) / 3;
    const ox = Math.cos(a) * ORBIT.rx;
    const oy = Math.sin(a) * ORBIT.ry;
    return {
      x: ORBIT.cx + ox * Math.cos(ORBIT.tilt) - oy * Math.sin(ORBIT.tilt),
      y: ORBIT.cy + ox * Math.sin(ORBIT.tilt) + oy * Math.cos(ORBIT.tilt),
      behind: Math.sin(a) < 0,
      r: 3.4 + Math.sin(a) * 1.1,
    };
  });

  const Packet = ({ p }) => (
    <circle cx={p.x} cy={p.y} r={Math.max(2.2, p.r)} fill="var(--ember)" opacity={p.behind ? 0.45 : 0.9} />
  );

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'absolute', inset: 0 }}
    >
      <svg viewBox="0 0 600 740" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-label="Illustrated portrait of Mathew">
        <defs>
          <radialGradient id="avHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo + orbit path */}
        <circle cx="300" cy="330" r={215 + Math.sin(time * 1.3) * 6} fill="url(#avHalo)" />
        <ellipse
          cx={ORBIT.cx} cy={ORBIT.cy} rx={ORBIT.rx} ry={ORBIT.ry}
          transform={`rotate(-10 ${ORBIT.cx} ${ORBIT.cy})`}
          fill="none" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="3 6"
        />

        {/* Packets behind the character */}
        {packets.filter((p) => p.behind).map((p, i) => <Packet key={`pb-${i}`} p={p} />)}

        {/* Ground shadow */}
        <ellipse
          cx="300" cy="712" rx={150 - breathe * 2} ry="16"
          fill={INK} opacity={0.13 - breathe * 0.004}
        />

        {/* Character (breathes as one) */}
        <g transform={`translate(0 ${breathe})`}>
          {/* Torso */}
          <g>
            <path
              d="M 168 740 L 168 648 C 168 578 222 546 300 546 C 378 546 432 578 432 648 L 432 740 Z"
              fill={TEE} stroke={INK} strokeWidth="3"
            />
            {/* Sleeve seams + hem shading */}
            <path d="M 208 566 C 196 590 190 615 189 648" fill="none" stroke={TEE_SHADE} strokeWidth="3" />
            <path d="M 392 566 C 404 590 410 615 411 648" fill="none" stroke={TEE_SHADE} strokeWidth="3" />
            <path d="M 168 700 L 432 700" stroke={TEE_SHADE} strokeWidth="3" opacity="0.6" />
            {/* Tiny ember chest mark — a packet pin */}
            <circle cx="352" cy="612" r="6" fill="var(--ember)" opacity="0.9" />
          </g>

          {/* Neck */}
          <path d="M 276 486 L 276 542 Q 300 556 324 542 L 324 486 Z" fill={SKIN} stroke={INK} strokeWidth="3" />
          <path d="M 276 500 Q 300 514 324 500" fill="none" stroke={SKIN_SHADE} strokeWidth="3" opacity="0.7" />
          {/* Collar */}
          <path d="M 266 540 Q 300 566 334 540" fill="none" stroke={INK} strokeWidth="3" />

          {/* Head (parallax group) */}
          <g transform={`translate(${tx} ${ty}) rotate(${rot} 300 430)`}>
            {/* Ears */}
            <circle cx="234" cy="408" r="15" fill={SKIN} stroke={INK} strokeWidth="3" />
            <circle cx="366" cy="408" r="15" fill={SKIN} stroke={INK} strokeWidth="3" />

            {/* Face */}
            <rect x="238" y="302" width="124" height="192" rx="58" fill={SKIN} stroke={INK} strokeWidth="3" />

            {/* Hair — tall loc updo with tie */}
            <g transform={`translate(${px * 6} ${py * 3})`}>
              <rect x="240" y="118" width="120" height="226" rx="56" fill={HAIR} stroke={INK} strokeWidth="3" />
              {/* Loc texture */}
              <path d="M 266 142 C 260 190 266 245 262 318" fill="none" stroke={HAIR_HI} strokeWidth="3" opacity="0.6" />
              <path d="M 300 130 C 296 190 304 252 300 324" fill="none" stroke={HAIR_HI} strokeWidth="3" opacity="0.6" />
              <path d="M 334 142 C 340 190 334 245 338 318" fill="none" stroke={HAIR_HI} strokeWidth="3" opacity="0.6" />
              {/* Top knots */}
              <circle cx="262" cy="122" r="14" fill={HAIR} stroke={INK} strokeWidth="3" />
              <circle cx="282" cy="106" r="12" fill={HAIR} stroke={INK} strokeWidth="3" />
              <circle cx="300" cy="100" r="15" fill={HAIR} stroke={INK} strokeWidth="3" />
              <circle cx="318" cy="106" r="12" fill={HAIR} stroke={INK} strokeWidth="3" />
              <circle cx="338" cy="122" r="14" fill={HAIR} stroke={INK} strokeWidth="3" />
              {/* Hair tie */}
              <rect x="246" y="324" width="108" height="15" rx="7.5" fill="var(--ember)" stroke={INK} strokeWidth="2.5" />
            </g>
            {/* Fringe over the forehead */}
            <path
              d="M 244 340 Q 300 306 356 340 L 356 352 Q 300 322 244 352 Z"
              fill={HAIR}
              transform={`translate(${px * 7} ${py * 3.5})`}
            />

            {/* Brows */}
            <g transform={`translate(0 ${-browLift})`}>
              <path d="M 256 378 Q 274 369 292 376" fill="none" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 308 376 Q 326 369 344 378" fill="none" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
            </g>

            {/* Eyes (blink via scaleY around the eye line) */}
            <g transform={`translate(0 398) scale(1 ${blink}) translate(0 -398)`}>
              <ellipse cx="274" cy="400" rx="13.5" ry="9.5" fill="#FBF7EC" stroke={INK} strokeWidth="2.5" />
              <ellipse cx="326" cy="400" rx="13.5" ry="9.5" fill="#FBF7EC" stroke={INK} strokeWidth="2.5" />
              <g transform={`translate(${ex} ${ey})`}>
                <circle cx="274" cy="400" r="5.4" fill={INK} />
                <circle cx="326" cy="400" r="5.4" fill={INK} />
                <circle cx="272" cy="398" r="1.7" fill="#FBF7EC" />
                <circle cx="324" cy="398" r="1.7" fill="#FBF7EC" />
              </g>
            </g>

            {/* Nose */}
            <path d="M 300 408 L 295 434 Q 300 441 308 435" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />

            {/* Smile — widens and deepens on hover */}
            <path
              d={`M ${300 - smileW} 454 Q 300 ${smileD} ${300 + smileW} 454`}
              fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round"
            />
            {/* Chin shade */}
            <ellipse cx="300" cy="480" rx="19" ry="7" fill={HAIR} opacity="0.1" />
          </g>
        </g>

        {/* Packets in front of the character */}
        {packets.filter((p) => !p.behind).map((p, i) => <Packet key={`pf-${i}`} p={p} />)}
      </svg>
    </div>
  );
};

export default AvatarFig;
