import React from 'react';
import { InjectionSite } from '../types';
import { INJECTION_SITES } from '../constants';

interface InjectionSiteSelectorProps {
  onClose: () => void;
  // This component is currently for display only, but can be extended
}

const InjectionSiteSelector: React.FC<InjectionSiteSelectorProps> = ({ onClose }) => {
  // In a real app, you'd fetch recent injection sites from context
  // and highlight them on the diagram.

  return (
    <div className="space-y-4">
      <p className="text-center text-text-secondary dark:text-gray-400">Эта схема показывает рекомендуемые места для инъекций. Ведите учет, чтобы избежать уколов в одно и то же место.</p>
      
      <div className="flex justify-center items-center p-4">
        <svg 
          width="200" 
          height="320" 
          viewBox="0 0 200 320" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-400 dark:text-gray-600"
        >
          {/* Head */}
          <circle cx="100" cy="40" r="30" fill="currentColor" />
          
          {/* Neck */}
          <rect x="90" y="70" width="20" height="20" fill="currentColor" />

          {/* Body */}
          <path 
            d="M 70 90 L 50 95 L 40 110 L 30 180 L 60 280 H 140 L 170 180 L 160 110 L 150 95 L 130 90 Z" 
            fill="currentColor"
          />
          
          {/* Injection Sites */}
          <g className="text-primary cursor-pointer group">
            <circle cx="85" cy="180" r="12" fillOpacity="0.3" className="group-hover:fill-primary/50 transition-all" />
            <circle cx="85" cy="180" r="6" fill="currentColor" stroke="#fff" strokeWidth="2" className="dark:stroke-gray-800" />
            <title>{INJECTION_SITES.abdomen_left}</title>
          </g>

          <g className="text-primary cursor-pointer group">
            <circle cx="115" cy="180" r="12" fillOpacity="0.3" className="group-hover:fill-primary/50 transition-all" />
            <circle cx="115" cy="180" r="6" fill="currentColor" stroke="#fff" strokeWidth="2" className="dark:stroke-gray-800" />
            <title>{INJECTION_SITES.abdomen_right}</title>
          </g>

          <g className="text-primary cursor-pointer group">
            <circle cx="52" cy="130" r="12" fillOpacity="0.3" className="group-hover:fill-primary/50 transition-all" />
            <circle cx="52" cy="130" r="6" fill="currentColor" stroke="#fff" strokeWidth="2" className="dark:stroke-gray-800" />
            <title>{INJECTION_SITES.arm_left}</title>
          </g>
          
          <g className="text-primary cursor-pointer group">
            <circle cx="148" cy="130" r="12" fillOpacity="0.3" className="group-hover:fill-primary/50 transition-all" />
            <circle cx="148" cy="130" r="6" fill="currentColor" stroke="#fff" strokeWidth="2" className="dark:stroke-gray-800" />
            <title>{INJECTION_SITES.arm_right}</title>
          </g>

        </svg>
      </div>

      <div className="flex justify-end">
        <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default InjectionSiteSelector;