import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: '/translations/{{lng}}.json',
    },
  });

export default i18n;
