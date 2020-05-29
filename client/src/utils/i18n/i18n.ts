import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
//import Backend from 'i18next-http-backend';

import translationEn from './translations/en.json';
import translationsRu from './translations/ru.json';

const resources: Resource = {
  en: {
    translation: translationEn,
  },
  ru: {
    translation: translationsRu,
  },
};

i18n
  .use(initReactI18next)
  //.use(Backend)
  .use(LanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: 'translations/{{lng}}.json',
    },
  });

export default i18n;
