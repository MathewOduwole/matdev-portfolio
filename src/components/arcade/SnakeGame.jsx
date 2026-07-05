import React, { useEffect, useRef, useState } from 'react';
import { useT } from '../../lang/LanguageContext.jsx';
import { COLS, KEY_DIRS, ROWS, createSnake, setDir, step, tickMs } from './snakeEngine.js';

const CELL = 24;
const W = COLS * CELL;
const H = ROWS * CELL;

const HI_KEY = 'arcade-snake-hi';
const readHi = () => { try { return Number(localStorage.getItem(HI_KEY)) || 0; } catch { return 0; } };

// Canvas cabinet for Packet Snake. Game state lives in refs; React state only
// mirrors the HUD (phase / score / hi-score).
const SnakeGame = () => {
  const t = useT();
  const canvasRef = useRef(null);
  const stateRef = useRef(createSnake());
  const phaseRef = useRef('ready'); // ready | playing | paused | over
  const [phase, setPhaseState] = useState('ready');
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(readHi);
  const touchRef = useRef(null);

  const setPhase = (p) => { phaseRef.current = p; setPhaseState(p); };

  const start = () => {
    stateRef.current = createSnake();
    setScore(0);
    setPhase('playing');
  };

  // Game loop — rAF drawing + accumulator-based engine ticks.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let raf;
    let last = performance.now();
    let acc = 0;

    const draw = (now) => {
      const s = stateRef.current;
      // screen
      ctx.fillStyle = '#14110D';
      ctx.fillRect(0, 0, W, H);
      // grid
      ctx.strokeStyle = 'rgba(244,239,227,0.05)';
      ctx.lineWidth = 1;
      for (let i = 1; i < COLS; i += 1) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke();
      }
      for (let j = 1; j < ROWS; j += 1) {
        ctx.beginPath(); ctx.moveTo(0, j * CELL); ctx.lineTo(W, j * CELL); ctx.stroke();
      }
      // food — pulsing packet (diamond)
      const pulse = 3.5 + Math.sin(now / 180) * 1.4;
      const fx = s.food.x * CELL + CELL / 2;
      const fy = s.food.y * CELL + CELL / 2;
      ctx.fillStyle = '#C84A12';
      ctx.beginPath();
      ctx.moveTo(fx, fy - pulse - 2);
      ctx.lineTo(fx + pulse + 2, fy);
      ctx.lineTo(fx, fy + pulse + 2);
      ctx.lineTo(fx - pulse - 2, fy);
      ctx.closePath();
      ctx.fill();
      // snake
      s.snake.forEach((seg, i) => {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? '#C84A12' : '#F4EFE3';
        const pad = isHead ? 2 : 3;
        const r = 6;
        const x = seg.x * CELL + pad;
        const y = seg.y * CELL + pad;
        const size = CELL - pad * 2;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, r);
        ctx.fill();
      });
      // score
      ctx.fillStyle = 'rgba(244,239,227,0.6)';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`PKT ${String(s.score).padStart(3, '0')}`, 10, 18);
    };

    const loop = (now) => {
      const dt = now - last;
      last = now;
      if (phaseRef.current === 'playing') {
        acc += dt;
        const ms = tickMs(stateRef.current.score);
        while (acc >= ms) {
          acc -= ms;
          step(stateRef.current);
          if (stateRef.current.ate) setScore(stateRef.current.score);
          if (stateRef.current.dead) {
            setPhase('over');
            setHi((prev) => {
              const next = Math.max(prev, stateRef.current.score);
              try { localStorage.setItem(HI_KEY, String(next)); } catch { /* ignore */ }
              return next;
            });
            break;
          }
        }
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keyboard — arrows/WASD/ZQSD steer; space/enter starts; P pauses.
  useEffect(() => {
    const onKey = (e) => {
      const inField = e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      if (inField) return;
      if (document.querySelector('.term-panel')) return; // terminal owns the keyboard
      const ph = phaseRef.current;
      if (ph === 'playing') {
        const dir = KEY_DIRS[e.key] || KEY_DIRS[e.key.toLowerCase && e.key.toLowerCase()];
        if (dir) {
          e.preventDefault();
          setDir(stateRef.current, dir);
          return;
        }
        if (e.key === 'p' || e.key === 'P') { setPhase('paused'); }
      } else if (ph === 'paused' && (e.key === 'p' || e.key === 'P' || e.key === ' ')) {
        e.preventDefault();
        setPhase('playing');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Pause when tab hidden or cabinet scrolled away.
  useEffect(() => {
    const onVis = () => { if (document.hidden && phaseRef.current === 'playing') setPhase('paused'); };
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && phaseRef.current === 'playing') setPhase('paused');
    }, { threshold: 0.2 });
    if (canvasRef.current) io.observe(canvasRef.current);
    return () => { document.removeEventListener('visibilitychange', onVis); io.disconnect(); };
  }, []);

  // Swipe steering (non-passive so we can stop the page from scrolling).
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return undefined;
    const onStart = (e) => { touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onMove = (e) => {
      if (!touchRef.current || phaseRef.current !== 'playing') return;
      e.preventDefault();
      const dx = e.touches[0].clientX - touchRef.current.x;
      const dy = e.touches[0].clientY - touchRef.current.y;
      if (Math.abs(dx) < 22 && Math.abs(dy) < 22) return;
      if (Math.abs(dx) > Math.abs(dy)) setDir(stateRef.current, { x: dx > 0 ? 1 : -1, y: 0 });
      else setDir(stateRef.current, { x: 0, y: dy > 0 ? 1 : -1 });
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
    };
  }, []);

  return (
    <div className="cabinet" data-cursor-theme="dark">
      <div className="cabinet-title" data-cursor-theme="light">
        <span style={{ color: 'var(--ink)' }}>CAB-01 · PACKET SNAKE</span>
        <span>HI {String(hi).padStart(3, '0')} · PKT {String(score).padStart(3, '0')}</span>
      </div>
      <div className="cabinet-screen">
        <canvas ref={canvasRef} style={{ aspectRatio: `${W} / ${H}` }} aria-label="Packet Snake game" />
        {phase !== 'playing' && (
          <div className="cabinet-overlay">
            {phase === 'over' ? (
              <>
                <div style={{ fontSize: 13, letterSpacing: '0.24em', color: '#FF8B73' }}>
                  {t('CONNECTION LOST', 'CONNEXION PERDUE')}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(244,239,227,0.7)' }}>
                  {t(`${score} packets delivered`, `${score} paquets livrés`)}
                </div>
              </>
            ) : phase === 'paused' ? (
              <div style={{ fontSize: 13, letterSpacing: '0.24em' }}>{t('PAUSED', 'EN PAUSE')}</div>
            ) : (
              <>
                <div style={{ fontSize: 15, letterSpacing: '0.3em' }}>PACKET SNAKE</div>
                <div style={{ fontSize: 10.5, color: 'rgba(244,239,227,0.65)', maxWidth: 300, lineHeight: 1.7 }}>
                  {t(
                    'Route the pipeline. Eat packets. Don\'t eat yourself. Edges wrap — packets route around the subnet.',
                    'Guidez le pipeline. Mangez les paquets. Ne vous mordez pas la queue. Les bords se rejoignent — les paquets font le tour du sous-réseau.'
                  )}
                </div>
              </>
            )}
            <button
              type="button"
              onClick={phase === 'paused' ? () => setPhase('playing') : start}
              data-cursor="hover"
              className="blink"
              style={{
                background: 'transparent', border: '1px solid var(--ember)',
                color: 'var(--ember)', borderRadius: 999, padding: '10px 22px',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em',
                cursor: 'pointer', textTransform: 'uppercase',
              }}
            >
              {phase === 'paused' ? t('▶ Resume', '▶ Reprendre') : t('▶ Insert coin', '▶ Insérer une pièce')}
            </button>
          </div>
        )}
      </div>
      <div className="cabinet-title">
        <span>{t('ARROWS / WASD / SWIPE', 'FLÈCHES / ZQSD / GLISSER')}</span>
        <span>{t('P = PAUSE', 'P = PAUSE')}</span>
      </div>
    </div>
  );
};

export default SnakeGame;
