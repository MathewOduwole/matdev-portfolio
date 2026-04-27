import React, { useEffect, useRef, useState } from 'react';

// FadeIn — IntersectionObserver-driven reveal. Once visible, stays visible.
export const FadeIn = ({ children, delay = 0, y = 24, style }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        transition: `opacity 0.9s ${delay}s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s ${delay}s cubic-bezier(0.22, 1, 0.36, 1)`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        ...(style || {}),
      }}
    >
      {children}
    </div>
  );
};

// Small uppercase eyebrow tag — used above every section heading
export const Eyebrow = ({ children, color, style }) => (
  <div className="eyebrow" style={{ color: color || 'var(--ember)', ...(style || {}) }}>
    {children}
  </div>
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
export const Btn = ({ children, href, onClick, variant = 'primary', target, style, type = 'button' }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 24px', borderRadius: 999,
    fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
    textDecoration: 'none', cursor: 'none', border: '1px solid transparent',
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
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        data-cursor="hover"
        style={finalStyle}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
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

// Hook — current scroll progress (0..1) within a section, based on its rect.
// Native scroll listener; section just needs to be tall enough that
// (rect.height - viewportHeight) > 0.
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
