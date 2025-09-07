import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Language } from '../types';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const languageOptions = [
    { code: Language.EN, key: 'english' },
    { code: Language.HI, key: 'hindi' },
    { code: Language.TA, key: 'tamil' },
    { code: Language.TE, key: 'telugu' },
    { code: Language.KN, key: 'kannada' },
    { code: Language.ML, key: 'malayalam' },
    { code: Language.BN, key: 'bengali' },
    { code: Language.MR, key: 'marathi' },
    { code: Language.GU, key: 'gujarati' },
    { code: Language.PA, key: 'punjabi' },
  ];

  return (
    <header className="sticky top-0 z-10 p-4 sm:p-6 flex justify-between items-center bg-[#101d16]/80 backdrop-blur-lg border-b border-green-500/10">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-300 tracking-wider uppercase" style={{ textShadow: '0 0 10px rgba(52, 211, 153, 0.5)' }}>
        {t('appTitle')}
      </h1>
      <div>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-[#1c2e26] text-green-200 p-2 rounded-lg border border-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label={t('language')}
        >
          {languageOptions.map(opt => (
            <option key={opt.code} value={opt.code}>{t(opt.key)}</option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;
