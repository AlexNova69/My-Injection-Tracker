import React from 'react';
import type { LucideProps } from 'lucide-react';
import type { Page } from '../App';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ComponentType<LucideProps>;
}

interface BottomNavProps {
  items: NavItem[];
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ items, activePage, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
      <div className="max-w-4xl mx-auto flex justify-around">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-full py-2 px-1 text-xs transition-colors duration-200 ${
              activePage === item.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'
            }`}
          >
            <item.icon size={24} strokeWidth={activePage === item.id ? 2.5 : 2} />
            <span className="mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;