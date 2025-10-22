import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { AllData, Injection, WeightEntry, SideEffect, Measurement, UserProfile, InjectionSite } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { INJECTION_SITES } from '../constants';

interface DataContextType {
  injections: Injection[];
  weights: WeightEntry[];
  sideEffects: SideEffect[];
  measurements: Measurement[];
  profile: UserProfile;
  theme: 'light' | 'dark';
  addInjection: (injection: Omit<Injection, 'id'>) => void;
  updateInjection: (injection: Injection) => void;
  deleteInjection: (id: string) => void;
  addWeight: (weight: Omit<WeightEntry, 'id'>) => void;
  updateWeight: (weight: WeightEntry) => void;
  deleteWeight: (id: string) => void;
  addSideEffect: (sideEffect: Omit<SideEffect, 'id'>) => void;
  updateSideEffect: (sideEffect: SideEffect) => void;
  deleteSideEffect: (id: string) => void;
  addMeasurement: (measurement: Omit<Measurement, 'id'>) => void;
  updateMeasurement: (measurement: Measurement) => void;
  deleteMeasurement: (id: string) => void;
  setProfile: (profile: UserProfile) => void;
  deleteAllData: () => void;
  importData: (data: AllData) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const defaultUserProfile: UserProfile = {
  name: '',
  gender: '',
  age: '',
  height: '',
  startWeight: '',
  goalWeight: '',
  medication: '',
  dailyCalories: null,
  rotationSites: Object.keys(INJECTION_SITES) as InjectionSite[],
};

// Factory function to create a new default AllData object every time
const createDefaultAllData = (): AllData => ({
  injections: [],
  weights: [],
  sideEffects: [],
  measurements: [],
  profile: { ...defaultUserProfile }, // Ensure profile is also a new object, not just a reference
  injectionSites: INJECTION_SITES,
});

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log("DataProvider re-render"); // Diagnostic log for provider renders
  const [allData, setAllData] = useLocalStorage<AllData>('injectionTrackerData', createDefaultAllData());
  const [theme, setThemeState] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Stabilize all data modification functions with useCallback
  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  }, [setThemeState]);

  const addInjection = useCallback((injection: Omit<Injection, 'id'>) => {
    setAllData(prev => ({
      ...prev,
      injections: [...prev.injections, { ...injection, id: uuidv4() }]
    }));
  }, [setAllData]);

  const updateInjection = useCallback((updatedInjection: Injection) => {
    setAllData(prev => ({
      ...prev,
      injections: prev.injections.map(inj => inj.id === updatedInjection.id ? updatedInjection : inj)
    }));
  }, [setAllData]);

  const deleteInjection = useCallback((id: string) => {
    setAllData(prev => ({
      ...prev,
      injections: prev.injections.filter(inj => inj.id !== id)
    }));
  }, [setAllData]);

  const addWeight = useCallback((weight: Omit<WeightEntry, 'id'>) => {
    setAllData(prev => ({
      ...prev,
      weights: [...prev.weights, { ...weight, id: uuidv4() }]
    }));
  }, [setAllData]);

  const updateWeight = useCallback((updatedWeight: WeightEntry) => {
    setAllData(prev => ({
      ...prev,
      weights: prev.weights.map(w => w.id === updatedWeight.id ? updatedWeight : w)
    }));
  }, [setAllData]);

  const deleteWeight = useCallback((id: string) => {
    setAllData(prev => ({
      ...prev,
      weights: prev.weights.filter(w => w.id !== id)
    }));
  }, [setAllData]);

  const addSideEffect = useCallback((sideEffect: Omit<SideEffect, 'id'>) => {
    setAllData(prev => ({
      ...prev,
      sideEffects: [...prev.sideEffects, { ...sideEffect, id: uuidv4() }]
    }));
  }, [setAllData]);

  const updateSideEffect = useCallback((updatedSideEffect: SideEffect) => {
    setAllData(prev => ({
      ...prev,
      sideEffects: prev.sideEffects.map(se => se.id === updatedSideEffect.id ? updatedSideEffect : se)
    }));
  }, [setAllData]);

  const deleteSideEffect = useCallback((id: string) => {
    setAllData(prev => ({
      ...prev,
      sideEffects: prev.sideEffects.filter(se => se.id !== id)
    }));
  }, [setAllData]);

  const addMeasurement = useCallback((measurement: Omit<Measurement, 'id'>) => {
    setAllData(prev => ({
      ...prev,
      measurements: [...prev.measurements, { ...measurement, id: uuidv4() }]
    }));
  }, [setAllData]);

  const updateMeasurement = useCallback((updatedMeasurement: Measurement) => {
    setAllData(prev => ({
      ...prev,
      measurements: prev.measurements.map(m => m.id === updatedMeasurement.id ? updatedMeasurement : m)
    }));
  }, [setAllData]);

  const deleteMeasurement = useCallback((id: string) => {
    setAllData(prev => ({
      ...prev,
      measurements: prev.measurements.filter(m => m.id !== id)
    }));
  }, [setAllData]);

  const setProfile = useCallback((profile: UserProfile) => {
    setAllData(prev => ({ ...prev, profile }));
  }, [setAllData]);

  // deleteAllData now just performs the data reset, UI confirmation is handled by ProfilePage
  const deleteAllData = useCallback(() => {
    console.log("deleteAllData executed!"); // Diagnostic log for actual execution
    setAllData(createDefaultAllData()); // Crucial: Always set a NEW object reference
  }, [setAllData]);

  const importData = useCallback((data: AllData) => {
      // Merge with default profile to ensure all keys are present, especially new ones
      const importedProfile = { ...defaultUserProfile, ...data.profile };
      // Ensure we set a new object reference for allData
      const newAllData = {
        ...data,
        profile: importedProfile,
        injectionSites: data.injectionSites || INJECTION_SITES // Ensure injectionSites is present
      };
      setAllData(newAllData);
      alert('Данные успешно импортированы!');
  }, [setAllData]);


  // Memaize contextValue to ensure stability, depends on allData, theme, and stable functions
  const contextValue = useMemo(() => ({
    ...allData,
    theme,
    addInjection,
    updateInjection,
    deleteInjection,
    addWeight,
    updateWeight,
    deleteWeight,
    addSideEffect,
    updateSideEffect,
    deleteSideEffect,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    setProfile,
    deleteAllData,
    importData,
    setTheme,
  }), [
    allData,
    theme,
    addInjection, updateInjection, deleteInjection,
    addWeight, updateWeight, deleteWeight,
    addSideEffect, updateSideEffect, deleteSideEffect,
    addMeasurement, updateMeasurement, deleteMeasurement,
    setProfile,
    deleteAllData,
    importData,
    setTheme,
  ]);


  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};