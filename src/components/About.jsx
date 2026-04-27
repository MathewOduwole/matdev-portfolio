import React, { useEffect, useRef, useState } from 'react';
import { Eyebrow, FadeIn } from '../shared.jsx';
import { useLang, useT } from '../lang/LanguageContext.jsx';

// Avatar — fetches the SVG from /public, parses it via DOMParser, and
// mounts the parsed root node into the wrap div via replaceChildren so we
// can animate inner layers by id (idle bob, cursor parallax on the head and
// hair-front, eye-pupil tracking, occasional blinks). React doesn't manage
// the SVG's children — the imperative mount lets us write directly to
// element attributes each frame without React reconciliation overhead.
const AnimatedAvatar = () => {
  const wrapRef = useRef(null);
  const [svgMarkup, setSvgMarkup] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch('/avatar-portrait.svg')
      .then((r) => r.text())
      .then((t) => { if (alive) setSvgMarkup(t); })
      .catch(() => { /* swallowed — avatar is decorative */ });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!svgMarkup || !wrapRef.current) return undefined;
    const root = wrapRef.current;

    const parsed = new DOMParser().parseFromString(svgMarkup, 'image/svg+xml');
    const svgNode = parsed.documentElement;
    if (!svgNode || svgNode.nodeName === 'parsererror') return undefined;
    root.replaceChildren(svgNode);

    const card = root.parentElement;
    const head = svgNode.querySelector('#av-head');
    const hairFront = svgNode.querySelector('#av-hair-front');
    const eyes = svgNode.querySelector('#av-eyes');
    const pupilL = svgNode.querySelector('#av-pupil-l');
    const pupilR = svgNode.querySelector('#av-pupil-r');
    const shadow = svgNode.querySelector('#av-shadow');
    if (!head) return undefined;

    if (card) {
      card.style.perspective = '1200px';
      card.style.transformStyle = 'preserve-3d';
      root.style.transformStyle = 'preserve-3d';
      root.style.willChange = 'transform';
      root.style.transition = 'transform 80ms linear';
    }

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e) => {
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const reach = 600;
      target.x = Math.max(-1, Math.min(1, (e.clientX - cx) / reach));
      target.y = Math.max(-1, Math.min(1, (e.clientY - cy) / reach));
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    let blinkAt = performance.now() + 2500;
    let eyesScaleY = 1;

    const tick = (t) => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;

      const bobY = Math.sin(t * 0.0015) * 6;
      const bobR = Math.sin(t * 0.0011) * 1.2;

      const rotY = current.x * 14;
      const rotX = -current.y * 10;
      root.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      const px = 300;
      const py = 420;
      const tx = current.x * 22;
      const ty = current.y * 14 + bobY;
      const rot = current.x * 6 + bobR;
      head.setAttribute('transform', `translate(${tx} ${ty}) rotate(${rot} ${px} ${py})`);

      if (hairFront) {
        hairFront.setAttribute('transform', `translate(${current.x * 8} ${current.y * 4})`);
      }

      if (shadow) {
        const lift = (bobY + ty * 0.3) * 0.4;
        const scale = 1 - lift * 0.012;
        shadow.setAttribute('transform', `translate(${tx * 0.4} 0) scale(${scale} ${scale})`);
        shadow.style.transformOrigin = '300px 940px';
        shadow.style.opacity = String(0.22 - lift * 0.005);
      }

      if (pupilL && pupilR) {
        const ex = current.x * 4;
        const ey = current.y * 2;
        const tr = `translate(${ex} ${ey})`;
        pupilL.setAttribute('transform', tr);
        pupilR.setAttribute('transform', tr);
      }

      if (eyes) {
        const dt = t - blinkAt;
        if (dt > 0 && dt < 140) {
          eyesScaleY = 0.1;
        } else if (dt >= 140 && dt < 220) {
          eyesScaleY = 1;
          if (dt > 200) blinkAt = t + 2200 + Math.random() * 3000;
        } else {
          eyesScaleY = 1;
        }
        eyes.style.transformOrigin = '300px 514px';
        eyes.style.transform = `scaleY(${eyesScaleY})`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [svgMarkup]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        display: 'block',
      }}
    />
  );
};

const TOOLS = [
  'Python', 'PyTorch', 'scikit-learn', 'Hugging Face', 'pandas', 'NumPy',
  'SQL', 'FastAPI', 'Node', 'React', 'Docker', 'GitHub Actions',
  'AWS', 'GCP', 'LangChain', 'Tableau',
];

const About = () => {
  const t = useT();
  const { lang } = useLang();

  const glance = [
    [t('Based',         'Basé à'),         t('Nantes, FR',             'Nantes, FR')],
    [t('Focus',         'Spécialité'),     t('Data · ML · Full-stack', 'Data · ML · Full-stack')],
    [t('Languages',     'Langues'),        'EN · FR · YO'],
    [t('Worked across', 'A travaillé sur'), t('3 continents',          '3 continents')],
    [t('Available',     'Disponibilité'),  t('Open to roles',          'Ouvert aux opportunités')],
  ];

  return (
    <section id="about" data-screen-label="About" className="section-pad" style={{ position: 'relative', background: 'var(--bg)' }}>
      <div className="container">
        <FadeIn><Eyebrow>{t('02 — About', '02 — À propos')}</Eyebrow></FadeIn>

        <div
          style={{
            display: 'grid', gridTemplateColumns: '1.3fr 0.9fr',
            gap: 80, marginTop: 40, alignItems: 'start',
          }}
        >
          <div>
            <FadeIn delay={0.05}>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', maxWidth: 720, lineHeight: 1.25 }}>
                {lang === 'fr' ? (
                  <>Je construis là où <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>la recherche rencontre la production</em> — et le travail doit voyager.</>
                ) : (
                  <>I build where <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>research meets production</em> — and the work has to travel.</>
                )}
              </h2>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div
                style={{
                  marginTop: 44, color: 'var(--ink-soft)', fontSize: 18, lineHeight: 1.7,
                  maxWidth: 660, fontFamily: 'var(--font-sans)',
                }}
              >
                {lang === 'fr' ? (
                  <>
                    <p>
                      Formé en big data et management à{' '}
                      <a className="inline-link" href="https://www.ec-nantes.fr/" target="_blank" rel="noreferrer">l'École Centrale de Nantes</a>{' '}
                      &amp;{' '}
                      <a className="inline-link" href="https://www.audencia.com/" target="_blank" rel="noreferrer">Audencia</a>,
                      j'ai déployé des systèmes de machine learning sur trois continents — fine-tuning de{' '}
                      <span style={{ color: 'var(--ink)' }}>LLMs</span> à <span style={{ color: 'var(--ink)' }}>Austin</span>,
                      construction de pipelines de données à <span style={{ color: 'var(--ink)' }}>Miami</span>, et direction d'une
                      plateforme de recherche phare —{' '}
                      <a className="inline-link" href="https://gloreaa.com" target="_blank" rel="noreferrer">Glorea</a>{' '}
                      — à <span style={{ color: 'var(--ink)' }}>Nantes</span>.
                    </p>
                    <p style={{ marginTop: 18 }}>
                      Je m'attache à la chaîne complète. Ingestion propre en{' '}
                      <span style={{ color: 'var(--ink)' }}>Python</span> avec{' '}
                      <span style={{ color: 'var(--ink)' }}>pandas</span>,{' '}
                      <span style={{ color: 'var(--ink)' }}>NumPy</span> et{' '}
                      <span style={{ color: 'var(--ink)' }}>SQL</span>. Feature engineering et modélisation avec{' '}
                      <span style={{ color: 'var(--ink)' }}>scikit-learn</span>,{' '}
                      <span style={{ color: 'var(--ink)' }}>PyTorch</span> et{' '}
                      <span style={{ color: 'var(--ink)' }}>Hugging Face</span>.
                      Services en production —{' '}
                      <span style={{ color: 'var(--ink)' }}>FastAPI</span>,{' '}
                      <span style={{ color: 'var(--ink)' }}>Docker</span>,{' '}
                      <span style={{ color: 'var(--ink)' }}>GitHub Actions</span>{' '}
                      sur <span style={{ color: 'var(--ink)' }}>AWS</span> et{' '}
                      <span style={{ color: 'var(--ink)' }}>GCP</span>.
                    </p>
                    <p style={{ marginTop: 18 }}>
                      J'ai donné des cours particuliers à <span style={{ color: 'var(--ink)' }}>28 étudiants</span> en Python et en analyse à l'École Centrale,
                      indexé <span style={{ color: 'var(--ink)' }}>300K+ offres de recherche</span>, et accompagné
                      les <span style={{ color: 'var(--ink)' }}>100 premiers utilisateurs</span> de{' '}
                      <a className="inline-link" href="https://gloreaa.com" target="_blank" rel="noreferrer">Glorea</a>
                      {' '}— un espace de travail unifié pour les chercheurs que je dirige de bout en bout.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Trained in big data and management at{' '}
                      <a className="inline-link" href="https://www.ec-nantes.fr/" target="_blank" rel="noreferrer">École Centrale de Nantes</a>{' '}
                      &amp;{' '}
                      <a className="inline-link" href="https://www.audencia.com/" target="_blank" rel="noreferrer">Audencia</a>,
                      I've shipped machine-learning systems across three continents — fine-tuning{' '}
                      <span style={{ color: 'var(--ink)' }}>LLMs</span> in <span style={{ color: 'var(--ink)' }}>Austin</span>,
                      building data pipelines in <span style={{ color: 'var(--ink)' }}>Miami</span>, and leading a
                      research-platform flagship —{' '}
                      <a className="inline-link" href="https://gloreaa.com" target="_blank" rel="noreferrer">Glorea</a>{' '}
                      — in <span style={{ color: 'var(--ink)' }}>Nantes</span>.
                    </p>
                    <p style={{ marginTop: 18 }}>
                      I care about the full arc. Clean ingestion in{' '}
                      <span style={{ color: 'var(--ink)' }}>Python</span> with{' '}
                      <span style={{ color: 'var(--ink)' }}>pandas</span>,{' '}
                      <span style={{ color: 'var(--ink)' }}>NumPy</span> and{' '}
                      <span style={{ color: 'var(--ink)' }}>SQL</span>. Feature engineering and model work in{' '}
                      <span style={{ color: 'var(--ink)' }}>scikit-learn</span>,{' '}
                      <span style={{ color: 'var(--ink)' }}>PyTorch</span> and{' '}
                      <span style={{ color: 'var(--ink)' }}>Hugging Face</span>.
                      Services that ship —{' '}
                      <span style={{ color: 'var(--ink)' }}>FastAPI</span>,{' '}
                      <span style={{ color: 'var(--ink)' }}>Docker</span>,{' '}
                      <span style={{ color: 'var(--ink)' }}>GitHub Actions</span>{' '}
                      on <span style={{ color: 'var(--ink)' }}>AWS</span> and{' '}
                      <span style={{ color: 'var(--ink)' }}>GCP</span>.
                    </p>
                    <p style={{ marginTop: 18 }}>
                      I've tutored <span style={{ color: 'var(--ink)' }}>28 students</span> in Python and analysis at École Centrale,
                      indexed <span style={{ color: 'var(--ink)' }}>300K+ research jobs</span>, and onboarded
                      the first <span style={{ color: 'var(--ink)' }}>100+ users</span> of{' '}
                      <a className="inline-link" href="https://gloreaa.com" target="_blank" rel="noreferrer">Glorea</a>
                      {' '}— a unified workspace for researchers I lead end-to-end.
                    </p>
                  </>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div style={{ marginTop: 44, maxWidth: 660 }}>
                <div className="eyebrow" style={{ color: 'var(--muted)', marginBottom: 14 }}>
                  {t('Tools I reach for', 'Mes outils de prédilection')}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TOOLS.map((tool) => (
                    <span
                      key={tool}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
                        padding: '6px 12px', border: '1px solid var(--line-strong)', borderRadius: 999,
                        color: 'var(--ink-soft)', background: 'var(--bg-raised)',
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <div>
            <FadeIn delay={0.2}>
              <div
                style={{
                  padding: 28, border: '1px solid var(--line-strong)', borderRadius: 12,
                  background: 'var(--bg-raised)',
                }}
              >
                <div
                  style={{
                    width: '100%', aspectRatio: '4/5', borderRadius: 8,
                    background: 'var(--bg)', border: '1px solid var(--line)',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <AnimatedAvatar />
                  <div
                    style={{
                      position: 'absolute', bottom: 14, left: 14, right: 14,
                      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
                      color: 'var(--muted)', textTransform: 'uppercase',
                      display: 'flex',
                      pointerEvents: 'none',
                    }}
                  >
                    <span>Mathew · Nantes</span>
                  </div>
                </div>

                <div className="eyebrow" style={{ color: 'var(--amber)', marginTop: 22 }}>
                  {t('At a glance', 'En bref')}
                </div>
                <dl style={{ marginTop: 16, display: 'grid', gap: 14, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                  {glance.map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: 'flex', justifyContent: 'space-between', gap: 14,
                        borderBottom: '1px dashed var(--line)', paddingBottom: 10,
                      }}
                    >
                      <dt style={{ color: 'var(--muted)' }}>{k}</dt>
                      <dd style={{ color: 'var(--ink)', textAlign: 'right' }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
