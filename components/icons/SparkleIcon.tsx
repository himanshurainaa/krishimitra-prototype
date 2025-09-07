import React from 'react';

const SparkleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
        <defs>
            <radialGradient id="sparkleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: 'rgba(167, 243, 208, 1)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(34, 197, 94, 1)', stopOpacity: 1 }} />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#glow)">
            <path d="M50 0 L58.78 41.22 L100 50 L58.78 58.78 L50 100 L41.22 58.78 L0 50 L41.22 41.22 Z" fill="url(#sparkleGradient)" transform="scale(0.6) translate(33, 33)" />
            <path d="M50 20 L54.39 45.61 L80 50 L54.39 54.39 L50 80 L45.61 54.39 L20 50 L45.61 45.61 Z" fill="url(#sparkleGradient)" transform="scale(0.3) translate(116, 116)" />
        </g>
    </svg>
);

export default SparkleIcon;