
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SideEffect } from '../../types';

interface SideEffectFormProps {
  onClose: () => void;
  sideEffect?: SideEffect;
}

const SideEffectForm: React.FC<SideEffectFormProps> = ({ onClose, sideEffect }) => {
  const { addSideEffect, updateSideEffect } = useData();
  const [date, setDate] = useState(sideEffect?.date || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(sideEffect?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    const data = { date, description };

    if (sideEffect) {
        updateSideEffect({ ...sideEffect, ...data });
    } else {
        addSideEffect(data);
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
        <label htmlFor="description" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Описание</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required></textarea>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
          {sideEffect ? 'Обновить' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};

export default SideEffectForm;