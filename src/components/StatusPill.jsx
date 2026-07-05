import React, { useEffect, useState } from 'react';
import { useLang } from '../lang/LanguageContext.jsx';

// Bottom-left ops readout: status LED, region, deployed commit, session uptime.
// The commit SHA is injected at build time (Vercel system env); clicking the
// pill opens the terminal — the two are a matched pair of "system" chrome.
const pad = (n) => String(n).padStart(2, '0');

const StatusPill = () => {
  const { lang } = useLang();
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(secs / 3600);
  const uptime = h > 0
    ? `${h}:${pad(Math.floor((secs % 3600) / 60))}:${pad(secs % 60)}`
    : `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;

  return (
    <button
      type="button"
      className="status-pill"
      data-cursor="hover"
      title={`build ${__COMMIT_SHA__} · ${__BUILD_TIME__}`}
      onClick={() => window.dispatchEvent(new CustomEvent('portfolio:toggle-terminal'))}
      aria-label={lang === 'fr' ? 'État du système — ouvrir le terminal' : 'System status — open terminal'}
    >
      <span className="led" />
      <span>{lang === 'fr' ? 'opérationnel' : 'operational'}</span>
      <span className="sep">·</span>
      <span>nte · eu-west-3</span>
      <span className="sep">·</span>
      <span className="val">{__COMMIT_SHA__}</span>
      <span className="sep">·</span>
      <span>up <span className="val">{uptime}</span></span>
    </button>
  );
};

export default StatusPill;
