import React from 'react';
import { Reveal, SectionHead } from '../shared.jsx';
import { useLang, useT } from '../lang/LanguageContext.jsx';
import AvatarFig from './AvatarFig.jsx';

const Story = () => {
  const t = useT();
  const { lang } = useLang();

  const glance = [
    [t('Role',      'Rôle'),          t('AI Engineer @ Enerex', 'Ingénieur IA @ Enerex')],
    [t('Focus',     'Spécialité'),    t('LLM systems · Data · Full-stack', 'Systèmes LLM · Data · Full-stack')],
    [t('Based',     'Basé à'),        'Nantes, FR'],
    [t('Languages', 'Langues'),       'EN · FR · YO'],
    [t('Side quests', 'Quêtes secondaires'), 'Glorea · LaRecette.ai'],
  ];

  return (
    <section
      id="story"
      data-stage-label={t('01 · INGEST', '01 · COLLECTE')}
      className="section-pad"
      style={{ position: 'relative', background: 'var(--bg)' }}
    >
      <div className="container">
        <SectionHead
          code={t('01 · INGEST', '01 · COLLECTE')}
          status={t('complete', 'terminé')}
          title={t(
            <>Training data: <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>three continents</em>, three languages.</>,
            <>Données d'entraînement : <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>trois continents</em>, trois langues.</>
          )}
        />

        <div
          className="about-grid"
          style={{
            display: 'grid', gridTemplateColumns: '1.3fr 0.9fr',
            gap: 80, marginTop: 48, alignItems: 'start',
          }}
        >
          <div>
            <Reveal delay={0.1}>
              <div
                style={{
                  color: 'var(--ink-soft)', fontSize: 18, lineHeight: 1.7,
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
                      j'ai appris le métier sur la route : CI/CD et dashboards à{' '}
                      <span style={{ color: 'var(--ink)' }}>Miami</span>, fine-tuning de{' '}
                      <span style={{ color: 'var(--ink)' }}>LLMs</span> à{' '}
                      <span style={{ color: 'var(--ink)' }}>Austin</span>, et une plateforme de recherche —{' '}
                      <a className="inline-link" href="https://gloreaa.com" target="_blank" rel="noreferrer">Glorea</a>{' '}
                      — co-fondée depuis <span style={{ color: 'var(--ink)' }}>Nantes</span>.
                    </p>
                    <p style={{ marginTop: 18 }}>
                      Aujourd'hui, je suis ingénieur IA chez{' '}
                      <span style={{ color: 'var(--ink)' }}>Enerex</span> : des agents LLM en production
                      qui lisent les contrats et les e-mails du marché de l'énergie — RAG, extraction structurée,
                      validation avec supervision humaine, et des évaluations qui décident de ce qui part en prod.
                      En parallèle, j'ai créé <span style={{ color: 'var(--ink)' }}>LaRecette.ai</span> — un studio
                      et une méthode pour concevoir les agents <em>avant</em> de les construire.
                    </p>
                    <p style={{ marginTop: 18 }}>
                      Le fil conducteur : je construis là où{' '}
                      <em style={{ color: 'var(--ember)' }}>la recherche rencontre la production</em>.
                      Des pipelines propres, des modèles mesurés, des systèmes que quelqu'un lance
                      un mardi matin — et sur lesquels il compte.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Trained in big data and management at{' '}
                      <a className="inline-link" href="https://www.ec-nantes.fr/" target="_blank" rel="noreferrer">École Centrale de Nantes</a>{' '}
                      &amp;{' '}
                      <a className="inline-link" href="https://www.audencia.com/" target="_blank" rel="noreferrer">Audencia</a>,
                      I learned the craft on the move: CI/CD and dashboards in{' '}
                      <span style={{ color: 'var(--ink)' }}>Miami</span>, fine-tuning{' '}
                      <span style={{ color: 'var(--ink)' }}>LLMs</span> in{' '}
                      <span style={{ color: 'var(--ink)' }}>Austin</span>, and a research platform —{' '}
                      <a className="inline-link" href="https://gloreaa.com" target="_blank" rel="noreferrer">Glorea</a>{' '}
                      — co-founded from <span style={{ color: 'var(--ink)' }}>Nantes</span>.
                    </p>
                    <p style={{ marginTop: 18 }}>
                      Today I'm an AI engineer at{' '}
                      <span style={{ color: 'var(--ink)' }}>Enerex</span>: production LLM agents that read
                      the energy market's contracts and emails — RAG, structured extraction, human-in-the-loop
                      validation, and evals that decide what ships. On the side, I created{' '}
                      <span style={{ color: 'var(--ink)' }}>LaRecette.ai</span> — a studio and method for
                      designing agents <em>before</em> anyone builds them.
                    </p>
                    <p style={{ marginTop: 18 }}>
                      The through-line: I build where{' '}
                      <em style={{ color: 'var(--ember)' }}>research meets production</em>.
                      Clean pipelines, measured models, systems someone runs on a Tuesday
                      morning — and depends on.
                    </p>
                  </>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div
                style={{
                  marginTop: 44, display: 'flex', gap: 36, flexWrap: 'wrap',
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
                  color: 'var(--muted)', textTransform: 'uppercase',
                }}
              >
                {[
                  ['2022', 'Nantes · GeM'],
                  ['2024', 'Miami · DevOps'],
                  ['2025', 'Austin · LLMs'],
                  ['2024→', 'Glorea'],
                  ['2026→', 'Enerex · AI'],
                ].map(([yr, loc]) => (
                  <div key={loc}>
                    <div style={{ color: 'var(--ember)' }}>{yr}</div>
                    <div style={{ color: 'var(--ink)', marginTop: 4 }}>{loc}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.15}>
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
                  <AvatarFig />
                  <div
                    style={{
                      position: 'absolute', bottom: 14, left: 14, right: 14,
                      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
                      color: 'var(--muted)', textTransform: 'uppercase',
                      display: 'flex', justifyContent: 'space-between', gap: 10,
                      pointerEvents: 'none',
                    }}
                  >
                    <span>{t('FIG. 01 — THE ENGINEER', "FIG. 01 — L'INGÉNIEUR")}</span>
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
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
