import React from 'react';
import { Reveal, SectionHead } from '../shared.jsx';
import { useT } from '../lang/LanguageContext.jsx';
import SnakeGame from './arcade/SnakeGame.jsx';
import BreakoutGame from './arcade/BreakoutGame.jsx';

const Arcade = () => {
  const t = useT();
  return (
    <section
      id="arcade"
      data-stage-label={t('06 · COOLDOWN', '06 · PAUSE')}
      className="section-pad"
      style={{ background: 'var(--bg-deep)' }}
    >
      <div className="container">
        <SectionHead
          code={t('06 · COOLDOWN', '06 · PAUSE')}
          status={t('idle', 'au repos')}
          title={t(
            <>Every system needs a <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>cooldown</em> loop.</>,
            <>Même les systèmes ont besoin de <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>refroidir</em>.</>
          )}
          max={820}
        />
        <Reveal delay={0.12}>
          <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.6, maxWidth: 540, marginTop: 26 }}>
            {t(
              'Two cabinets, hand-built in canvas, zero dependencies. High scores stay in your browser. The terminal crowd can also type `play snake`.',
              "Deux bornes d'arcade faites maison en canvas, zéro dépendance. Les meilleurs scores restent dans votre navigateur. Les adeptes du terminal peuvent aussi taper `play snake`."
            )}
          </p>
        </Reveal>

        <div
          className="arcade-grid"
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 32, marginTop: 48, alignItems: 'start',
          }}
        >
          <Reveal delay={0.1}><SnakeGame /></Reveal>
          <Reveal delay={0.18}><BreakoutGame /></Reveal>
        </div>
      </div>
    </section>
  );
};

export default Arcade;
