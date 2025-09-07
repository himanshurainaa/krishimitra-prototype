
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Language } from '../types';
import { LOCALIZATION_STRINGS } from '../constants';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.EN);

  const t = useCallback((key: string): string => {
    // Attempt to get the string in the current language,
    // fall back to English if it's not found,
    // and finally fall back to the key itself as a last resort.
    return LOCALIZATION_STRINGS[language][key] 
           || LOCALIZATION_STRINGS[Language.EN][key] 
           || key;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
