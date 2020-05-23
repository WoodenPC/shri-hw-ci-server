import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en.json';
import ru from './translations/ru.json';

const resources: Resource = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
