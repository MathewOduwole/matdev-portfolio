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
//
// Mobile: links + lang toggle collapse into a hamburger drawer.
const Nav = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer if the viewport crosses back to desktop, so the menu state
  // doesn't get stuck open if the user resizes / rotates.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const onChange = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const links = useLinks(t);

  const langBtnStyle = (active) => ({
    background: 'transparent', border: 'none', padding: '4px 6px',
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
    color: active ? 'var(--ink)' : 'var(--muted)',
    cursor: 'none',
    transition: 'color 0.2s',
  });

  const closeAndGo = (href) => {
    setMenuOpen(false);
    // Let the drawer unmount before the hash jump so the smooth-scroll target
    // measurement isn't off by the drawer's height.
    setTimeout(() => { window.location.hash = href; }, 0);
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled || menuOpen ? 'rgba(244,239,227,0.92)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled || menuOpen ? 'blur(14px)' : 'none',
          borderBottom: scrolled || menuOpen ? '1px solid var(--line)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <a
          href="#top"
          data-cursor="hover"
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            textDecoration: 'none', color: 'var(--ink)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <span
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--ink)', color: 'var(--bg)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.02em',
              border: '1px solid var(--ink)',
              flexShrink: 0,
            }}
          >
            AO
          </span>
          <span
            className="nav-name"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Ayomide Mathew Oduwole
          </span>
        </a>

        {/* Desktop links + lang toggle — hidden via CSS at ≤768px */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
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

        {/* Mobile hamburger — shown via CSS at ≤768px */}
        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? t('Close menu', 'Fermer le menu') : t('Open menu', 'Ouvrir le menu')}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="nav-mobile-drawer" role="dialog" aria-modal="false">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                closeAndGo(l.href);
              }}
            >
              {l.label}
            </a>
          ))}
          <div className="nav-mobile-lang">
            <span style={{ color: 'var(--muted)', marginRight: 8 }}>{t('Language', 'Langue')}</span>
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              style={{ color: lang === 'en' ? 'var(--ink)' : 'var(--muted)' }}
            >
              EN
            </button>
            <span style={{ color: 'var(--line-strong)' }}>·</span>
            <button
              type="button"
              onClick={() => setLang('fr')}
              aria-pressed={lang === 'fr'}
              style={{ color: lang === 'fr' ? 'var(--ink)' : 'var(--muted)' }}
            >
              FR
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
