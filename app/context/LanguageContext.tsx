import React, { createContext, useContext, useState, useCallback } from 'react';
import { TRANSLATIONS, LangCode, Translations } from '../i18n';

interface LanguageContextType {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('th');

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
  }, []);

  const t = TRANSLATIONS[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Primary hook — access full typed translation object */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
