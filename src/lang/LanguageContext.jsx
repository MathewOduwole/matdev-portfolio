import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Lightweight i18n — two languages, dictionary-free. Each call site passes
// both translations: `t('Hello', 'Bonjour')`. For larger JSX paragraphs,
// branch on `lang` directly via `useLang()`.

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

const STORAGE_KEY = 'portfolio-lang';
const VALID = ['en', 'fr'];

const readInitial = () => {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return VALID.includes(stored) ? stored : 'en';
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(readInitial);

  const setLang = useCallback((next) => {
    if (!VALID.includes(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable — silently ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => useContext(LanguageContext);

// Returns a translator function. Call sites pass both versions inline:
//   const t = useT();
//   <h1>{t('About', 'À propos')}</h1>
export const useT = () => {
  const { lang } = useContext(LanguageContext);
  return useCallback((en, fr) => (lang === 'fr' ? fr : en), [lang]);
};
