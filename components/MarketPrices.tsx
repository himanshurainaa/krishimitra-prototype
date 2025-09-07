import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { fetchMarketPrices } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';
import MarketIcon from './icons/MarketIcon';

const MarketPrices: React.FC = () => {
  const { t } = useLocalization();
  const [prices, setPrices] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGetPrices = async () => {
    setIsLoading(true);
    setError('');
    setPrices('');
    try {
      const result = await fetchMarketPrices();
      setPrices(result);
    } catch (err)
 {
      setError(t('errorMarket'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#1c2e26]/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-green-500/20">
        <div className="flex items-center gap-3 mb-4">
            <MarketIcon className="w-6 h-6 text-green-400"/>
            <h2 className="text-xl font-bold text-gray-200">{t('marketPricesTitle')}</h2>
        </div>
      <button
        onClick={handleGetPrices}
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-[0_0_15px_rgba(52,211,153,0.3)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
      >
        {isLoading ? (
             <span className="flex items-center justify-center gap-2">
                <SpinnerIcon /> {t('fetchingPrices')}
            </span>
        ) : t('getMarketPrices')}
      </button>

      <div className="mt-6 min-h-[100px] bg-[#101d16] p-4 rounded-lg">
        {error && <p className="text-red-400 font-semibold text-center">{error}</p>}
        {prices && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-green-300 mb-2">{t('marketPricesFor')}</h3>
            <div className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{prices}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPrices;