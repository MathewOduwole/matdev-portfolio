import React from 'react';
import { Eyebrow, Reveal, SectionHead } from '../shared.jsx';
import { useT } from '../lang/LanguageContext.jsx';

const GROUPS_EN = [
  { group: 'Languages',   items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'R', 'C++'] },
  { group: 'AI & LLM',    items: ['OpenAI API', 'Anthropic MCP', 'RAG', 'Agent orchestration', 'Evals · LLM-as-judge', 'Prompt engineering', 'Fine-tuning', 'LangChain', 'Hugging Face'] },
  { group: 'ML & Data',   items: ['PyTorch', 'scikit-learn', 'pandas', 'NumPy', 'Causal inference', 'Azure ML', 'Jupyter'] },
  { group: 'Web',         items: ['React', 'Next.js', 'Node.js', 'FastAPI', 'Prisma', 'PostgreSQL', 'Tailwind'] },
  { group: 'Cloud',       items: ['Azure (Functions · AI Search · Document Intelligence · ADLS)', 'AWS (S3 · EC2 · Bedrock · SageMaker)', 'GCP', 'Hetzner', 'Cloudflare', 'Vercel'] },
  { group: 'DevOps',      items: ['Docker', 'Kubernetes', 'GitHub Actions', 'Azure DevOps', 'CI/CD', 'Git'] },
  { group: 'Analytics',   items: ['Tableau', 'Power BI', 'Selenium', 'Web scraping'] },
];

// Group labels translated; tool names stay as-is (proper nouns / tech).
const GROUPS_FR = [
  { group: 'Langages',    items: GROUPS_EN[0].items },
  { group: 'IA & LLM',    items: GROUPS_EN[1].items },
  { group: 'ML & Data',   items: GROUPS_EN[2].items },
  { group: 'Web',         items: GROUPS_EN[3].items },
  { group: 'Cloud',       items: GROUPS_EN[4].items },
  { group: 'DevOps',      items: GROUPS_EN[5].items },
  { group: 'Analytique',  items: GROUPS_EN[6].items },
];

const Stack = () => {
  const t = useT();
  const stackGroups = t(GROUPS_EN, GROUPS_FR);

  const experience = [
    {
      date: t('05/2026 — Present', '05/2026 — Présent'),
      role: t('AI Engineer', 'Ingénieur IA'),
      org: 'Enerex',
      loc: t('Remote · US', 'À distance · US'),
      tone: 'var(--ember)',
    },
    {
      date: t('04/2024 — Present', '04/2024 — Présent'),
      role: t('Co-founder', 'Co-fondateur'),
      org: 'Glorea',
      loc: t('Remote', 'À distance'),
      tone: 'var(--teal)',
    },
    {
      date: '02/2025 — 07/2025',
      role: t('Data Scientist (Intern)', 'Data Scientist (Stagiaire)'),
      org: 'Stealth Power',
      loc: 'Austin, US',
      tone: 'var(--amber)',
    },
    {
      date: '06/2024 — 01/2025',
      role: t('DevOps Engineer', 'Ingénieur DevOps'),
      org: 'Nerds Support',
      loc: 'Miami, US',
      tone: 'var(--crimson)',
    },
    {
      date: '03/2024 — 05/2024',
      role: t('Tutor', 'Tuteur'),
      org: 'École Centrale de Nantes',
      loc: 'Nantes, FR',
      tone: 'var(--teal)',
    },
    {
      date: '05/2022 — 08/2022',
      role: t('Web Developer (Intern)', 'Développeur Web (Stagiaire)'),
      org: 'GeM Laboratories',
      loc: 'Nantes, FR',
      tone: 'var(--amber)',
    },
  ];

  const education = [
    {
      date: '2021 — 2025',
      degree: t('B.Sc. double degree — Big Data & Management', 'Double diplôme B.Sc. — Big Data & Management'),
      school: 'École Centrale de Nantes + Audencia Business School',
    },
  ];

  const certs = [
    {
      name: 'Microsoft Azure Fundamentals',
      code: 'AZ-900',
      link: 'https://learn.microsoft.com/en-us/users/ayomidemathewoduwole-3399/credentials/66761c5e9eac465c?ref=https%3A%2F%2Fwww.linkedin.com%2F',
    },
    {
      name: t('Data Science Professional Certificate', 'Certificat professionnel en Data Science'),
      code: 'HarvardX',
      link: 'https://courses.edx.org/certificates/171372b9d1c14cd3b57fb5a355e922b9',
    },
  ];

  return (
    <section
      id="stack"
      data-stage-label={t('02 · TRAIN', '02 · ENTRAÎNEMENT')}
      className="section-pad"
      style={{ background: 'var(--bg-deep)' }}
    >
      <div className="container">
        <SectionHead
          code={t('02 · TRAIN', '02 · ENTRAÎNEMENT')}
          status={t('converged', 'convergé')}
          title={t(
            'Tools, picked for the job — not the résumé.',
            'Des outils choisis pour le travail — pas pour le CV.'
          )}
          max={780}
        />

        <div style={{ marginTop: 60, display: 'grid', gap: 0 }}>
          {stackGroups.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.03}>
              <div
                className="stack-row"
                style={{
                  display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40,
                  paddingTop: 22, paddingBottom: 22, borderTop: '1px solid var(--line-strong)',
                  alignItems: 'baseline',
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 12, color: 'var(--ember)', letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {g.group}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, columnGap: 26 }}>
                  {g.items.map((x) => (
                    <span key={x} className="mono" style={{ fontSize: 14.5, color: 'var(--ink)' }}>{x}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
          <div style={{ borderTop: '1px solid var(--line-strong)' }} />
        </div>

        {/* Trajectory */}
        <div style={{ marginTop: 110 }}>
          <Reveal><Eyebrow>{t('Trajectory', 'Parcours')}</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h3
              className="display"
              style={{ fontSize: 'clamp(36px, 4.6vw, 64px)', marginTop: 16 }}
            >
              {t('Six teams. Three continents.', 'Six équipes. Trois continents.')}
            </h3>
          </Reveal>

          <div style={{ marginTop: 48 }}>
            {experience.map((e, i) => (
              <Reveal key={`${e.role}-${e.org}`} delay={i * 0.03}>
                <div
                  className="stack-exp-row"
                  style={{
                    display: 'grid', gridTemplateColumns: '210px 1fr 1fr auto',
                    gap: 40, alignItems: 'baseline', padding: '24px 0',
                    borderTop: '1px solid var(--line-strong)',
                  }}
                >
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em' }}>{e.date}</div>
                  <div className="display" style={{ fontSize: 25, lineHeight: 1.1 }}>{e.role}</div>
                  <div style={{ color: e.tone, fontWeight: 500, fontSize: 15 }}>{e.org}</div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {e.loc}
                  </div>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: '1px solid var(--line-strong)' }} />
          </div>
        </div>

        {/* Education + certifications */}
        <div className="stack-edu-grid" style={{ marginTop: 110, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <div>
            <Reveal><Eyebrow>{t('Education', 'Formation')}</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h3
                className="display"
                style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginTop: 16 }}
              >
                {t('Trained at two schools at once.', 'Formé dans deux écoles à la fois.')}
              </h3>
            </Reveal>
            <div style={{ marginTop: 32 }}>
              {education.map((e) => (
                <Reveal key={e.degree} delay={0.08}>
                  <div style={{ padding: '20px 0', borderTop: '1px solid var(--line-strong)' }}>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em' }}>{e.date}</div>
                    <div style={{ marginTop: 8, fontSize: 19, color: 'var(--ink)' }}>{e.degree}</div>
                    <div style={{ marginTop: 4, fontSize: 14, color: 'var(--ink-soft)' }}>{e.school}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <Reveal delay={0.1}><Eyebrow color="var(--amber)">Certifications</Eyebrow></Reveal>
            <Reveal delay={0.15}>
              <h3
                className="display"
                style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginTop: 16 }}
              >
                {t('& certified where it matters.', '& certifié là où ça compte.')}
              </h3>
            </Reveal>
            <div style={{ marginTop: 32 }}>
              {certs.map((c, i) => (
                <Reveal key={c.code} delay={0.2 + i * 0.05}>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    style={{
                      padding: 22, marginBottom: 14,
                      border: '1px solid var(--line-strong)', borderRadius: 10,
                      background: 'var(--bg-raised)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
                      textDecoration: 'none', color: 'inherit',
                      transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--amber)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--line-strong)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontSize: 15, color: 'var(--ink)' }}>{c.name}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span
                        className="mono"
                        style={{
                          fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {t('View ↗', 'Voir ↗')}
                      </span>
                      <div
                        className="mono"
                        style={{
                          fontSize: 11, color: 'var(--amber)', letterSpacing: '0.08em',
                          padding: '5px 10px', border: '1px solid var(--amber)', borderRadius: 4,
                        }}
                      >
                        {c.code}
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
