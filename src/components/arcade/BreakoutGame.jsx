import React, { useEffect, useRef, useState } from 'react';
import { useT } from '../../lang/LanguageContext.jsx';

const W = 504;
const H = 360;
const PADDLE_W = 84;
const PADDLE_H = 10;
const PADDLE_Y = H - 26;
const BALL_R = 6;

const HI_KEY = 'arcade-breakout-hi';
const readHi = () => { try { return Number(localStorage.getItem(HI_KEY)) || 0; } catch { return 0; } };

const ROW_TONES = ['#C84A12', '#B8860B', '#1F6F6F', '#A11D1D', '#F4EFE3'];

const buildLevel = () => {
  const cols = 9;
  const rows = 5;
  const gap = 7;
  const margin = 26;
  const top = 44;
  const bw = Math.floor((W - margin * 2 - gap * (cols - 1)) / cols);
  const bh = 16;
  const bricks = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      bricks.push({
        x: margin + c * (bw + gap),
        y: top + r * (bh + gap),
        w: bw, h: bh,
        hp: r === 0 ? 2 : 1,
        tone: ROW_TONES[r],
      });
    }
  }
  return bricks;
};

const freshState = () => ({
  paddleX: W / 2,
  ball: { x: W / 2, y: PADDLE_Y - BALL_R - 1, vx: 0, vy: 0, stuck: true },
  speed: 250,
  bricks: buildLevel(),
  trail: [],
  lives: 3,
  score: 0,
});

// Stack Breaker — paddle + ball vs the brick stack. Game state in refs,
// React state mirrors the HUD only.
const BreakoutGame = () => {
  const t = useT();
  const canvasRef = useRef(null);
  const gRef = useRef(freshState());
  const phaseRef = useRef('idle'); // idle | playing | paused | over | won
  const keysRef = useRef({ left: false, right: false });
  const [phase, setPhaseState] = useState('idle');
  const [hud, setHud] = useState({ score: 0, lives: 3 });
  const [hi, setHi] = useState(readHi);

  const setPhase = (p) => { phaseRef.current = p; setPhaseState(p); };

  const commitHi = () => {
    setHi((prev) => {
      const next = Math.max(prev, gRef.current.score);
      try { localStorage.setItem(HI_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const start = () => {
    gRef.current = freshState();
    setHud({ score: 0, lives: 3 });
    setPhase('playing');
  };

  const launch = () => {
    const g = gRef.current;
    if (!g.ball.stuck) return;
    const a = (-75 + (Math.random() * 30 - 15)) * (Math.PI / 180);
    g.ball.stuck = false;
    g.ball.vx = Math.cos(a) * g.speed;
    g.ball.vy = Math.sin(a) * g.speed;
  };

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

    const physics = (dt) => {
      const g = gRef.current;
      // paddle via held keys
      if (keysRef.current.left)  g.paddleX -= 440 * dt;
      if (keysRef.current.right) g.paddleX += 440 * dt;
      g.paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, g.paddleX));

      const b = g.ball;
      if (b.stuck) {
        b.x = g.paddleX;
        b.y = PADDLE_Y - BALL_R - 1;
        return;
      }
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // walls
      if (b.x < BALL_R)      { b.x = BALL_R; b.vx = Math.abs(b.vx); }
      if (b.x > W - BALL_R)  { b.x = W - BALL_R; b.vx = -Math.abs(b.vx); }
      if (b.y < BALL_R)      { b.y = BALL_R; b.vy = Math.abs(b.vy); }

      // paddle
      if (
        b.vy > 0 &&
        b.y + BALL_R >= PADDLE_Y && b.y + BALL_R <= PADDLE_Y + PADDLE_H + 8 &&
        b.x >= g.paddleX - PADDLE_W / 2 - BALL_R && b.x <= g.paddleX + PADDLE_W / 2 + BALL_R
      ) {
        const offset = Math.max(-1, Math.min(1, (b.x - g.paddleX) / (PADDLE_W / 2)));
        const angle = offset * (60 * Math.PI / 180);
        g.speed = Math.min(470, g.speed * 1.02);
        b.vx = Math.sin(angle) * g.speed;
        b.vy = -Math.cos(angle) * g.speed;
        b.y = PADDLE_Y - BALL_R;
      }

      // bricks
      for (let i = 0; i < g.bricks.length; i += 1) {
        const br = g.bricks[i];
        const cx = Math.max(br.x, Math.min(b.x, br.x + br.w));
        const cy = Math.max(br.y, Math.min(b.y, br.y + br.h));
        const dx = b.x - cx;
        const dy = b.y - cy;
        if (dx * dx + dy * dy <= BALL_R * BALL_R) {
          const ox = (b.x - (br.x + br.w / 2)) / (br.w / 2);
          const oy = (b.y - (br.y + br.h / 2)) / (br.h / 2);
          if (Math.abs(ox) > Math.abs(oy)) b.vx = Math.sign(ox) * Math.abs(b.vx);
          else b.vy = Math.sign(oy) * Math.abs(b.vy);
          br.hp -= 1;
          g.score += 10;
          setHud({ score: g.score, lives: g.lives });
          if (br.hp <= 0) g.bricks.splice(i, 1);
          if (g.bricks.length === 0) {
            setPhase('won');
            commitHi();
          }
          break;
        }
      }

      // floor — lose a life
      if (b.y > H + 24) {
        g.lives -= 1;
        setHud({ score: g.score, lives: g.lives });
        if (g.lives <= 0) {
          setPhase('over');
          commitHi();
        } else {
          b.stuck = true;
          g.speed = Math.max(250, g.speed * 0.9);
        }
      }

      // trail
      g.trail.push({ x: b.x, y: b.y });
      if (g.trail.length > 6) g.trail.shift();
    };

    const draw = () => {
      const g = gRef.current;
      ctx.fillStyle = '#14110D';
      ctx.fillRect(0, 0, W, H);

      // bricks
      g.bricks.forEach((br) => {
        ctx.fillStyle = br.tone;
        ctx.globalAlpha = br.hp === 2 ? 1 : 0.92;
        ctx.beginPath();
        ctx.roundRect(br.x, br.y, br.w, br.h, 3);
        ctx.fill();
        if (br.hp === 2) {
          ctx.strokeStyle = 'rgba(20,17,13,0.55)';
          ctx.lineWidth = 2;
          ctx.strokeRect(br.x + 3, br.y + 3, br.w - 6, br.h - 6);
        }
        ctx.globalAlpha = 1;
      });

      // trail
      g.trail.forEach((p, i) => {
        ctx.fillStyle = `rgba(200,74,18,${(i + 1) / g.trail.length * 0.35})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, BALL_R * ((i + 1) / g.trail.length), 0, Math.PI * 2);
        ctx.fill();
      });

      // ball
      ctx.fillStyle = '#C84A12';
      ctx.beginPath();
      ctx.arc(g.ball.x, g.ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();

      // paddle
      ctx.fillStyle = '#F4EFE3';
      ctx.beginPath();
      ctx.roundRect(g.paddleX - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H, 5);
      ctx.fill();

      // HUD
      ctx.fillStyle = 'rgba(244,239,227,0.6)';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`SCORE ${String(g.score).padStart(4, '0')}`, 10, 18);
      for (let i = 0; i < g.lives; i += 1) {
        ctx.fillRect(W - 16 - i * 14, 12, 10, 4);
      }
    };

    const loop = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      if (phaseRef.current === 'playing') physics(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard
  useEffect(() => {
    const onDown = (e) => {
      const inField = e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      if (inField) return;
      if (document.querySelector('.term-panel')) return; // terminal owns the keyboard
      const ph = phaseRef.current;
      if (ph !== 'playing' && ph !== 'paused') return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); keysRef.current.left = true; }
      if (e.key === 'ArrowRight') { e.preventDefault(); keysRef.current.right = true; }
      if (e.key === ' ') {
        e.preventDefault();
        if (ph === 'paused') setPhase('playing');
        else launch();
      }
      if ((e.key === 'p' || e.key === 'P')) {
        setPhase(ph === 'paused' ? 'playing' : 'paused');
      }
    };
    const onUp = (e) => {
      if (e.key === 'ArrowLeft')  keysRef.current.left = false;
      if (e.key === 'ArrowRight') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pointer / touch paddle control
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return undefined;
    const toGameX = (clientX) => {
      const r = el.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * W;
    };
    const onMouse = (e) => {
      gRef.current.paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, toGameX(e.clientX)));
    };
    const onTouch = (e) => {
      if (phaseRef.current !== 'playing') return;
      e.preventDefault();
      gRef.current.paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, toGameX(e.touches[0].clientX)));
    };
    const onClick = () => { if (phaseRef.current === 'playing') launch(); };
    el.addEventListener('mousemove', onMouse);
    el.addEventListener('touchmove', onTouch, { passive: false });
    el.addEventListener('touchstart', onTouch, { passive: false });
    el.addEventListener('click', onClick);
    return () => {
      el.removeEventListener('mousemove', onMouse);
      el.removeEventListener('touchmove', onTouch);
      el.removeEventListener('touchstart', onTouch);
      el.removeEventListener('click', onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-pause off-screen / hidden tab
  useEffect(() => {
    const onVis = () => { if (document.hidden && phaseRef.current === 'playing') setPhase('paused'); };
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && phaseRef.current === 'playing') setPhase('paused');
    }, { threshold: 0.2 });
    if (canvasRef.current) io.observe(canvasRef.current);
    return () => { document.removeEventListener('visibilitychange', onVis); io.disconnect(); };
  }, []);

  return (
    <div className="cabinet" data-cursor-theme="dark">
      <div className="cabinet-title" data-cursor-theme="light">
        <span style={{ color: 'var(--ink)' }}>CAB-02 · STACK BREAKER</span>
        <span>HI {String(hi).padStart(4, '0')} · {String(hud.score).padStart(4, '0')} · {'▮'.repeat(Math.max(0, hud.lives))}</span>
      </div>
      <div className="cabinet-screen">
        <canvas ref={canvasRef} style={{ aspectRatio: `${W} / ${H}` }} aria-label="Stack Breaker game" />
        {phase !== 'playing' && (
          <div className="cabinet-overlay">
            {phase === 'over' ? (
              <>
                <div style={{ fontSize: 13, letterSpacing: '0.24em', color: '#FF8B73' }}>
                  {t('STACK OVERFLOW', 'STACK OVERFLOW')}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(244,239,227,0.7)' }}>
                  {t(`final score ${hud.score}`, `score final ${hud.score}`)}
                </div>
              </>
            ) : phase === 'won' ? (
              <>
                <div style={{ fontSize: 13, letterSpacing: '0.24em', color: '#8FBF6F' }}>
                  {t('STACK CLEARED ✓', 'STACK NETTOYÉE ✓')}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(244,239,227,0.7)' }}>
                  {t('deployed to production', 'déployé en production')}
                </div>
              </>
            ) : phase === 'paused' ? (
              <div style={{ fontSize: 13, letterSpacing: '0.24em' }}>{t('PAUSED', 'EN PAUSE')}</div>
            ) : (
              <>
                <div style={{ fontSize: 15, letterSpacing: '0.3em' }}>STACK BREAKER</div>
                <div style={{ fontSize: 10.5, color: 'rgba(244,239,227,0.65)', maxWidth: 300, lineHeight: 1.7 }}>
                  {t(
                    'Clear the legacy stack, one brick at a time. Top row is technical debt — it takes two hits.',
                    'Nettoyez la stack legacy, brique par brique. La rangée du haut, c\'est de la dette technique — deux coups.'
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
        <span>{t('MOUSE / TOUCH / ARROWS', 'SOURIS / TACTILE / FLÈCHES')}</span>
        <span>{t('SPACE = LAUNCH · P = PAUSE', 'ESPACE = LANCER · P = PAUSE')}</span>
      </div>
    </div>
  );
};

export default BreakoutGame;
