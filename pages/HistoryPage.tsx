
import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { HistoryItem, Injection, WeightEntry, SideEffect, Measurement } from '../types';
import { Syringe, Weight, ShieldAlert, Trash2, Edit, Ruler } from 'lucide-react';
import Modal from '../components/Modal';
import InjectionForm from '../components/forms/InjectionForm';
import WeightForm from '../components/forms/WeightForm';
import SideEffectForm from '../components/forms/SideEffectForm';
import MeasurementForm from '../components/forms/MeasurementForm';
import { INJECTION_SITES } from '../constants';

const HistoryPage: React.FC = () => {
  const { injections, weights, sideEffects, measurements, deleteInjection, deleteWeight, deleteSideEffect, deleteMeasurement } = useData();
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);

  const historyItems = useMemo((): HistoryItem[] => {
    const allItems: HistoryItem[] = [
      ...injections.map(i => ({ ...i, type: 'injection' as const })),
      ...weights.map(w => ({ ...w, type: 'weight' as const })),
      ...sideEffects.map(s => ({ ...s, type: 'side-effect' as const })),
      ...measurements.map(m => ({ ...m, type: 'measurement' as const })),
    ];
    return allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [injections, weights, sideEffects, measurements]);

  const handleDelete = (item: HistoryItem) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
        switch(item.type) {
            case 'injection': deleteInjection(item.id); break;
            case 'weight': deleteWeight(item.id); break;
            case 'side-effect': deleteSideEffect(item.id); break;
            case 'measurement': deleteMeasurement(item.id); break;
        }
    }
  }
  
  const renderItemDetails = (item: HistoryItem) => {
      switch(item.type) {
          case 'injection':
              const inj = item as Injection;
              return `Доза: ${inj.dose} мг, Место: ${INJECTION_SITES[inj.site]}. ${inj.comment || ''}`;
          case 'weight':
              return `Вес: ${(item as WeightEntry).weight} кг`;
          case 'side-effect':
              return `Описание: ${(item as SideEffect).description}`;
          case 'measurement':
              const m = item as Measurement;
              const details = [
                  m.neck && `Шея: ${m.neck} см`,
                  m.waist && `Талия: ${m.waist} см`,
                  m.hips && `Бёдра: ${m.hips} см`,
                  m.shoulders && `Плечи: ${m.shoulders} см`,
              ].filter(Boolean).join(', ');
              return details ? `Замеры: ${details}` : 'Замеры не указаны';
      }
  }

  const getIcon = (type: HistoryItem['type']) => {
      const className = "mr-4 text-primary";
      switch(type) {
          case 'injection': return <Syringe size={24} className={className} />;
          case 'weight': return <Weight size={24} className={className} />;
          case 'side-effect': return <ShieldAlert size={24} className={className} />;
          case 'measurement': return <Ruler size={24} className={className} />;
      }
  }
  
  const renderModalContent = () => {
    if (!editingItem) return null;
    switch(editingItem.type) {
        case 'injection': return <InjectionForm injection={editingItem as Injection} onClose={() => setEditingItem(null)} />;
        case 'weight': return <WeightForm weightEntry={editingItem as WeightEntry} onClose={() => setEditingItem(null)} />;
        case 'side-effect': return <SideEffectForm sideEffect={editingItem as SideEffect} onClose={() => setEditingItem(null)} />;
        case 'measurement': return <MeasurementForm measurement={editingItem as Measurement} onClose={() => setEditingItem(null)} />;
        default: return null;
    }
  };
  
  const getModalTitle = () => {
    if (!editingItem) return '';
    switch(editingItem.type) {
        case 'injection': return 'Редактировать инъекцию';
        case 'weight': return 'Редактировать вес';
        case 'side-effect': return 'Редактировать побочный эффект';
        case 'measurement': return 'Редактировать замеры';
        default: return 'Редактировать запись';
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">История записей</h1>
      <div className="space-y-4">
        {historyItems.length > 0 ? historyItems.map((item) => (
          <div key={`${item.type}-${item.id}`} className="bg-card dark:bg-gray-800 rounded-xl p-4 shadow flex items-center justify-between">
            <div className="flex items-center overflow-hidden">
                {getIcon(item.type)}
                <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-text-primary dark:text-gray-100">{new Date(item.date).toLocaleDateString('ru-RU')}</p>
                    <p className="text-sm text-text-secondary dark:text-gray-400 truncate">{renderItemDetails(item)}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
                <button onClick={() => setEditingItem(item)} className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(item)} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Trash2 size={18} />
                </button>
            </div>
          </div>
        )) : <p className="text-center text-text-secondary dark:text-gray-400">История пуста. Добавьте первую запись на главном экране.</p>}
      </div>
      {editingItem && (
        <Modal title={getModalTitle()} onClose={() => setEditingItem(null)}>
            {renderModalContent()}
        </Modal>
      )}
    </div>
  );
};

export default HistoryPage;