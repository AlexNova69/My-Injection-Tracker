import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { UserProfile, AllData, InjectionSite } from '../types';
import { INJECTION_SITES } from '../constants';
import ConfirmDialog from '../components/ConfirmDialog'; // New import

const ProfilePage: React.FC = () => {
  console.log("ProfilePage re-render"); // Diagnostic log
  const { profile, setProfile, deleteAllData, injections, weights, sideEffects, measurements, importData, theme, setTheme } = useData();
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [activityLevel, setActivityLevel] = useState(1.2);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for custom confirmation modal

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Fix: Coerce value to number if input type is number
    const processedValue = type === 'number' && value !== '' ? Number(value) : value;
    
    setLocalProfile(prev => ({ ...prev, [name]: processedValue as any }));
  };

  const handleRotationChange = useCallback((site: InjectionSite) => {
    const currentSites = localProfile.rotationSites || [];
    const newSites = currentSites.includes(site)
      ? currentSites.filter(s => s !== site)
      : [...currentSites, site];
    setLocalProfile(prev => ({ ...prev, rotationSites: newSites }));
  }, [localProfile]);

  const handleSave = useCallback(() => {
    setProfile(localProfile);
    alert('Профиль сохранен!');
  }, [localProfile, setProfile]);

  const handleExport = useCallback(() => {
    const dataToExport: AllData = {
        injections,
        weights,
        sideEffects,
        measurements,
        profile,
        injectionSites: INJECTION_SITES,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    const date = new Date().toISOString().split('T')[0];
    link.download = `injection-tracker-backup-${date}.json`;
    link.click();
  }, [injections, weights, sideEffects, measurements, profile]);

  const handleImportClick = useCallback(() => {
      fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const text = e.target?.result;
              if (typeof text !== 'string') throw new Error("File content is not a string");
              
              const importedData = JSON.parse(text);
              
              if ('injections' in importedData && 'weights' in importedData && 'sideEffects' in importedData && 'measurements' in importedData && 'profile' in importedData && 'injectionSites' in importedData) {
                  importData(importedData);
              } else {
                  throw new Error("Неверный формат файла.");
              }
          } catch (error) {
              console.error("Error importing data:", error);
              alert(`Ошибка при импорте данных: ${error instanceof Error ? error.message : 'Unknown error'}`);
          } finally {
              if (event.target) {
                  event.target.value = '';
              }
          }
      };
      reader.readAsText(file);
  }, [importData]);
  
  const calculateCalories = useCallback(() => {
    const currentWeight = weights.length > 0 ? [...weights].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight : localProfile.startWeight;

    if(!localProfile.gender || !currentWeight || !localProfile.height || !localProfile.age) {
        alert("Пожалуйста, заполните пол, вес, рост и возраст для расчета.");
        return;
    }
    
    const weight = Number(currentWeight);
    const height = Number(localProfile.height);
    const age = Number(localProfile.age);
    
    let bmr = 0;
    if(localProfile.gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = Math.round(bmr * activityLevel);

    setLocalProfile(prev => ({...prev, dailyCalories: tdee}));
    alert(`Ваша примерная суточная норма калорий: ${tdee} ккал`);
  }, [activityLevel, localProfile, weights]);

  // Fix: Ensure the value passed to the input is always a string to prevent type errors.
  const InputField: React.FC<{name: keyof UserProfile; label: string; type?: string;}> = ({ name, label, type = 'text' }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-text-secondary dark:text-gray-400">{label}</label>
      <input type={type} id={name} name={name} value={String(localProfile[name] ?? '')} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
    </div>
  );

  const handleConfirmDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    deleteAllData(); // Call the actual data clearing function from context
    alert('Все данные удалены.'); // Show success alert after deletion
  }, [deleteAllData]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Профиль</h1>
      <div className="bg-card dark:bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-bold">Личная информация</h2>
        <InputField name="name" label="Имя" />
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Пол</label>
          <select name="gender" value={localProfile.gender || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Не выбрано</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>
        <InputField name="age" label="Возраст" type="number" />
        <InputField name="height" label="Рост (см)" type="number" />
        <InputField name="startWeight" label="Вес на начало (кг)" type="number" />
        <InputField name="goalWeight" label="Желаемый вес (кг)" type="number" />
        <InputField name="medication" label="Препарат" />
        <div className="flex justify-end">
            <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">Сохранить профиль</button>
        </div>
      </div>
      
       <div className="bg-card dark:bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-bold">Настройки ротации мест инъекций</h2>
        <p className="text-sm text-text-secondary dark:text-gray-400">
            Выберите места, которые вы используете для инъекций. Приложение будет рекомендовать их поочередно.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(INJECTION_SITES).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={localProfile.rotationSites?.includes(key as InjectionSite) || false}
                        onChange={() => handleRotationChange(key as InjectionSite)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500"
                    />
                    <span className="text-text-primary dark:text-gray-200">{value}</span>
                </label>
            ))}
        </div>
      </div>

      <div className="bg-card dark:bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-bold">Расчет суточной нормы калорий</h2>
        <p className="text-sm text-text-secondary dark:text-gray-400">Формула Миффлина-Сент-Джеора. Результат является приблизительным.</p>
        <div>
          <label htmlFor="activity" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Уровень активности</label>
          <select id="activity" value={activityLevel} onChange={(e) => setActivityLevel(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value={1.2}>Минимальная (сидячая работа)</option>
            <option value={1.375}>Легкая (тренировки 1-3 раза в неделю)</option>
            <option value={1.55}>Средняя (тренировки 3-5 раз в неделю)</option>
            <option value={1.725}>Высокая (тренировки 6-7 раз в неделю)</option>
            <option value={1.9}>Очень высокая (тяжелая физ. работа, проф. спорт)</option>
          </select>
        </div>
        {localProfile.dailyCalories && (
            <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 p-3 rounded-md text-center">
                <p>Ваша норма: <span className="font-bold">{localProfile.dailyCalories} ккал/день</span></p>
            </div>
        )}
        <div className="flex justify-end">
          <button onClick={calculateCalories} className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90">Рассчитать</button>
        </div>
      </div>

      <div className="bg-card dark:bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-bold">Оформление</h2>
        <div className="flex items-center justify-between">
            <span className="text-text-secondary dark:text-gray-300">Темная тема</span>
            <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out ${
                theme === 'dark' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
            }`}
            >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
            </button>
        </div>
      </div>
      
      <div className="bg-card dark:bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-bold">Управление данными</h2>
        <p className="text-sm text-text-secondary dark:text-gray-400">Сохраните резервную копию ваших данных или восстановите их из файла.</p>
        <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleExport} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Экспорт данных</button>
            <button onClick={handleImportClick} className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Импорт данных</button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />
        </div>
      </div>
      
      <div className="bg-card dark:bg-gray-800 rounded-xl p-6 shadow">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-500">Опасная зона</h2>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-2 mb-4">Это действие приведет к полному и безвозвратному удалению всех ваших данных в приложении.</p>
        <button onClick={() => {
            console.log("Delete button clicked!"); // Diagnostic log for button click
            setShowDeleteConfirm(true); // Open the custom confirmation modal
        }} className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Удалить все данные</button>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog 
          title="Подтверждение удаления"
          message="Вы уверены, что хотите удалить все данные? Это действие необратимо."
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;