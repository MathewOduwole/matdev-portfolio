import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '../lang/LanguageContext.jsx';

// The pipeline rail — a single line running the full height of the page.
// Sections declare themselves with [data-stage-label]; the rail measures
// their offsets and places a node per stage. The solid fill tracks scroll
// (the system "runs" as you read), packets drift down it continuously.
const Rail = () => {
  const { lang } = useLang();
  const railRef = useRef(null);
  const fillRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [fillPx, setFillPx] = useState(0);

  // Measure section anchors. Re-runs on resize, content growth (fonts,
  // accordions) via ResizeObserver, and language switches (labels change).
  useEffect(() => {
    let raf;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const els = Array.from(document.querySelectorAll('[data-stage-label]'));
        setNodes(els.map((el) => ({
          label: el.getAttribute('data-stage-label'),
          y: el.getBoundingClientRect().top + window.scrollY + 96,
        })));
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
    };
  }, [lang]);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = railRef.current;
        if (!el) return;
        const h = el.offsetHeight;
        setFillPx(Math.max(0, Math.min(h, window.scrollY + window.innerHeight * 0.45)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="rail" ref={railRef} aria-hidden="true">
      <div className="rail-line" />
      <div className="rail-fill" ref={fillRef} style={{ height: fillPx }} />
      <span className="rail-packet" style={{ '--dur': '14s', '--delay': '0s' }} />
      <span className="rail-packet" style={{ '--dur': '19s', '--delay': '-6s' }} />
      <span className="rail-packet" style={{ '--dur': '23s', '--delay': '-14s' }} />
      {nodes.map((n) => (
        <div
          key={n.label}
          className={`rail-node${fillPx >= n.y ? ' active' : ''}`}
          style={{ top: n.y }}
        >
          <span className="rail-node-label">{n.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Rail;
