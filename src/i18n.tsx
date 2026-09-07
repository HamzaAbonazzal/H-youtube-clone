import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationAR from './locales/ar.json';

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// ضبط اتجاه الصفحة ولغتها عند الإقلاع لأول مرة
// const initialLang = i18n.language || 'en';
// document.dir = initialLang.startsWith('ar') ? 'rtl' : 'ltr';
// document.documentElement.lang = initialLang;

// التحديث التلقائي لاتجاه الصفحة ولغة HTML عند تغيير المستخدم للغة
// i18n.on('languageChanged', (lng) => {
//   const isArabic = lng.startsWith('ar');
//   document.dir = isArabic ? 'rtl' : 'ltr';
//   document.documentElement.lang = lng;
// });

export default i18n;