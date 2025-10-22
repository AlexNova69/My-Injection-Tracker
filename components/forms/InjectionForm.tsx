
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Injection, InjectionSite } from '../../types';
import { DEFAULT_DOSES, INJECTION_SITES } from '../../constants';

interface InjectionFormProps {
  onClose: () => void;
  injection?: Injection;
}

const InjectionForm: React.FC<InjectionFormProps> = ({ onClose, injection }) => {
  const { addInjection, updateInjection } = useData();
  const [date, setDate] = useState(injection?.date || new Date().toISOString().split('T')[0]);
  const [dose, setDose] = useState<number | string>(injection?.dose || DEFAULT_DOSES[0]);
  const [customDose, setCustomDose] = useState('');
  const [site, setSite] = useState<InjectionSite>(injection?.site || 'abdomen_left');
  const [comment, setComment] = useState(injection?.comment || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDose = dose === 'custom' ? parseFloat(customDose) : (dose as number);
    if (isNaN(finalDose)) return;

    const injectionData = { date, dose: finalDose, site, comment };
    
    if (injection) {
      updateInjection({ ...injection, ...injectionData });
    } else {
      addInjection(injectionData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Дата</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary dark:text-gray-400">Доза</label>
        <div className="flex space-x-2 mt-1">
          {DEFAULT_DOSES.map(d => (
            <button type="button" key={d} onClick={() => setDose(d)} className={`px-3 py-1 rounded-full text-sm ${dose === d ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200'}`}>{d}</button>
          ))}
          <button type="button" onClick={() => setDose('custom')} className={`px-3 py-1 rounded-full text-sm ${dose === 'custom' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200'}`}>Своя</button>
        </div>
        {dose === 'custom' && (
          <input type="number" step="0.01" value={customDose} onChange={(e) => setCustomDose(e.target.value)} placeholder="Введите дозу" className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
        )}
      </div>
       <div>
        <label htmlFor="site" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Место инъекции</label>
        <select id="site" value={site} onChange={(e) => setSite(e.target.value as InjectionSite)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {Object.entries(INJECTION_SITES).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Комментарий</label>
        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
          {injection ? 'Обновить' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};

export default InjectionForm;