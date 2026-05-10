import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        common: {
          dashboard: 'Dashboard',
          markets: 'Markets',
          trade: 'Trade',
          portfolio: 'Portfolio',
          wallet: 'Wallet',
          transactions: 'Transactions',
          rewards: 'Rewards',
          leaderboard: 'Leaderboard',
          settings: 'Settings',
          help: 'Help & Support',
        }
      }
    }
  });

export default i18n;
