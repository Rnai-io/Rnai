import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS, LangCode, Translations } from '../i18n';

const STORAGE_KEY = '@rnai/lang';
const DEFAULT_LANG: LangCode = 'th';

const isValidLang = (code: string | null): code is LangCode =>
  !!code && Object.prototype.hasOwnProperty.call(TRANSLATIONS, code);

interface LanguageContextType {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);

  // Hydrate the saved language once on startup.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(saved => { if (isValidLang(saved)) setLangState(saved); })
      .catch(() => {});
  }, []);

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    AsyncStorage.setItem(STORAGE_KEY, code).catch(() => {});
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
