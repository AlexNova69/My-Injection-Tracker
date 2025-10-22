
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Measurement } from '../../types';

interface MeasurementFormProps {
  onClose: () => void;
  measurement?: Measurement;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ onClose, measurement }) => {
  const { addMeasurement, updateMeasurement } = useData();
  const [date, setDate] = useState(measurement?.date || new Date().toISOString().split('T')[0]);
  const [neck, setNeck] = useState(measurement?.neck?.toString() || '');
  const [waist, setWaist] = useState(measurement?.waist?.toString() || '');
  const [hips, setHips] = useState(measurement?.hips?.toString() || '');
  const [shoulders, setShoulders] = useState(measurement?.shoulders?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: Omit<Measurement, 'id'> & { id?: string } = { date };
    if (neck) data.neck = parseFloat(neck);
    if (waist) data.waist = parseFloat(waist);
    if (hips) data.hips = parseFloat(hips);
    if (shoulders) data.shoulders = parseFloat(shoulders);

    if (Object.keys(data).length <= 1) return; // Only date is present

    if (measurement) {
      updateMeasurement({ ...measurement, ...data });
    } else {
      addMeasurement(data as Omit<Measurement, 'id'>);
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
        <label htmlFor="neck" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Шея (см)</label>
        <input type="number" step="0.1" id="neck" value={neck} onChange={(e) => setNeck(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      </div>
      <div>
        <label htmlFor="waist" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Талия (см)</label>
        <input type="number" step="0.1" id="waist" value={waist} onChange={(e) => setWaist(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      </div>
      <div>
        <label htmlFor="hips" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Бёдра (см)</label>
        <input type="number" step="0.1" id="hips" value={hips} onChange={(e) => setHips(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      </div>
       <div>
        <label htmlFor="shoulders" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Плечи (см)</label>
        <input type="number" step="0.1" id="shoulders" value={shoulders} onChange={(e) => setShoulders(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
          {measurement ? 'Обновить' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};

export default MeasurementForm;