import React from 'react';

const SoilHealthIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-full w-full ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l-2 2m2-2l2 2m-2-2v-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.929 17.071c-.781.781-1.229 1.838-1.229 2.929h16.6c0-1.091-.448-2.148-1.229-2.929C17.552 15.552 15.39 14 12 14c-3.39 0-5.552 1.552-7.071 3.071z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 10a2 2 0 114 0 2 2 0 01-4 0z" />
    </svg>
);

export default SoilHealthIcon;
