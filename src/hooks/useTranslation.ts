import { useTranslation as useI18nTranslation } from 'react-i18next';

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (language: 'en' | 'pt') => {
    i18n.changeLanguage(language);
  };

  const currentLanguage = i18n.language;

  return {
    t,
    changeLanguage,
    currentLanguage,
    isRTL: i18n.dir() === 'rtl',
  };
} 