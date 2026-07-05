import React, { useEffect, useState } from 'react';
import { useLang, useT } from '../lang/LanguageContext.jsx';
import { scrollToHash } from '../lib/lenis.js';
import { cvFor } from '../lib/cv.js';

const useLinks = (t) => [
  { href: '#story',   label: t('Story',   'Parcours') },
  { href: '#stack',   label: t('Stack',   'Stack') },
  { href: '#work',    label: t('Work',    'Projets') },
  { href: '#lab',     label: t('Lab',     'Labo') },
  { href: '#arcade',  label: t('Arcade',  'Arcade') },
  { href: '#contact', label: t('Contact', 'Contact') },
];

// Top bar — transparent until 40px scrolled, then frosted-glass bar.
// Anchors route through Lenis for smooth travel down the pipeline.
const Nav = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const onChange = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const links = useLinks(t);
  const cvs = Object.values(cvFor(lang));

  const go = (e, href) => {
    e.preventDefault();
    scrollToHash(href);
  };

  const closeAndGo = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => scrollToHash(href), 0);
  };

  const langBtnStyle = (active) => ({
    background: 'transparent', border: 'none', padding: '4px 6px',
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
    color: active ? 'var(--ink)' : 'var(--muted)',
    cursor: 'pointer',
    transition: 'color 0.2s',
  });

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          padding: '16px 24px',
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
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            textDecoration: 'none', color: 'var(--ink)',
          }}
          onClick={(e) => { setMenuOpen(false); go(e, '#top'); }}
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

        {/* Desktop links + CV + lang toggle — hidden via CSS at ≤768px */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.13em',
                color: 'var(--ink-soft)', textDecoration: 'none', textTransform: 'uppercase',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ember)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-soft)'; }}
            >
              {l.label}
            </a>
          ))}

          {/* CV download — small dropdown with both versions */}
          <div
            style={{ position: 'relative' }}
            onMouseLeave={() => setCvOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              aria-expanded={cvOpen}
              aria-haspopup="true"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.13em',
                textTransform: 'uppercase', cursor: 'pointer',
                background: 'transparent', color: 'var(--ember)',
                border: '1px solid var(--ember)', borderRadius: 999,
                padding: '7px 14px',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--ember)';
                e.currentTarget.style.color = 'var(--bg-raised)';
                setCvOpen(true);
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--ember)';
              }}
            >
              CV ⤓
            </button>
            {cvOpen && (
              <div
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--bg-raised)', border: '1px solid var(--line-strong)',
                  borderRadius: 12, padding: 8, minWidth: 240,
                  boxShadow: '0 18px 50px rgba(20, 17, 13, 0.16)',
                  display: 'flex', flexDirection: 'column', gap: 2,
                }}
              >
                {cvs.map((cv) => (
                  <a
                    key={cv.path}
                    href={cv.path}
                    download
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em',
                      color: 'var(--ink)', textDecoration: 'none',
                      padding: '10px 12px', borderRadius: 8,
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg)';
                      e.currentTarget.style.color = 'var(--ember)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--ink)';
                    }}
                  >
                    ⤓ {cv.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              paddingLeft: 14, marginLeft: 2,
              borderLeft: '1px solid var(--line-strong)',
            }}
            aria-label="Language toggle"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              style={langBtnStyle(lang === 'en')}
            >
              EN
            </button>
            <span style={{ color: 'var(--line-strong)', fontSize: 11 }}>·</span>
            <button
              type="button"
              onClick={() => setLang('fr')}
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
            <a key={l.href} href={l.href} onClick={(e) => closeAndGo(e, l.href)}>
              {l.label}
            </a>
          ))}
          {cvs.map((cv) => (
            <a key={cv.path} href={cv.path} download style={{ color: 'var(--ember)' }}>
              ⤓ CV — {cv.label}
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
