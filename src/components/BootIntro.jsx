import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLang } from '../lang/LanguageContext.jsx';
import { prefersReducedMotion } from '../shared.jsx';

// First-visit "deploy" sequence — a dark terminal flash before the light site.
// Lines land every ~180ms, then the overlay wipes up. Session-scoped
// (sessionStorage) so in-tab reloads don't replay it; any key/click skips.
const LINES = {
  en: [
    [{ t: '$ ao deploy --prod --region eu-west-3', c: '' }],
    [{ t: '▸ building    portfolio@3.0 ', c: 'dim' }, { t: '·········· ', c: 'dim' }, { t: '✓ 0.41s', c: 'ok' }],
    [{ t: '▸ hydrating   content [EN·FR] ', c: 'dim' }, { t: '········ ', c: 'dim' }, { t: '✓ 0.18s', c: 'ok' }],
    [{ t: '▸ services    rail · terminal · arcade ', c: 'dim' }, { t: '✓ 0.09s', c: 'ok' }],
    [{ t: '● live — welcome to the system', c: 'live' }],
  ],
  fr: [
    [{ t: '$ ao deploy --prod --region eu-west-3', c: '' }],
    [{ t: '▸ compilation portfolio@3.0 ', c: 'dim' }, { t: '·········· ', c: 'dim' }, { t: '✓ 0,41s', c: 'ok' }],
    [{ t: '▸ hydratation contenu [EN·FR] ', c: 'dim' }, { t: '········ ', c: 'dim' }, { t: '✓ 0,18s', c: 'ok' }],
    [{ t: '▸ services    rail · terminal · arcade ', c: 'dim' }, { t: '✓ 0,09s', c: 'ok' }],
    [{ t: '● en ligne — bienvenue dans le système', c: 'live' }],
  ],
};

const BootIntro = () => {
  const { lang } = useLang();
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (prefersReducedMotion()) return false;
    try { return window.sessionStorage.getItem('booted') !== '1'; } catch { return true; }
  });
  const [count, setCount] = useState(0);
  const lines = useMemo(() => LINES[lang] || LINES.en, [lang]);

  const finish = () => {
    try { window.sessionStorage.setItem('booted', '1'); } catch { /* ignore */ }
    setShow(false);
  };

  useEffect(() => {
    if (!show) return undefined;
    const timers = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setCount(i + 1), 240 + i * 185));
    });
    timers.push(setTimeout(finish, 240 + lines.length * 185 + 520));
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="boot"
          onClick={finish}
          role="presentation"
          aria-hidden="true"
          exit={{ y: '-100%', transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="boot-inner">
            {lines.slice(0, count).map((segs, i) => (
              <div className="boot-line" key={`bl-${i}`}>
                {segs.map((s, j) => (
                  <span key={`bs-${j}`} className={s.c}>{s.t}</span>
                ))}
              </div>
            ))}
            <span className="boot-caret" />
            <div className="boot-skip">
              {lang === 'fr' ? 'cliquez pour passer' : 'click to skip'}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootIntro;
