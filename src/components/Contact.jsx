import React from 'react';
import { Btn, Magnetic, Reveal, StageChip } from '../shared.jsx';
import { useLang, useT } from '../lang/LanguageContext.jsx';
import { cvFor } from '../lib/cv.js';

const Contact = () => {
  const t = useT();
  const { lang } = useLang();
  const cvs = Object.values(cvFor(lang));
  return (
    <section
      id="contact"
      data-stage-label={t('07 · CONNECT', '07 · CONTACT')}
      style={{
        position: 'relative',
        padding: '160px 0 100px',
        background: 'var(--bg-deep)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--ember-glow) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(20px)',
        }}
      />
      <div className="container" style={{ position: 'relative' }}>
        <Reveal>
          <StageChip code={t('07 · CONNECT', '07 · CONTACT')} status={t('listening', "à l'écoute")} />
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(56px, 8.6vw, 140px)', marginTop: 22,
              lineHeight: 0.92, maxWidth: 1100,
            }}
          >
            {lang === 'fr' ? (
              <>Construisons<br />la <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>suite</em> ensemble.</>
            ) : (
              <>Let's build the<br /><em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>next one</em> together.</>
            )}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ marginTop: 28, color: 'var(--ink-soft)', fontSize: 18, maxWidth: 600 }}>
            {t(
              'Happily employed, always curious — up for AI-systems talk, agent-design collaborations, and genuinely interesting side quests. Email is the fastest channel; I reply within 24h.',
              "Heureux en poste, toujours curieux — partant pour parler systèmes d'IA, collaborer sur la conception d'agents, ou tout projet secondaire vraiment intéressant. L'e-mail reste le canal le plus rapide ; je réponds sous 24h."
            )}
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Magnetic strength={0.2}>
              <Btn href="mailto:ayomidemathew.oduwole@gmail.com" variant="primary">
                ayomidemathew.oduwole@gmail.com →
              </Btn>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Btn href="https://www.linkedin.com/in/ayomide-mathew-oduwole/" target="_blank" variant="ghost">LinkedIn ↗</Btn>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Btn href="https://github.com/MathewOduwole" target="_blank" variant="ghost">GitHub ↗</Btn>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div
            style={{
              marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center',
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              {t('CV / résumé', 'CV')}
            </span>
            {cvs.map((cv) => (
              <Btn
                key={cv.path}
                href={cv.path}
                download
                variant="ghost"
                style={{ fontSize: 12.5, padding: '10px 18px' }}
              >
                ⤓ {cv.label}
              </Btn>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div
            style={{
              marginTop: 90, paddingTop: 28,
              borderTop: '1px solid var(--line-strong)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              flexWrap: 'wrap', gap: 24,
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
              color: 'var(--muted)', textTransform: 'uppercase',
            }}
          >
            <div>© 2026 · Ayomide Mathew Oduwole</div>
            <div style={{ color: 'var(--ember)' }}>
              {t('● Operational · Nantes, FR', '● Opérationnel · Nantes, FR')}
            </div>
            <div>
              {t('Try the terminal', 'Essayez le terminal')} ↘{' '}
              <span className="mono" style={{ color: 'var(--ink)' }}>{t('Press ~', 'Appuyez sur ~')}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
