
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import DashboardCard from '../components/DashboardCard';
import WidgetCard from '../components/WidgetCard';
import Modal from '../components/Modal';
import InjectionForm from '../components/forms/InjectionForm';
import WeightForm from '../components/forms/WeightForm';
import SideEffectForm from '../components/forms/SideEffectForm';
import MeasurementForm from '../components/forms/MeasurementForm';
import InjectionSiteSelector from '../components/InjectionSiteSelector';
import { Syringe, Weight, ShieldAlert, Ruler, Map, Calendar } from 'lucide-react';
import { InjectionSite } from '../types';
import { INJECTION_SITES } from '../constants';

type ModalType = 'injection' | 'weight' | 'side-effect' | 'measurement' | 'site-map' | null;

const HomePage: React.FC = () => {
  const { injections, weights, profile } = useData();
  const [modal, setModal] = useState<ModalType>(null);

  const lastInjection = useMemo(() => {
    return [...injections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [injections]);

  const currentWeight = useMemo(() => {
    return [...weights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [weights]);

  const daysSinceLastInjection = useMemo(() => {
    if (!lastInjection) return null;
    const lastDate = new Date(lastInjection.date);
    const today = new Date();
    // Fix: Ensure today's date doesn't include time for accurate day calculation
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Сегодня' : `${diffDays} дн. назад`;
  }, [lastInjection]);
  
  const nextInjectionSite = useMemo((): InjectionSite | null => {
    const rotationSites = profile.rotationSites && profile.rotationSites.length > 0
      ? profile.rotationSites
      : Object.keys(INJECTION_SITES) as InjectionSite[];

    if (rotationSites.length === 0) return null;

    if (!lastInjection) {
      return rotationSites[0];
    }

    const lastIndex = rotationSites.indexOf(lastInjection.site);

    if (lastIndex === -1) {
      return rotationSites[0];
    }

    return rotationSites[(lastIndex + 1) % rotationSites.length];
  }, [lastInjection, profile.rotationSites]);

  const renderModalContent = () => {
    switch(modal) {
        case 'injection': return <InjectionForm onClose={() => setModal(null)} />;
        case 'weight': return <WeightForm onClose={() => setModal(null)} />;
        case 'side-effect': return <SideEffectForm onClose={() => setModal(null)} />;
        case 'measurement': return <MeasurementForm onClose={() => setModal(null)} />;
        case 'site-map': return <InjectionSiteSelector onClose={() => setModal(null)} />;
        default: return null;
    }
  };
  
  const getModalTitle = () => {
      switch(modal) {
        case 'injection': return 'Новая инъекция';
        case 'weight': return 'Новая запись о весе';
        case 'side-effect': return 'Новый побочный эффект';
        case 'measurement': return 'Новое измерение';
        case 'site-map': return 'Карта мест инъекций';
        default: return '';
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Привет, {profile.name || 'пользователь'}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard 
            title="Последняя инъекция" 
            value={lastInjection ? `${lastInjection.dose} мг, ${daysSinceLastInjection}` : 'Нет данных'}
            icon={<Syringe size={24} />}
        />
        <DashboardCard 
            title="Текущий вес" 
            value={currentWeight ? `${currentWeight.weight} кг` : 'Нет данных'}
            icon={<Weight size={24} />}
        />
        <DashboardCard 
            title="Следующее место" 
            value={nextInjectionSite ? INJECTION_SITES[nextInjectionSite] : 'N/A'}
            icon={<Map size={24} />}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <WidgetCard title="Инъекция" icon={<Syringe size={32} />} onClick={() => setModal('injection')} color="primary" />
        <WidgetCard title="Вес" icon={<Weight size={32} />} onClick={() => setModal('weight')} color="secondary" />
        <WidgetCard title="Побочный эффект" icon={<ShieldAlert size={32} />} onClick={() => setModal('side-effect')} color="red" />
        <WidgetCard title="Замеры" icon={<Ruler size={32} />} onClick={() => setModal('measurement')} color="yellow" />
        <WidgetCard title="Карта мест" icon={<Map size={32} />} onClick={() => setModal('site-map')} color="primary" />
      </div>

      {modal && (
        <Modal title={getModalTitle()} onClose={() => setModal(null)}>
            {renderModalContent()}
        </Modal>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Предстоящие события</h2>
        <div className="bg-card dark:bg-gray-800 rounded-xl p-4 shadow flex items-center space-x-4">
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <Calendar size={24} />
          </div>
          <div>
            <p className="font-semibold">Следующая инъекция</p>
            <p className="text-sm text-text-secondary dark:text-gray-400">Рекомендуется сделать через 7 дней. Место: {nextInjectionSite ? INJECTION_SITES[nextInjectionSite] : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;