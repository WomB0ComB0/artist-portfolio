import { create } from 'zustand';

type CookieConsentStore = {
  cookieConsent: boolean;
  isLoaded: boolean;
  setCookieConsent: (value: boolean) => void;
  setIsLoaded: (value: boolean) => void;
};

export const useCookieConsentStore = create<CookieConsentStore>((set) => ({
  cookieConsent: false,
  isLoaded: false,
  setCookieConsent: (value) => set({ cookieConsent: value }),
  setIsLoaded: (value) => set({ isLoaded: value }),
}));
