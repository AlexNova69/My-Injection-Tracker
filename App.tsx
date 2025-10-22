
import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ChartsPage from './pages/ChartsPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';
import { Home, List, BarChart3, User } from 'lucide-react';

export type Page = 'home' | 'history' | 'charts' | 'profile';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'history':
        return <HistoryPage />;
      case 'charts':
        return <ChartsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };
  
  // Fix: Explicitly type `navItems` to ensure `id` is of type `Page`, which resolves the type error when passing it to `BottomNav`.
  const navItems: { id: Page; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Дом', icon: Home },
    { id: 'history', label: 'История', icon: List },
    { id: 'charts', label: 'Графики', icon: BarChart3 },
    { id: 'profile', label: 'Профиль', icon: User },
  ];

  return (
    <DataProvider>
      <div className="min-h-screen font-sans antialiased text-text-primary bg-background dark:bg-gray-900 dark:text-gray-200 flex flex-col">
        <main className="flex-grow pb-20">
          <div className="max-w-4xl mx-auto p-4">
             {renderPage()}
          </div>
        </main>
        <BottomNav items={navItems} activePage={activePage} onNavigate={setActivePage} />
      </div>
    </DataProvider>
  );
};

export default App;