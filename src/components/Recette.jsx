import React from 'react';
import { Reveal, StageChip } from '../shared.jsx';
import { useLang, useT } from '../lang/LanguageContext.jsx';

// LaRecette.ai logo mark — a chef's toque drawn as a node graph, with the
// brand's orbiting dashed ellipse. Pure SVG, no asset needed.
const ToqueMark = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <ellipse cx="32" cy="34" rx="27" ry="13" fill="none" stroke="var(--lr-sky)" strokeWidth="1" strokeDasharray="3 4" transform="rotate(-14 32 34)" />
    {/* Toque silhouette as connected nodes */}
    <path
      d="M 20 44 L 20 30 C 12 28 12 16 22 16 C 24 8 40 8 42 16 C 52 16 52 28 44 30 L 44 44 Z"
      fill="none" stroke="var(--lr-navy)" strokeWidth="1.6" strokeLinejoin="round"
    />
    <line x1="20" y1="38" x2="44" y2="38" stroke="var(--lr-navy)" strokeWidth="1.2" />
    {/* Graph nodes */}
    {[[22, 16], [42, 16], [32, 10], [20, 30], [44, 30], [32, 38]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="2.6" fill={i === 5 ? 'var(--lr-royal)' : 'var(--lr-navy)'} />
    ))}
    {/* Inner connections */}
    <g stroke="var(--lr-royal)" strokeWidth="0.9" opacity="0.7">
      <line x1="22" y1="16" x2="32" y2="38" />
      <line x1="42" y1="16" x2="32" y2="38" />
      <line x1="32" y1="10" x2="32" y2="38" />
    </g>
  </svg>
);

const Recette = () => {
  const t = useT();
  const { lang } = useLang();

  const steps = [
    {
      n: '01',
      title: t('Project initiation', 'Lancement du projet'),
      sub: t('Assemble the Brigade — the humans around the agent.', "Assembler la Brigade — les humains autour de l'agent."),
    },
    {
      n: '02',
      title: t('Business mise en place', 'Mise en place business'),
      sub: t('Ground the agent in the real process it will live in.', "Ancrer l'agent dans le processus réel qu'il habitera."),
    },
    {
      n: '03',
      title: t('Readiness test', 'Test de faisabilité'),
      sub: t("The Chef's Note: do you even need an agent?", "La Note du Chef : avez-vous vraiment besoin d'un agent ?"),
    },
    {
      n: '04',
      title: t('Behavioral design', 'Design comportemental'),
      sub: t('Mission, tone, tools, data, guardrails — the recipe itself.', 'Mission, ton, outils, données, garde-fous — la recette elle-même.'),
    },
    {
      n: '05',
      title: t('Quality tasting', 'Test de dégustation'),
      sub: t('Failure modes + a starter eval set, before any build.', "Modes d'échec + un jeu d'évaluation prêt à l'emploi, avant toute construction."),
    },
    {
      n: '06',
      title: t('The ship', 'Le service'),
      sub: t('One-shot prompt · guided build · expert-built. Your choice.', 'Prompt unique · construction guidée · construit par un expert. Au choix.'),
    },
  ];

  return (
    <section
      id="recette"
      data-stage-label={t('05 · SCALE', '05 · CROISSANCE')}
      className="section-pad"
      style={{
        background: 'linear-gradient(180deg, var(--bg) 0%, #E9F0FC 14%, #E9F0FC 86%, var(--bg) 100%)',
      }}
    >
      <div className="container">
        <Reveal>
          <StageChip
            code={t('05 · SCALE', '05 · CROISSANCE')}
            status={t('serving', 'en service')}
            color="var(--lr-royal)"
          />
        </Reveal>

        <Reveal delay={0.07}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 22, flexWrap: 'wrap' }}>
            <ToqueMark size={52} />
            <h2
              className="lr-brand"
              style={{ fontSize: 'clamp(34px, 4.4vw, 62px)', color: 'var(--lr-navy)', lineHeight: 1 }}
            >
              LaRecette<span style={{ color: 'var(--lr-royal)' }}>.ai</span>
            </h2>
            <span
              className="mono"
              style={{
                fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--lr-slate)', border: '1px solid var(--lr-sky)',
                borderRadius: 999, padding: '6px 12px',
              }}
            >
              {t('The AI kitchen for business', "La cuisine IA des entreprises")}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <h3
            className="display"
            style={{
              fontSize: 'clamp(34px, 4.6vw, 68px)', lineHeight: 1.02,
              marginTop: 34, maxWidth: 900, color: 'var(--lr-navy)',
            }}
          >
            {lang === 'fr' ? (
              <>Tout le monde vous aide à <em style={{ fontStyle: 'italic' }}>construire</em> des agents.
                Presque personne ne vous aide à les <em style={{ fontStyle: 'italic', color: 'var(--lr-royal)' }}>concevoir</em> d'abord.</>
            ) : (
              <>Everyone helps you <em style={{ fontStyle: 'italic' }}>build</em> AI agents.
                Almost no one helps you <em style={{ fontStyle: 'italic', color: 'var(--lr-royal)' }}>design</em> them first.</>
            )}
          </h3>
        </Reveal>

        <div
          className="recette-grid"
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1.1fr',
            gap: 64, marginTop: 56, alignItems: 'start',
          }}
        >
          {/* Left — the pitch */}
          <div>
            <Reveal delay={0.05}>
              <div style={{ color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.7, maxWidth: 520 }}>
                {lang === 'fr' ? (
                  <>
                    <p>
                      <span style={{ color: 'var(--lr-navy)', fontWeight: 500 }}>LaRecette.ai</span>{' '}
                      est un studio de conception d'agents — pour l'étape que tout le monde saute.
                      Un intervieweur IA guidé, <span style={{ color: 'var(--lr-navy)' }}>le Chef</span>, transforme
                      « nous voulons un agent » en un <span style={{ color: 'var(--lr-navy)' }}>Agent Build Book</span> :
                      un cahier de conception rigoureux, indépendant du modèle, que vous pouvez construire où vous voulez.
                    </p>
                    <p style={{ marginTop: 16 }}>
                      Sa mission, ses limites, sa personnalité, le bon modèle, ses outils et ses données,
                      ses garde-fous — et surtout, <em>comment vous saurez qu'il fonctionne</em> :
                      chaque conception est livrée avec son jeu d'évaluation.
                    </p>
                    <p style={{ marginTop: 16, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 21, color: 'var(--lr-navy)' }}>
                      « Nous vous livrons le test de dégustation, pas seulement la recette. »
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <span style={{ color: 'var(--lr-navy)', fontWeight: 500 }}>LaRecette.ai</span>{' '}
                      is an agent-design studio — for the step everyone skips.
                      A guided AI interviewer, <span style={{ color: 'var(--lr-navy)' }}>the Chef</span>, turns
                      “we want an agent” into an <span style={{ color: 'var(--lr-navy)' }}>Agent Build Book</span>:
                      a rigorous, model-agnostic blueprint you can build anywhere.
                    </p>
                    <p style={{ marginTop: 16 }}>
                      Its purpose, its boundaries, its personality, the right model, its tools and data,
                      its guardrails — and crucially, <em>how you'll know it works</em>:
                      every design ships with its own evaluation set.
                    </p>
                    <p style={{ marginTop: 16, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 21, color: 'var(--lr-navy)' }}>
                      “We hand you the taste test, not just the recipe.”
                    </p>
                  </>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ marginTop: 34 }}>
                <div
                  className="mono"
                  style={{
                    fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--lr-royal)', marginBottom: 14,
                  }}
                >
                  {t('Under the hood', 'Sous le capot')}
                </div>
                <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
                  {[
                    t(
                      <><strong>The Chef</strong> — a multi-agent interviewer with durable state and human-in-the-loop checkpoints (LangGraph).</>,
                      <><strong>Le Chef</strong> — un intervieweur multi-agents à état durable, avec points de validation humaine (LangGraph).</>
                    ),
                    t(
                      <><strong>Build Book engine</strong> — versioned, model-agnostic specs, from v0 to build-ready.</>,
                      <><strong>Moteur de Build Book</strong> — des specs versionnées, indépendantes du modèle, de la v0 au prêt-à-construire.</>
                    ),
                    t(
                      <><strong>Build companion</strong> — platform-aware guidance that walks your engineers through the build, voice or text.</>,
                      <><strong>Compagnon de build</strong> — un guidage adapté à votre plateforme qui accompagne vos ingénieurs, à la voix ou au clavier.</>
                    ),
                    t(
                      <><strong>The taste test</strong> — an evaluation set generated with every design: acceptance cases, failure modes, LLM-as-judge graders.</>,
                      <><strong>Le test de dégustation</strong> — un jeu d'évaluation généré avec chaque conception : cas d'acceptation, modes d'échec, juges LLM.</>
                    ),
                  ].map((line, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', gap: 12, alignItems: 'baseline',
                        color: 'var(--lr-slate)', fontSize: 15, lineHeight: 1.55,
                      }}
                    >
                      <span style={{ color: 'var(--lr-royal)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>▸</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
                <div className="chip-row" style={{ marginTop: 22 }}>
                  {['Python', 'LangGraph', 'OpenAI', 'Anthropic', 'Mistral', 'Next.js', 'TypeScript', 'PostgreSQL'].map((s) => (
                    <span
                      key={s}
                      className="chip"
                      style={{
                        borderColor: 'rgba(37, 99, 235, 0.35)', color: 'var(--lr-navy)',
                        background: 'rgba(230, 240, 255, 0.5)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — the Build Book card */}
          <Reveal delay={0.1}>
            <div className="lr-card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--lr-slate)' }}>
                  {t('Agent Build Book', 'Agent Build Book')}
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--lr-royal)' }}>
                  v0 → {t('build-ready', 'prêt à construire')}
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                {steps.map((s, i) => (
                  <Reveal key={s.n} delay={0.15 + i * 0.09}>
                    <div className="lr-step">
                      <span className="lr-step-num">{s.n}</span>
                      <div>
                        <div style={{ color: 'var(--lr-navy)', fontWeight: 500, fontSize: 15.5 }}>{s.title}</div>
                        <div style={{ color: 'var(--lr-slate)', fontSize: 13.5, marginTop: 3, lineHeight: 1.5 }}>{s.sub}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div
                className="mono"
                style={{
                  marginTop: 20, paddingTop: 16,
                  borderTop: '1px dashed rgba(11, 29, 58, 0.18)',
                  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--lr-slate)', display: 'flex', justifyContent: 'space-between',
                  gap: 12, flexWrap: 'wrap',
                }}
              >
                <span>◌ {t('Every design ships with evals', 'Chaque conception est livrée avec ses évals')}</span>
                <span style={{ color: 'var(--lr-royal)' }}>{t('« taste test included »', '« dégustation incluse »')}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Recette;
