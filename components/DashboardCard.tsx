import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-card dark:bg-gray-800 rounded-xl p-4 flex items-center space-x-4 shadow">
      <div className="bg-primary/10 text-primary p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-text-secondary dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-text-primary dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;