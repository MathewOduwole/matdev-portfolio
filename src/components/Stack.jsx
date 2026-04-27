import React from 'react';
import { Eyebrow, FadeIn } from '../shared.jsx';
import { useT } from '../lang/LanguageContext.jsx';

const STACK_GROUPS_EN = [
  { group: 'Languages',  items: ['Python', 'R', 'SQL', 'JavaScript', 'TypeScript', 'C++'] },
  { group: 'ML & Data',  items: ['PyTorch', 'scikit-learn', 'pandas', 'NumPy', 'LLM fine-tuning', 'Hugging Face', 'NLP', 'Jupyter'] },
  { group: 'Web',        items: ['React', 'Node.js', 'Next.js', 'FastAPI', 'Tailwind'] },
  { group: 'Cloud & Ops', items: ['AWS (S3·EC2·Bedrock·SageMaker·RDS)', 'Azure', 'GCP', 'Hetzner', 'Cloudflare', 'Vercel'] },
  { group: 'DevOps',     items: ['Docker', 'Kubernetes', 'GitHub Actions', 'CI/CD', 'Git'] },
  { group: 'Analytics',  items: ['Tableau', 'Power BI', 'Selenium', 'Web scraping'] },
];

// Group labels translated; tool names stay as-is (proper nouns / tech).
const STACK_GROUPS_FR = [
  { group: 'Langages',   items: STACK_GROUPS_EN[0].items },
  { group: 'ML & Data',  items: STACK_GROUPS_EN[1].items },
  { group: 'Web',        items: STACK_GROUPS_EN[2].items },
  { group: 'Cloud & Ops', items: STACK_GROUPS_EN[3].items },
  { group: 'DevOps',     items: STACK_GROUPS_EN[4].items },
  { group: 'Analytique', items: STACK_GROUPS_EN[5].items },
];

const Stack = () => {
  const t = useT();

  const stackGroups = t(STACK_GROUPS_EN, STACK_GROUPS_FR);

  const experience = [
    {
      date: t('04/2024 — Present', '04/2024 — Présent'),
      role: t('Co-founder · Web Developer', 'Co-fondateur · Développeur Web'),
      org: 'Glorea',
      loc: t('Remote', 'Télétravail'),
      tone: 'var(--ember)',
    },
    {
      date: '02/2025 — 07/2025',
      role: t('Data Scientist (Intern)', 'Data Scientist (Stagiaire)'),
      org: 'Stealth Power',
      loc: t('Austin, US', 'Austin, US'),
      tone: 'var(--teal)',
    },
    {
      date: '06/2024 — 01/2025',
      role: t('DevOps Engineer', 'Ingénieur DevOps'),
      org: 'Nerds Support',
      loc: t('Miami, US', 'Miami, US'),
      tone: 'var(--amber)',
    },
    {
      date: '03/2024 — 05/2024',
      role: t('Tutor', 'Tuteur'),
      org: 'École Centrale de Nantes',
      loc: t('Nantes, FR', 'Nantes, FR'),
      tone: 'var(--crimson)',
    },
    {
      date: '05/2022 — 08/2022',
      role: t('Web Developer (Intern)', 'Développeur Web (Stagiaire)'),
      org: 'GeM Laboratories',
      loc: t('Nantes, FR', 'Nantes, FR'),
      tone: 'var(--ember)',
    },
  ];

  const education = [
    {
      date: '2021 — 2025',
      degree: t('B.Sc. double degree — Big Data & Management', 'Double diplôme B.Sc. — Big Data & Management'),
      school: t(
        'École Centrale de Nantes + Audencia Business School',
        'École Centrale de Nantes + Audencia Business School'
      ),
    },
  ];

  const certs = [
    {
      name: t('Microsoft Azure Fundamentals', 'Microsoft Azure Fundamentals'),
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
    <section id="stack" data-screen-label="Stack" className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <FadeIn><Eyebrow>{t('05 — Stack', '05 — Stack')}</Eyebrow></FadeIn>
        <FadeIn delay={0.05}>
          <h2
            className="display"
            style={{ fontSize: 'clamp(40px, 5.5vw, 76px)', marginTop: 18, maxWidth: 720 }}
          >
            {t('Tools, picked for the job — not the résumé.', 'Des outils choisis pour le travail — pas pour le CV.')}
          </h2>
        </FadeIn>

        <div style={{ marginTop: 64, display: 'grid', gap: 0 }}>
          {stackGroups.map((g, i) => (
            <FadeIn key={g.group} delay={i * 0.04}>
              <div
                style={{
                  display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40,
                  paddingTop: 22, paddingBottom: 22, borderTop: '1px solid var(--line)',
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, columnGap: 28 }}>
                  {g.items.map((x) => (
                    <span key={x} className="mono" style={{ fontSize: 15, color: 'var(--ink)' }}>{x}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
          <div style={{ borderTop: '1px solid var(--line)' }} />
        </div>

        <div style={{ marginTop: 120 }}>
          <FadeIn><Eyebrow>{t('06 — Trajectory', '06 — Parcours')}</Eyebrow></FadeIn>
          <FadeIn delay={0.05}>
            <h2
              className="display"
              style={{ fontSize: 'clamp(40px, 5.5vw, 76px)', marginTop: 18 }}
            >
              {t('Five teams. Three continents.', 'Cinq équipes. Trois continents.')}
            </h2>
          </FadeIn>

          <div style={{ marginTop: 56 }}>
            {experience.map((e, i) => (
              <FadeIn key={`${e.role}-${e.org}`} delay={i * 0.04}>
                <div
                  style={{
                    display: 'grid', gridTemplateColumns: '220px 1fr 1fr auto',
                    gap: 40, alignItems: 'baseline', padding: '26px 0',
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em' }}>{e.date}</div>
                  <div className="display" style={{ fontSize: 26, lineHeight: 1.1 }}>{e.role}</div>
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
              </FadeIn>
            ))}
            <div style={{ borderTop: '1px solid var(--line)' }} />
          </div>
        </div>

        <div style={{ marginTop: 120, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <div>
            <FadeIn><Eyebrow>{t('07 — Education', '07 — Formation')}</Eyebrow></FadeIn>
            <FadeIn delay={0.05}>
              <h2
                className="display"
                style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', marginTop: 16 }}
              >
                {t('Trained at two schools at once.', 'Formé dans deux écoles à la fois.')}
              </h2>
            </FadeIn>
            <div style={{ marginTop: 36 }}>
              {education.map((e) => (
                <FadeIn key={e.degree} delay={0.08}>
                  <div style={{ padding: '20px 0', borderTop: '1px solid var(--line)' }}>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em' }}>{e.date}</div>
                    <div style={{ marginTop: 8, fontSize: 19, color: 'var(--ink)' }}>{e.degree}</div>
                    <div style={{ marginTop: 4, fontSize: 14, color: 'var(--ink-soft)' }}>{e.school}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <div>
            <FadeIn delay={0.1}><Eyebrow color="var(--amber)">{t('Certifications', 'Certifications')}</Eyebrow></FadeIn>
            <FadeIn delay={0.15}>
              <h2
                className="display"
                style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', marginTop: 16 }}
              >
                {t('& certified where it matters.', '& certifié là où ça compte.')}
              </h2>
            </FadeIn>
            <div style={{ marginTop: 36 }}>
              {certs.map((c, i) => (
                <FadeIn key={c.name} delay={0.2 + i * 0.05}>
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
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
