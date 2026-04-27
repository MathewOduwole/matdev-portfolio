import React, { useEffect, useState } from 'react';
import { useLang, useT } from '../lang/LanguageContext.jsx';

const useLinks = (t) => [
  { href: '#about',      label: t('About',      'À propos') },
  { href: '#work',       label: t('Work',       'Projets') },
  { href: '#playground', label: t('Playground', 'Playground') },
  { href: '#stack',      label: t('Stack',      'Stack') },
  { href: '#contact',    label: t('Contact',    'Contact') },
];

// Top bar — transparent until 40px scrolled, then frosted-glass bar with a
// subtle bottom border. All links are in-page anchors; the avatar mark routes
// back to top. EN/FR pill on the far right toggles the site language.
const Nav = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = useLinks(t);

  const langBtnStyle = (active) => ({
    background: 'transparent', border: 'none', padding: '4px 6px',
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
    color: active ? 'var(--ink)' : 'var(--muted)',
    cursor: 'none',
    transition: 'color 0.2s',
  });

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '18px 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(244,239,227,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}
    >
      <a
        href="#top"
        data-cursor="hover"
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          textDecoration: 'none', color: 'var(--ink)',
        }}
      >
        <span
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--ink)', color: 'var(--bg)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.02em',
            border: '1px solid var(--ink)',
          }}
        >
          AO
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          Ayomide Mathew Oduwole
        </span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            data-cursor="hover"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em',
              color: 'var(--ink-soft)', textDecoration: 'none', textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ember)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-soft)'; }}
          >
            {l.label}
          </a>
        ))}

        {/* Language toggle */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            paddingLeft: 14, marginLeft: 4,
            borderLeft: '1px solid var(--line-strong)',
          }}
          aria-label="Language toggle"
        >
          <button
            type="button"
            onClick={() => setLang('en')}
            data-cursor="hover"
            aria-pressed={lang === 'en'}
            style={langBtnStyle(lang === 'en')}
          >
            EN
          </button>
          <span style={{ color: 'var(--line-strong)', fontSize: 11 }}>·</span>
          <button
            type="button"
            onClick={() => setLang('fr')}
            data-cursor="hover"
            aria-pressed={lang === 'fr'}
            style={langBtnStyle(lang === 'fr')}
          >
            FR
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
