import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { fetchWeatherAdvice } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';
import SunIcon from './icons/SunIcon';
import { WeatherForecast } from '../types';
import SunnyIcon from './icons/weather/SunnyIcon';
import CloudyIcon from './icons/weather/CloudyIcon';
import PartlyCloudyIcon from './icons/weather/PartlyCloudyIcon';
import RainyIcon from './icons/weather/RainyIcon';
import StormyIcon from './icons/weather/StormyIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

const WeatherIcon: React.FC<{ condition: string }> = ({ condition }) => {
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) return <SunnyIcon />;
    if (lowerCaseCondition.includes('partly cloudy')) return <PartlyCloudyIcon />;
    if (lowerCaseCondition.includes('cloud')) return <CloudyIcon />;
    if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) return <RainyIcon />;
    if (lowerCaseCondition.includes('storm') || lowerCaseCondition.includes('thunder')) return <StormyIcon />;
    return <SunIcon />; // Default icon
};

const WeatherAdvisor: React.FC = () => {
  const { t } = useLocalization();
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  useEffect(() => {
    const getAdvice = async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await fetchWeatherAdvice();
        setForecasts(result);
      } catch (err) {
        setError(t('errorWeather'));
      } finally {
        setIsLoading(false);
      }
    };
    getAdvice();
  }, [t]);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#1c2e26]/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-green-500/20">
      <div className="flex items-center gap-3 mb-4">
        <SunIcon className="w-6 h-6 text-green-400"/>
        <h2 className="text-xl font-bold text-gray-200">{t('weatherAdvisorTitle')}</h2>
      </div>
      
      <div className="mt-4 min-h-[250px] bg-[#101d16] p-4 rounded-lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <SpinnerIcon />
            <p className="mt-4 text-lg font-semibold text-green-300">{t('fetchingWeather')}</p>
          </div>
        ) : error ? (
          <p className="text-red-400 font-semibold text-center">{error}</p>
        ) : (
          <div className="space-y-2">
            {forecasts.map((forecast, index) => (
              <div key={index} className="bg-[#1c2e26]/70 rounded-lg border border-green-500/20 overflow-hidden">
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 text-green-300"><WeatherIcon condition={forecast.condition} /></div>
                     <span className="font-bold text-lg text-green-200">{forecast.day}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-300 font-semibold">{forecast.temp}</span>
                    <ChevronDownIcon className={`w-6 h-6 text-green-400 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4">
                    <p className="text-gray-400 text-sm mb-2 italic">{forecast.condition}</p>
                    <p className="text-gray-200 text-sm">{forecast.advice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAdvisor;
