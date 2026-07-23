import { create } from 'zustand';
import { translations } from '../utils/translations';

const getInitialLang = () => {
  return localStorage.getItem('weshareit_lang') || 'ID';
};

const useLanguageStore = create((set, get) => ({
  lang: getInitialLang(),
  setLang: (newLang) => {
    localStorage.setItem('weshareit_lang', newLang);
    set({ lang: newLang });
  },
  t: (key) => {
    const { lang } = get();
    return translations[lang]?.[key] || translations['ID']?.[key] || key;
  }
}));

export default useLanguageStore;
