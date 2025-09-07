import React, { useState } from 'react';
import { AppView } from './types';
import Header from './components/Header';
import FeatureCard from './components/FeatureCard';
import Chatbot from './components/Chatbot';
import PestDetector from './components/PestDetector';
import WeatherAdvisor from './components/WeatherAdvisor';
import MarketPrices from './components/MarketPrices';
import SoilHealthAdvisor from './components/SoilHealthAdvisor';
import LiveAdvisor from './components/LiveAdvisor';
import { useLocalization } from './hooks/useLocalization';
import ChatIcon from './components/icons/ChatIcon';
import LeafIcon from './components/icons/LeafIcon';
import SunIcon from './components/icons/SunIcon';
import MarketIcon from './components/icons/MarketIcon';
import SoilHealthIcon from './components/icons/SoilHealthIcon';
import VideoIcon from './components/icons/VideoIcon';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
  const { t } = useLocalization();

  const renderDashboard = () => (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
      <FeatureCard
        title={t('aiAssistant')}
        icon={<ChatIcon />}
        onClick={() => setCurrentView(AppView.Chatbot)}
        style={{ animationDelay: '100ms' }}
      />
      <FeatureCard
        title={t('plantHealth')}
        icon={<LeafIcon />}
        onClick={() => setCurrentView(AppView.PestDetector)}
        style={{ animationDelay: '200ms' }}
      />
      <FeatureCard
        title={t('weatherAdvisor')}
        icon={<SunIcon />}
        onClick={() => setCurrentView(AppView.WeatherAdvisor)}
        style={{ animationDelay: '300ms' }}
      />
      <FeatureCard
        title={t('marketPrices')}
        icon={<MarketIcon />}
        onClick={() => setCurrentView(AppView.MarketPrices)}
        style={{ animationDelay: '400ms' }}
      />
      <FeatureCard
        title={t('soilHealthAdvisor')}
        icon={<SoilHealthIcon />}
        onClick={() => setCurrentView(AppView.SoilHealth)}
        style={{ animationDelay: '500ms' }}
      />
      <FeatureCard
        title={t('liveAdvisor')}
        icon={<VideoIcon />}
        onClick={() => setCurrentView(AppView.LiveAdvisor)}
        style={{ animationDelay: '600ms' }}
      />
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case AppView.Chatbot:
        return <Chatbot />;
      case AppView.PestDetector:
        return <PestDetector />;
      case AppView.WeatherAdvisor:
        return <WeatherAdvisor />;
      case AppView.MarketPrices:
        return <MarketPrices />;
      case AppView.SoilHealth:
        return <SoilHealthAdvisor />;
      case AppView.LiveAdvisor:
        return <LiveAdvisor />;
      default:
        return renderDashboard();
    }
  };

  const isDashboard = currentView === AppView.Dashboard;
  const isLiveAdvisor = currentView === AppView.LiveAdvisor;

  return (
    <div className="min-h-screen font-sans">
      {!isLiveAdvisor && <Header />}
      <main className="container mx-auto max-w-7xl p-4 sm:p-8">
        {!isDashboard && !isLiveAdvisor && (
          <button
            onClick={() => setCurrentView(AppView.Dashboard)}
            className="mb-6 flex items-center gap-2 text-green-300 hover:text-green-100 font-semibold transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="p-2 bg-[#1c2e26] rounded-full border border-green-500/20 group-hover:border-green-400 transition-colors">
               <ArrowLeftIcon />
            </div>
            <span className="hidden sm:inline">{t('backToDashboard')}</span>
          </button>
        )}
        <div key={currentView} className={isLiveAdvisor ? '' : 'animate-fade-in'}>
           {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;