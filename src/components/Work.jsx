import React, { useEffect, useRef, useState } from 'react';
import { Btn, Eyebrow } from '../shared.jsx';
import { useT } from '../lang/LanguageContext.jsx';

// Card width is fixed at 560px. With 28px gap, one "page" of horizontal
// scroll is exactly card+gap. Reused by the prev/next button handlers.
const CARD_WIDTH = 560;
const CARD_GAP = 28;

// Single project card — flippable on click. Front shows headline + metrics,
// back shows the full body + stack chips + visit link.
const ProjectCard = ({ p }) => {
  const t = useT();
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      data-cursor="hover"
      data-card="project"
      onClick={() => setFlipped((f) => !f)}
      style={{
        flex: '0 0 auto', width: CARD_WIDTH, height: 640,
        position: 'relative',
        perspective: '1600px',
        WebkitPerspective: '1600px',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          willChange: 'transform',
        }}
      >
        {/* Front */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: 'var(--bg-raised)',
            border: '1px solid var(--line-strong)',
            borderRadius: 14,
            padding: 36, display: 'flex', flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="mono" style={{ fontSize: 64, color: p.tone, lineHeight: 1, fontWeight: 300 }}>{p.num}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em', textAlign: 'right', maxWidth: 220 }}>{p.tag}</div>
          </div>

          <h3 className="display" style={{ fontSize: 56, lineHeight: 0.98, marginTop: 32 }}>{p.title}</h3>
          <div style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{p.role}</div>

          <p
            style={{
              marginTop: 28, color: 'var(--ink)',
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: 22, lineHeight: 1.35,
            }}
          >“{p.oneLiner}”</p>

          <div
            style={{
              marginTop: 'auto', paddingTop: 24,
              borderTop: '1px dashed var(--line-strong)',
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
            }}
          >
            {p.metrics.map(([v, l]) => (
              <div key={l}>
                <div className="display" style={{ fontSize: 26, color: p.tone, lineHeight: 1 }}>{v}</div>
                <div
                  className="mono"
                  style={{
                    fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em',
                    textTransform: 'uppercase', marginTop: 4,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>

          <div
            className="mono"
            style={{
              fontSize: 10, color: 'var(--muted)', letterSpacing: '0.16em',
              marginTop: 20, textTransform: 'uppercase',
            }}
          >
            {t('↻ Click to flip · details on back', '↻ Cliquez pour retourner · détails au verso')}
          </div>
        </div>

        {/* Back */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: 'var(--ink)', color: 'var(--bg)',
            border: '1px solid var(--ink)',
            borderRadius: 14,
            padding: 36, display: 'flex', flexDirection: 'column',
            transform: 'rotateY(180deg)',
          }}
          data-cursor-theme="dark"
        >
          <div className="mono" style={{ fontSize: 10, color: p.tone, letterSpacing: '0.14em' }}>
            {p.num} / {t('DETAIL', 'DÉTAIL')}
          </div>
          <h3 className="display" style={{ fontSize: 36, marginTop: 16, lineHeight: 1 }}>{p.title}</h3>

          <p style={{ marginTop: 24, fontSize: 15, lineHeight: 1.6, color: 'rgba(244,239,227,0.78)' }}>{p.body}</p>

          <div style={{ marginTop: 28 }}>
            <div
              className="mono"
              style={{
                fontSize: 10, letterSpacing: '0.18em',
                color: p.tone, textTransform: 'uppercase', marginBottom: 12,
              }}
            >
              Stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="mono"
                  style={{
                    fontSize: 11, padding: '5px 10px', borderRadius: 999,
                    border: '1px solid rgba(244,239,227,0.2)', color: 'var(--bg)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              onClick={(e) => e.stopPropagation()}
              style={{
                marginTop: 'auto', paddingTop: 24,
                color: p.tone, textDecoration: 'none', fontSize: 13,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
              }}
            >
              {t('VISIT', 'VISITER')} → {p.linkLabel}
            </a>
          )}
          <div
            className="mono"
            style={{
              fontSize: 10, color: 'rgba(244,239,227,0.4)', letterSpacing: '0.16em',
              marginTop: 16, textTransform: 'uppercase',
            }}
          >
            {t('↻ Click to flip back', '↻ Cliquez pour retourner')}
          </div>
        </div>
      </div>
    </div>
  );
};

// Round nav button used for prev/next horizontal scroll
const NavBtn = ({ disabled, onClick, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    data-cursor="hover"
    aria-label={label}
    style={{
      width: 48, height: 48, borderRadius: 999,
      border: '1px solid var(--line-strong)',
      background: 'var(--bg-raised)',
      color: 'var(--ink)',
      cursor: disabled ? 'not-allowed' : 'none',
      opacity: disabled ? 0.3 : 1,
      transition: 'opacity 0.2s, border-color 0.2s, background 0.2s',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 500,
    }}
    onMouseEnter={(e) => {
      if (disabled) return;
      e.currentTarget.style.borderColor = 'var(--ember)';
      e.currentTarget.style.color = 'var(--ember)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--line-strong)';
      e.currentTarget.style.color = 'var(--ink)';
    }}
  >
    {children}
  </button>
);

// Selected work — horizontally scrollable card deck. Vertical page scroll
// passes through normally (no scroll-jacking). Users can drag the strip,
// trackpad-swipe, use the visible scrollbar, or click the prev/next buttons.
const Work = () => {
  const t = useT();
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const PROJECTS = [
    {
      id: 'glorea', num: '01', title: 'Glorea',
      tag: t('FLAGSHIP · 04/2024 — PRESENT', 'PROJET PHARE · 04/2024 — PRÉSENT'),
      role: t('Full-stack · Data engineering · AWS/Azure', 'Full-stack · Ingénierie de données · AWS/Azure'),
      oneLiner: t(
        'A research workspace where a million papers and 300K jobs live in one place.',
        "Un espace de travail pour la recherche où un million d'articles et 300K offres vivent en un seul endroit."
      ),
      body: t(
        'Built the full-stack research platform from zero — React + Node, pipelines ingesting and serving 1M+ research papers and 300,000+ job postings, migrated the stack from Azure to a hybrid Hetzner + Cloudflare + Vercel architecture, and led SEO & ads driving the first 100+ active users.',
        "Construction de la plateforme full-stack de recherche depuis zéro — React + Node, pipelines ingérant et servant 1M+ d'articles scientifiques et 300 000+ offres d'emploi, migration de la stack d'Azure vers une architecture hybride Hetzner + Cloudflare + Vercel, et pilotage du SEO & des annonces ayant amené les 100 premiers utilisateurs actifs."
      ),
      metrics: [
        ['1M+',  t('papers',         'articles')],
        ['300K+', t('jobs',          'emplois')],
        ['100+', t('first users',    'premiers utilisateurs')],
        ['5',    t('cloud services', 'services cloud')],
      ],
      stack: ['React', 'Node', 'Python', 'Hetzner', 'Cloudflare', 'Azure', 'PostgreSQL'],
      link: 'https://gloreaa.com', linkLabel: 'gloreaa.com',
      tone: 'var(--ember)',
    },
    {
      id: 'stealth', num: '02', title: 'Stealth Power',
      tag: t('DATA SCIENTIST · 02–07/2025 · AUSTIN', 'DATA SCIENTIST · 02–07/2025 · AUSTIN'),
      role: t('LLM fine-tuning · ML pipelines · AI agents', 'Fine-tuning LLM · Pipelines ML · Agents IA'),
      oneLiner: t(
        'Fine-tuned LLMs for NLP, built the data flow beneath them, shipped a one-prompt DB-querying agent.',
        "Fine-tuning de LLMs pour le NLP, construction du flux de données sous-jacent, livraison d'un agent qui interroge la base de données en un seul prompt."
      ),
      body: t(
        'Fine-tuned LLMs to improve NLP applications. Built and integrated APIs for real-time data flow. Cleaned and processed sensor data for modeling. Shipped an AI agent that turns single-prompt questions into clear, actionable insights, plus dashboards for non-technical stakeholders.',
        "Fine-tuning de LLMs pour améliorer les applications NLP. Construction et intégration d'APIs pour un flux de données en temps réel. Nettoyage et traitement de données capteurs pour la modélisation. Livraison d'un agent IA qui transforme des questions en un seul prompt en analyses claires et actionnables, avec des tableaux de bord pour les parties prenantes non techniques."
      ),
      metrics: [
        ['LLM',       t('fine-tuning', 'fine-tuning')],
        ['Real-time', t('data flow',   'flux temps réel')],
        ['1-prompt',  t('DB agent',    'agent BDD')],
        ['AWS',       t('cloud infra', 'infra cloud')],
      ],
      stack: ['Python', 'LLMs', 'React', 'Node', 'SQL', 'AWS', 'pandas'],
      link: null, linkLabel: null,
      tone: 'var(--teal)',
    },
    {
      id: 'nerds', num: '03', title: 'Nerds Support',
      tag: t('DEVOPS · 06/2024 — 01/2025 · MIAMI', 'DEVOPS · 06/2024 — 01/2025 · MIAMI'),
      role: t('CI/CD · Cloud · BI dashboards', 'CI/CD · Cloud · Tableaux de bord BI'),
      oneLiner: t(
        'Reliability engineer for an MSP — pipelines, dashboards, and the boring infrastructure that keeps it all up.',
        "Ingénieur fiabilité pour un MSP — pipelines, tableaux de bord, et l'infrastructure invisible qui maintient tout en route."
      ),
      body: t(
        'Owned CI/CD for internal tooling, instrumented monitoring, and built BI dashboards that cut weekly reporting from hours to minutes. The kind of work nobody notices when it works.',
        "Pris en charge le CI/CD pour l'outillage interne, instrumentation du monitoring, et construction de tableaux de bord BI qui ont réduit le reporting hebdomadaire de plusieurs heures à quelques minutes. Le genre de travail que personne ne remarque quand il fonctionne."
      ),
      metrics: [
        ['CI/CD',     t('pipelines',  'pipelines')],
        ['BI',        t('dashboards', 'tableaux de bord')],
        ['Cloud',     t('monitoring', 'monitoring')],
        ['Hours→min', t('reporting',  'reporting')],
      ],
      stack: ['Docker', 'GitHub Actions', 'AWS', 'Azure', 'Tableau', 'Power BI'],
      link: null, linkLabel: null,
      tone: 'var(--amber)',
    },
    {
      id: 'gem', num: '04', title: 'GeM Laboratories',
      tag: t('WEB DEV INTERN · 05–08/2022 · NANTES', 'STAGE DÉV. WEB · 05–08/2022 · NANTES'),
      role: t('Scientific Python · Research tooling', 'Python scientifique · Outils de recherche'),
      oneLiner: t(
        'Internal tools for materials-science researchers — Python pipelines, custom UIs, real users on the team.',
        "Outils internes pour des chercheurs en science des matériaux — pipelines Python, interfaces sur mesure, vrais utilisateurs dans l'équipe."
      ),
      body: t(
        'Wrote scientific Python utilities and small internal web tools used daily by a research team. First brush with research-to-production: code that someone runs on a Tuesday morning and depends on.',
        "Écriture d'utilitaires Python scientifiques et de petits outils web internes utilisés quotidiennement par une équipe de recherche. Premier contact avec le passage de la recherche à la production : du code que quelqu'un lance un mardi matin et sur lequel il compte."
      ),
      metrics: [
        ['Python',    t('tooling',   'outillage')],
        ['Daily',     t('users',     'utilisateurs')],
        ['Materials', t('science',   'science')],
        ['Internal',  t('apps',      'apps')],
      ],
      stack: ['Python', 'NumPy', 'matplotlib', 'JS'],
      link: null, linkLabel: null,
      tone: 'var(--crimson)',
    },
  ];

  const updateNavState = () => {
    const tk = trackRef.current;
    if (!tk) return;
    setCanPrev(tk.scrollLeft > 4);
    setCanNext(tk.scrollLeft + tk.clientWidth < tk.scrollWidth - 4);
  };

  useEffect(() => {
    updateNavState();
    const onResize = () => updateNavState();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollByCard = (dir) => {
    const tk = trackRef.current;
    if (!tk) return;
    tk.scrollBy({ left: dir * (CARD_WIDTH + CARD_GAP), behavior: 'smooth' });
  };

  return (
    <section
      id="work"
      data-screen-label="Work"
      className="section-pad"
      style={{ background: 'var(--bg-deep)', position: 'relative' }}
    >
      <div className="container">
        <Eyebrow>{t('03 — Selected work', '03 — Projets sélectionnés')}</Eyebrow>
        <div
          className="work-header"
          style={{
            marginTop: 16,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            gap: 40, flexWrap: 'wrap',
          }}
        >
          <h2
            className="display"
            style={{ fontSize: 'clamp(48px, 6.5vw, 92px)', lineHeight: 0.96, maxWidth: 800 }}
          >
            {t('Four projects, ', 'Quatre projets,')}
            <br />
            {t('one through-line.', 'un fil conducteur.')}
          </h2>
          <div
            className="mono"
            style={{
              fontSize: 10, letterSpacing: '0.18em',
              color: 'var(--muted)', textTransform: 'uppercase', textAlign: 'right',
            }}
          >
            {t('← Drag, scroll, or use buttons →', '← Glissez, défilez ou utilisez les boutons →')}
            <br />
            <span style={{ color: 'var(--ink)' }}>
              {t('Click cards to flip', 'Cliquez pour retourner les cartes')}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal-scroll card strip — full bleed */}
      <div
        ref={trackRef}
        onScroll={updateNavState}
        className="work-track"
        style={{
          marginTop: 56,
          display: 'flex',
          gap: CARD_GAP,
          padding: '4px 56px 28px',
          overflowX: 'auto',
          overflowY: 'visible',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {PROJECTS.map((p) => (
          <div key={p.id} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
            <ProjectCard p={p} />
          </div>
        ))}
        {/* End cap — invitation card */}
        <div style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
          <div
            style={{
              width: 360, height: 640,
              border: '1px dashed var(--line-strong)', borderRadius: 14,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              padding: 36, textAlign: 'center',
            }}
          >
            <div className="display" style={{ fontSize: 36, color: 'var(--ink)', maxWidth: 240 }}>
              {t('More on the way.', 'D\'autres à venir.')}
            </div>
            <p style={{ marginTop: 14, color: 'var(--ink-soft)', fontSize: 14 }}>
              {t(
                'Currently building. Want a peek at unreleased work?',
                "En cours de construction. Envie d'un aperçu de travaux non publiés ?"
              )}
            </p>
            <div style={{ marginTop: 22 }}>
              <Btn href="#contact" variant="ghost">{t('Reach out →', 'Me contacter →')}</Btn>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{
          marginTop: 18,
          display: 'flex', justifyContent: 'flex-end', gap: 10,
        }}
      >
        <NavBtn onClick={() => scrollByCard(-1)} disabled={!canPrev} label={t('Previous project', 'Projet précédent')}>←</NavBtn>
        <NavBtn onClick={() => scrollByCard(1)} disabled={!canNext} label={t('Next project', 'Projet suivant')}>→</NavBtn>
      </div>
    </section>
  );
};

export default Work;
