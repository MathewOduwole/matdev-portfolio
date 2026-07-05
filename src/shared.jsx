import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

// Reveal — motion-powered scroll reveal. Once visible, stays visible.
export const Reveal = ({ children, delay = 0, y = 26, style, className, amount = 0.2 }) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount, margin: '0px 0px -60px 0px' }}
    transition={{ duration: 0.85, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

// Back-compat alias — some call sites read better as FadeIn.
export const FadeIn = Reveal;

// Small uppercase eyebrow tag
export const Eyebrow = ({ children, color, style }) => (
  <div className="eyebrow" style={{ color: color || 'var(--ember)', ...(style || {}) }}>
    {children}
  </div>
);

// StageChip — "02 · TRAIN ▸ converged" header marker, echoing the rail.
export const StageChip = ({ code, status, color }) => (
  <div className="stage-chip" style={color ? { color } : undefined}>
    <span>{code}</span>
    {status && <span className="stage-status">{status}</span>}
  </div>
);

// SectionHead — stage chip + display headline, shared rhythm across sections.
export const SectionHead = ({ code, status, title, max = 940, color }) => (
  <>
    <Reveal><StageChip code={code} status={status} color={color} /></Reveal>
    <Reveal delay={0.07}>
      <h2
        className="display"
        style={{
          fontSize: 'clamp(42px, 5.6vw, 88px)',
          lineHeight: 0.97, marginTop: 20, maxWidth: max,
        }}
      >
        {title}
      </h2>
    </Reveal>
  </>
);

// Magnetic — wraps a child, attracts toward the cursor while hovered
export const Magnetic = ({ children, strength = 0.35, style }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onLeave = () => { el.style.transform = 'translate(0,0)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
  return (
    <div ref={ref} className="magnet" style={style}>
      {children}
    </div>
  );
};

// Editorial pill button — anchor when href is provided, button otherwise
export const Btn = ({ children, href, onClick, variant = 'primary', target, style, type = 'button', download }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 24px', borderRadius: 999,
    fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
    textDecoration: 'none', cursor: 'pointer', border: '1px solid transparent',
    transition: 'all 0.3s ease',
    letterSpacing: '0.01em',
  };
  const variants = {
    primary: { background: 'var(--ink)', color: 'var(--bg)', border: '1px solid var(--ink)' },
    ghost:   { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--line-strong)' },
    accent:  { background: 'var(--ember)', color: 'var(--bg-raised)', border: '1px solid var(--ember)' },
  };
  const finalStyle = { ...base, ...variants[variant], ...(style || {}) };
  const onEnter = (e) => { e.currentTarget.style.transform = 'translateY(-2px)'; };
  const onLeave = (e) => { e.currentTarget.style.transform = 'translateY(0)'; };
  if (href) {
    return (
      <a
        href={href}
        target={target}
        download={download}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        data-cursor="hover"
        style={finalStyle}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      data-cursor="hover"
      style={finalStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </button>
  );
};

// Metric — dashed-underline stat with a count-up when the value is numeric.
// Accepts values like "300K+", "~10×", "80+", "1M+", "24/7" (static fallback).
const parseMetric = (value) => {
  const m = /^([^0-9]*)([0-9]+(?:\.[0-9]+)?)([^0-9]*)$/.exec(String(value));
  if (!m) return null;
  return { prefix: m[1], num: parseFloat(m[2]), decimals: (m[2].split('.')[1] || '').length, suffix: m[3] };
};

export const Metric = ({ value, label, tone = 'var(--ember)', size = 26 }) => {
  const parsed = parseMetric(value);
  const ref = useRef(null);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);

  useEffect(() => {
    if (!parsed) { setDisplay(value); return undefined; }
    const el = ref.current;
    if (!el) return undefined;
    let raf;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1150;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = (parsed.num * eased).toFixed(parsed.decimals);
        setDisplay(`${parsed.prefix}${cur}${parsed.suffix}`);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div ref={ref}>
      <div className="display" style={{ fontSize: size, color: tone, lineHeight: 1 }}>{display}</div>
      <div
        className="mono"
        style={{
          fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em',
          textTransform: 'uppercase', marginTop: 5,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Hook — current scroll progress (0..1) within a section, based on its rect.
export const useSectionScroll = (ref) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
  return progress;
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
