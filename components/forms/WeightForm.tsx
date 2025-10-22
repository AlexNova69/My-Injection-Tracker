
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { WeightEntry } from '../../types';

interface WeightFormProps {
  onClose: () => void;
  weightEntry?: WeightEntry;
}

const WeightForm: React.FC<WeightFormProps> = ({ onClose, weightEntry }) => {
  const { addWeight, updateWeight } = useData();
  const [date, setDate] = useState(weightEntry?.date || new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState(weightEntry?.weight || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    
    const data = { date, weight: Number(weight) };

    if (weightEntry) {
      updateWeight({ ...weightEntry, ...data });
    } else {
      addWeight(data);
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
        <label htmlFor="weight" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Вес (кг)</label>
        <input type="number" step="0.1" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
          {weightEntry ? 'Обновить' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};

export default WeightForm;