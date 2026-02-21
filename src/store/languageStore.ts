import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'hi' | 'mr' | 'ta';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
];

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getLanguageName: () => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',

      setLanguage: (language: Language) => {
        set({ currentLanguage: language });
      },

      getLanguageName: () => {
        const lang = languages.find((l) => l.code === get().currentLanguage);
        return lang?.nativeName || 'English';
      },
    }),
    {
      name: 'fleetflow-language',
    }
  )
);
