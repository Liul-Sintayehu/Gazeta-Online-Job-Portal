import { create } from 'zustand';

interface WeaponAlertStore {
  isDeparturePassed: boolean;
  setIsDeparturePassed: (data: boolean) => void;
  isArrivalPassed: boolean;
  setIsArrivalPassed: (data: boolean) => void;
  isAlreadySent: boolean;
  setIsAlreadySent: (data: boolean) => void;
  checkAlertAlreadySent: () => void;
  setCheckAlertAlreadySent: (func: () => void) => void;
}

export const useWeaponAlertStore = create<WeaponAlertStore>(set => ({
  isDeparturePassed: false,
  setIsDeparturePassed: (data: boolean): void => {
    set({ isDeparturePassed: data });
  },
  isArrivalPassed: false,
  setIsArrivalPassed: (data: boolean): void => {
    set({ isArrivalPassed: data });
  },
  isAlreadySent: false,
  setIsAlreadySent: (data: boolean): void => {
    set({ isAlreadySent: data });
  },
  checkAlertAlreadySent: () => {},
  setCheckAlertAlreadySent: (func: () => void) => {
    set({ checkAlertAlreadySent: func });
  },
}));
