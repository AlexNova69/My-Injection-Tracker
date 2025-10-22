
// Fix: Removed self-import of 'InjectionSite' that conflicted with its local declaration.

export type InjectionSite = 'abdomen_left' | 'abdomen_right' | 'arm_left' | 'arm_right';

export interface Injection {
  id: string;
  date: string;
  dose: number;
  site: InjectionSite;
  comment?: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

export interface SideEffect {
  id: string;
  date: string;
  description: string;
}

export interface Measurement {
  id:string;
  date: string;
  neck?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
}

export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | '';
  age: number | '';
  height: number | '';
  startWeight: number | '';
  goalWeight: number | '';
  medication: string;
  dailyCalories: number | null;
  rotationSites: InjectionSite[];
}

export interface AllData {
    injections: Injection[];
    weights: WeightEntry[];
    sideEffects: SideEffect[];
    measurements: Measurement[];
    profile: UserProfile;
    injectionSites: Record<InjectionSite, string>;
}

export type HistoryItem = (Injection | WeightEntry | SideEffect | Measurement) & { type: 'injection' | 'weight' | 'side-effect' | 'measurement' };