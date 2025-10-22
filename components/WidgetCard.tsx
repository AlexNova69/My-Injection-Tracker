import React from 'react';

interface WidgetCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: 'primary' | 'secondary' | 'red' | 'yellow';
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, icon, onClick, color }) => {
    const colorClasses = {
        primary: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
        secondary: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
        red: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
        yellow: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400',
    };

  return (
    <button
      onClick={onClick}
      className={`bg-card dark:bg-gray-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 shadow hover:shadow-md transition-shadow duration-200 aspect-square`}
    >
      <div className={`p-4 rounded-full ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="font-semibold text-text-primary dark:text-gray-200 text-sm">{title}</p>
    </button>
  );
};

export default WidgetCard;