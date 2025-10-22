
import { InjectionSite } from './types';

export const DEFAULT_DOSES = [0.25, 0.5, 1, 1.5];

export const INJECTION_SITES: Record<InjectionSite, string> = {
  abdomen_left: 'Живот слева',
  abdomen_right: 'Живот справа',
  arm_left: 'Рука слева',
  arm_right: 'Рука справа',
};
