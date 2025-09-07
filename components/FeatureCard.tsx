import React from 'react';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  style?: React.CSSProperties;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon, onClick, style }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#1c2e26] p-6 rounded-2xl shadow-lg shadow-black/20 border border-green-500/10 hover:border-green-400/50 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center transform hover:-translate-y-2 active:scale-95 animate-fade-in group"
      style={style}
    >
      <div className="w-16 h-16 mb-4 text-green-400 group-hover:text-green-300 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-md sm:text-lg font-bold text-gray-200 group-hover:text-white transition-colors duration-300">{title}</h3>
    </div>
  );
};

export default FeatureCard;