import React from 'react';
import { Btn, Eyebrow, FadeIn, Magnetic } from '../shared.jsx';
import { useLang, useT } from '../lang/LanguageContext.jsx';

const Contact = () => {
  const t = useT();
  const { lang } = useLang();
  return (
    <section
      id="contact"
      data-screen-label="Contact"
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
        <FadeIn><Eyebrow>{t('08 — Contact', '08 — Contact')}</Eyebrow></FadeIn>
        <FadeIn delay={0.05}>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(60px, 9vw, 148px)', marginTop: 22,
              lineHeight: 0.92, maxWidth: 1100,
            }}
          >
            {lang === 'fr' ? (
              <>Construisons<br />le <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>prochain</em> ensemble.</>
            ) : (
              <>Let's build the<br /><em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>next one</em> together.</>
            )}
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p style={{ marginTop: 28, color: 'var(--ink-soft)', fontSize: 18, maxWidth: 580 }}>
            {t(
              'Open to data science and ML engineering roles, research collaborations, and interesting contract work.',
              "Ouvert aux postes en data science et ingénierie ML, aux collaborations de recherche, et aux missions intéressantes."
            )}
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
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
        </FadeIn>

        <FadeIn delay={0.35}>
          <div
            style={{
              marginTop: 100, paddingTop: 28,
              borderTop: '1px solid var(--line-strong)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              flexWrap: 'wrap', gap: 24,
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
              color: 'var(--muted)', textTransform: 'uppercase',
            }}
          >
            <div>© 2026 · Ayomide Mathew Oduwole</div>
            <div style={{ color: 'var(--ember)' }}>{t('● AVAILABLE · Nantes, FR', '● DISPONIBLE · Nantes, FR')}</div>
            <div>
              {t('Try the terminal', 'Essayez le terminal')} ↘ <span className="mono" style={{ color: 'var(--ink)' }}>{t('Press ~', 'Appuyez sur ~')}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Contact;
