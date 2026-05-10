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
          referrals: 'Referrals',
          notifications: 'Notifications',
          kyc: 'KYC Verification',
          profile: 'Profile',
          buy: 'Buy',
          sell: 'Sell',
          deposit: 'Deposit',
          withdraw: 'Withdraw',
          submit: 'Submit',
          cancel: 'Cancel',
          search: 'Search'
        }
      },
      de: {
        common: {
          dashboard: 'Dashboard',
          markets: 'Märkte',
          trade: 'Handel',
          portfolio: 'Portfolio',
          wallet: 'Brieftasche',
          transactions: 'Transaktionen',
          rewards: 'Belohnungen',
          leaderboard: 'Bestenliste',
          settings: 'Einstellungen',
          help: 'Hilfe & Support',
          referrals: 'Empfehlungen',
          notifications: 'Benachrichtigungen',
          kyc: 'KYC-Verifizierung',
          profile: 'Profil',
          buy: 'Kaufen',
          sell: 'Verkaufen',
          deposit: 'Einzahlung',
          withdraw: 'Auszahlung',
          submit: 'Absenden',
          cancel: 'Abbrechen',
          search: 'Suche'
        }
      }
    }
  });

export default i18n;
