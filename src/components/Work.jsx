import React, { useState } from 'react';
import { Metric, Reveal, SectionHead } from '../shared.jsx';
import { useT } from '../lang/LanguageContext.jsx';
import EnerexDiagram from './diagrams/EnerexDiagram.jsx';
import GloreaDiagram from './diagrams/GloreaDiagram.jsx';

// Featured case study — copy on one side, live architecture drawing on the
// other. The diagram is the argument: this is what the work actually is.
const CaseStudy = ({ p, flip = false }) => {
  const t = useT();
  return (
    <Reveal amount={0.12}>
      <article className={`case`}>
        <div className={`case-grid${flip ? ' flip' : ''}`}>
          {flip && (
            <div className="case-diagram grid-paper">
              <div className="case-fig">{p.fig}</div>
              {p.diagram}
              <div className="case-stamp">{p.stamp}</div>
            </div>
          )}
          <div className="case-copy">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'baseline' }}>
              <div className="mono" style={{ fontSize: 40, color: p.tone, lineHeight: 1, fontWeight: 300 }}>{p.num}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em', textAlign: 'right' }}>
                {p.tag}
              </div>
            </div>

            <h3 className="display" style={{ fontSize: 'clamp(38px, 4vw, 54px)', lineHeight: 0.98, marginTop: 22 }}>
              {p.title}
            </h3>
            <div className="mono" style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 12.5, letterSpacing: '0.04em' }}>
              {p.role}
            </div>

            <p
              style={{
                marginTop: 22, color: 'var(--ink)',
                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                fontSize: 21, lineHeight: 1.35,
              }}
            >
              “{p.oneLiner}”
            </p>

            <p style={{ marginTop: 18, color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.65 }}>
              {p.body}
            </p>

            <div className="chip-row" style={{ marginTop: 22 }}>
              {p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
            </div>

            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="mono"
                style={{
                  marginTop: 20, display: 'inline-block',
                  color: p.tone, textDecoration: 'none', fontSize: 12,
                  letterSpacing: '0.12em',
                }}
              >
                {t('VISIT', 'VISITER')} ↗ {p.linkLabel}
              </a>
            )}

            <div className="case-metrics">
              {p.metrics.map(([v, l]) => (
                <Metric key={l} value={v} label={l} tone={p.tone} />
              ))}
            </div>
          </div>
          {!flip && (
            <div className="case-diagram grid-paper">
              <div className="case-fig">{p.fig}</div>
              {p.diagram}
              <div className="case-stamp">{p.stamp}</div>
            </div>
          )}
        </div>
      </article>
    </Reveal>
  );
};

// Compact, expandable row for earlier roles.
const RoleRow = ({ r }) => {
  const [open, setOpen] = useState(false);
  const t = useT();
  return (
    <div className={`role-row-wrap${open ? ' open' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-cursor="hover"
        aria-expanded={open}
        style={{
          display: 'block', width: '100%', textAlign: 'left',
          background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          color: 'inherit', font: 'inherit',
        }}
      >
        <div className="role-row">
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {r.date}
          </div>
          <div>
            <span className="display" style={{ fontSize: 24 }}>{r.org}</span>
            <span className="mono" style={{ fontSize: 11, color: r.tone, marginLeft: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {r.role}
            </span>
          </div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
            {open ? '−' : '+'}
          </div>
        </div>
      </button>
      <div className="role-row-body">
        <div style={{ padding: '2px 0 26px', maxWidth: 680 }}>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.65 }}>{r.body}</p>
          <div className="chip-row" style={{ marginTop: 16 }}>
            {r.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const Work = () => {
  const t = useT();

  const enerex = {
    num: '01',
    title: 'Enerex',
    tag: t('AI ENGINEER · 05/2026 — PRESENT', 'INGÉNIEUR IA · 05/2026 — PRÉSENT'),
    role: t('LLM agents · RAG · Evals · MCP · Azure', 'Agents LLM · RAG · Évals · MCP · Azure'),
    oneLiner: t(
      "Agents that read the energy market's paperwork — so people don't have to.",
      "Des agents qui lisent la paperasse du marché de l'énergie — pour que les humains n'aient plus à le faire."
    ),
    body: t(
      'Enerex builds SaaS for the deregulated retail-energy market; I build its AI layer. An unattended multi-agent platform ingests supplier emails and contracts, extracts structured data with retrieval-augmented LLM agents, routes low-confidence fields to humans, and writes clean records back into the sales and commissions products. I re-architected the extraction pipeline from minutes to seconds, built a Model Context Protocol server exposing 80+ permission-gated tools to agents across nine products, and gate every change behind a field-level evaluation framework — plus a calibrated ML pricing model shaped by a causal-inference deep-dive.',
      "Enerex édite des SaaS pour le marché dérégulé de l'énergie ; j'y construis la couche IA. Une plateforme multi-agents autonome ingère les e-mails et contrats des fournisseurs, en extrait des données structurées via des agents LLM augmentés par récupération (RAG), achemine les champs à faible confiance vers une relecture humaine, et réinjecte des données propres dans les produits de vente et de commissions. J'ai ré-architecturé le pipeline d'extraction pour passer de plusieurs minutes à quelques secondes, construit un serveur Model Context Protocol exposant 80+ outils à accès contrôlé sur neuf produits, et conditionné chaque mise en production à un cadre d'évaluation champ par champ — sans oublier un modèle ML de tarification calibré, éclairé par une analyse d'inférence causale."
    ),
    metrics: [
      ['~10×',  t('faster extraction', 'extraction accélérée')],
      ['80+',   t('MCP tools', 'outils MCP')],
      ['9',     t('products served', 'produits couverts')],
      ['24/7',  t('unattended', 'autonome')],
    ],
    stack: ['TypeScript', 'Python', 'OpenAI', 'MCP', 'Azure Functions', 'AI Search', 'Document Intelligence', 'Prisma', 'Next.js'],
    link: 'https://enerex.com', linkLabel: 'enerex.com',
    tone: 'var(--ember)',
    fig: t('FIG. 01 — UNATTENDED AI PLATFORM', 'FIG. 01 — PLATEFORME IA AUTONOME'),
    stamp: t('LIVE IN PROD', 'EN PRODUCTION'),
    diagram: <EnerexDiagram />,
  };

  const glorea = {
    num: '02',
    title: 'Glorea',
    tag: t('CO-FOUNDER · 04/2024 — PRESENT', 'CO-FONDATEUR · 04/2024 — PRÉSENT'),
    role: t('Full-stack · Data pipelines · Hybrid cloud', 'Full-stack · Pipelines de données · Cloud hybride'),
    oneLiner: t(
      'The unified research workspace — research smarter, publish faster, collaborate globally.',
      "L'espace de travail unifié de la recherche — chercher mieux, publier plus vite, collaborer sans frontières."
    ),
    body: t(
      'Glorea unifies the scattered tools of modern research — discovery, writing, data, collaboration, citations — into one calm workspace for researchers, labs, and institutions. I co-founded it and built the platform from zero: React + Node, ingestion pipelines processing 20M+ research papers and 600,000+ job postings, and microservices for tracking, recommendations, and content delivery. Migrated the whole stack off Azure onto a hybrid Hetzner + Cloudflare + Vercel architecture, wired CI/CD across environments, and led the SEO and ads push behind the first 100+ active users.',
      "Glorea unifie les outils éparpillés de la recherche moderne — découverte, rédaction, données, collaboration, citations — dans un espace de travail unique pour les chercheurs, les laboratoires et les institutions. Co-fondateur, j'ai construit la plateforme en partant de zéro : React + Node, des pipelines d'ingestion traitant 20M+ d'articles scientifiques et 600 000+ offres d'emploi, et des microservices pour le suivi, les recommandations et la diffusion de contenu. J'ai migré toute la stack d'Azure vers une architecture hybride Hetzner + Cloudflare + Vercel, mis en place le CI/CD sur tous les environnements, et piloté le SEO et les campagnes qui ont amené les 100 premiers utilisateurs actifs."
    ),
    metrics: [
      ['20M+', t('papers processed', 'articles traités')],
      ['600K+', t('job postings', "offres d'emploi")],
      ['100+', t('first users', 'premiers utilisateurs')],
      ['3',    t('clouds, one stack', 'clouds, une stack')],
    ],
    stack: ['React', 'Node', 'Python', 'PostgreSQL', 'Hetzner', 'Cloudflare', 'Vercel', 'GitHub Actions'],
    link: 'https://gloreaa.com', linkLabel: 'gloreaa.com',
    tone: 'var(--teal)',
    fig: t('FIG. 02 — HYBRID CLOUD', 'FIG. 02 — CLOUD HYBRIDE'),
    stamp: t('BUILT FROM ZERO', 'PARTI DE ZÉRO'),
    diagram: <GloreaDiagram />,
  };

  const earlier = [
    {
      org: 'Stealth Power',
      role: t('Data Scientist', 'Data Scientist'),
      date: '02 — 07/2025 · Austin',
      tone: 'var(--amber)',
      body: t(
        'Fine-tuned LLMs for NLP applications, built and integrated APIs for real-time data flow, and processed sensor, web, and user-generated data for modeling. Shipped an AI agent that turns a single prompt into database queries and a custom stakeholder dashboard — deployed on AWS.',
        "Fine-tuning de LLMs pour des applications NLP, construction et intégration d'APIs pour des flux de données en temps réel, traitement de données capteurs, web et utilisateurs pour la modélisation. Livraison d'un agent IA qui transforme un seul prompt en requêtes SQL et en tableau de bord sur mesure — le tout déployé sur AWS."
      ),
      stack: ['Python', 'LLMs', 'React', 'Node', 'SQL', 'AWS'],
    },
    {
      org: 'Nerds Support',
      role: t('DevOps Engineer', 'Ingénieur DevOps'),
      date: '06/2024 — 01/2025 · Miami',
      tone: 'var(--crimson)',
      body: t(
        'Owned CI/CD for internal tooling, led API-and-automation data collection projects, ran security audits and remediations, and automated Power BI operational reporting — cutting weekly reporting from hours to minutes. The kind of work nobody notices when it works.',
        "Responsable du CI/CD pour l'outillage interne, pilotage de projets de collecte de données par API et automatisation, audits de sécurité et remédiations, et automatisation du reporting opérationnel Power BI — réduisant le reporting hebdomadaire de plusieurs heures à quelques minutes. Le genre de travail que personne ne remarque quand tout fonctionne."
      ),
      stack: ['Docker', 'GitHub Actions', 'AWS', 'Azure', 'Power BI', 'Selenium'],
    },
    {
      org: 'École Centrale de Nantes',
      role: t('Tutor', 'Tuteur'),
      date: '03 — 05/2024 · Nantes',
      tone: 'var(--ember)',
      body: t(
        'Tutored 28 students in Python, linear algebra, and analysis — workshops, custom lesson plans, and the discovery that explaining something is the fastest way to actually understand it.',
        "Tutorat de 28 étudiants en Python, algèbre linéaire et analyse — ateliers, plans de cours sur mesure, et la découverte qu'expliquer une chose est le moyen le plus rapide de vraiment la comprendre."
      ),
      stack: ['Python', t('Linear algebra', 'Algèbre linéaire'), t('Teaching', 'Pédagogie')],
    },
    {
      org: 'GeM Laboratories',
      role: t('Web Developer (Intern)', 'Développeur Web (Stagiaire)'),
      date: '05 — 08/2022 · Nantes',
      tone: 'var(--teal)',
      body: t(
        'Wrote a Python wrapper (pybind11) for a high-performance C++ library solving partial differential equations, and integrated it into Jupyter so 7,000+ students and educators could actually use it. First taste of research-to-production.',
        "Écriture d'un wrapper Python (pybind11) pour une bibliothèque C++ haute performance résolvant des équations aux dérivées partielles, intégrée à Jupyter pour la rendre utilisable par 7 000+ étudiants et enseignants. Premier contact avec le passage de la recherche à la production."
      ),
      stack: ['Python', 'C++', 'Pybind11', 'SQL', 'Jupyter'],
    },
  ];

  return (
    <section
      id="work"
      data-stage-label={t('03 · SERVE', '03 · DÉPLOIEMENT')}
      className="section-pad"
      style={{ background: 'var(--bg)', position: 'relative' }}
    >
      <div className="container">
        <SectionHead
          code={t('03 · SERVE', '03 · DÉPLOIEMENT')}
          status={t('live', 'en ligne')}
          title={t(
            <>Systems in <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>production</em>, serving real users.</>,
            <>Des systèmes en <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>production</em>, au service de vrais utilisateurs.</>
          )}
        />

        <div style={{ marginTop: 56, display: 'grid', gap: 44 }}>
          <CaseStudy p={enerex} />
          <CaseStudy p={glorea} flip />
        </div>

        <div style={{ marginTop: 90 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              {t('Earlier missions', 'Missions précédentes')}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              {t('Click a row to expand', 'Cliquez sur une ligne pour déplier')}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              {earlier.map((r) => <RoleRow key={r.org} r={r} />)}
              <div style={{ borderTop: '1px solid var(--line)' }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Work;
