import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { fetchSoilAdvice } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';
import SoilHealthIcon from './icons/SoilHealthIcon';

const SoilHealthAdvisor: React.FC = () => {
  const { t } = useLocalization();
  const [soilType, setSoilType] = useState('');
  const [cropName, setCropName] = useState('');
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGetAdvice = async () => {
    if (!soilType || !cropName) {
      setError('Please select a soil type and enter a crop name.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAdvice('');
    try {
      const result = await fetchSoilAdvice(soilType, cropName);
      setAdvice(result);
    } catch (err) {
      setError(t('errorSoilAdvice'));
    } finally {
      setIsLoading(false);
    }
  };

  const soilTypes = [
    { key: 'alluvialSoil', value: 'Alluvial' },
    { key: 'blackSoil', value: 'Black' },
    { key: 'redSoil', value: 'Red' },
    { key: 'lateriteSoil', value: 'Laterite' },
    { key: 'desertSoil', value: 'Desert' },
    { key: 'mountainSoil', value: 'Mountain' },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-[#1c2e26]/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-green-500/20">
      <div className="flex items-center gap-3 mb-4">
        <SoilHealthIcon className="w-6 h-6 text-green-400"/>
        <h2 className="text-xl font-bold text-gray-200">{t('soilHealthAdvisorTitle')}</h2>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
            <label htmlFor="soil-type" className="block text-sm font-medium text-green-300 mb-1">{t('soilType')}</label>
            <select
                id="soil-type"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-[#101d16] text-gray-200 p-3 rounded-lg border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <option value="" disabled>{t('soilType')}</option>
                {soilTypes.map(st => (
                    <option key={st.key} value={st.value}>{t(st.key)}</option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="crop-name" className="block text-sm font-medium text-green-300 mb-1">{t('cropName')}</label>
            <input
                type="text"
                id="crop-name"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder={t('cropNamePlaceholder')}
                className="w-full bg-[#101d16] text-gray-200 p-3 rounded-lg border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
            />
        </div>
      </div>

      <button
        onClick={handleGetAdvice}
        disabled={isLoading || !soilType || !cropName}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-[0_0_15px_rgba(52,211,153,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
      >
        {isLoading ? (
            <span className="flex items-center justify-center gap-2">
                <SpinnerIcon /> {t('fetchingSoilAdvice')}
            </span>
        ) : t('getSoilAdvice')}
      </button>

      <div className="mt-6 min-h-[100px] bg-[#101d16] p-4 rounded-lg">
        {error && <p className="text-red-400 font-semibold text-center">{error}</p>}
        {advice && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-green-300 mb-2">{`${t('soilAdviceFor')} ${cropName}`}</h3>
            <div className="prose prose-sm prose-invert max-w-none text-gray-300 whitespace-pre-wrap">{advice}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilHealthAdvisor;
