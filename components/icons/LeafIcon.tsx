import React from 'react';

const LeafIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-full w-full ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536A9 9 0 102.464 3.879a9 9 0 0011.657 11.657zM12 21V12a9 9 0 00-9-9" />
  </svg>
);

export default LeafIcon;
