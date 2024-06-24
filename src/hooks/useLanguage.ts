import { Dates } from '@app/constants/Dates';
import { LanguageType } from '@app/interfaces/interfaces';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@fontsource/cairo';
import '@fontsource/lato';

export const useLanguage = (): {
  language: LanguageType;
  setLanguage: (locale: LanguageType) => Promise<void>;
  direction: 'ltr' | 'rtl';
} => {
  const { i18n } = useTranslation();
  const [localLanguage, setLocalLanguage] = useState<LanguageType>(
    (localStorage.getItem('Go Movaro-lang') as LanguageType) || 'en',
  );
  const handleChangeLanguage = useCallback(
    async (locale: LanguageType) => {
      Dates.setLocale(locale);
      localStorage.setItem('Go Movaro-lang', locale);
      await i18n.changeLanguage(locale);
      setLocalLanguage(locale);
    },
    [i18n],
  );

  useEffect(() => {
    i18n.language === 'ar'
      ? (document.body.style.fontFamily = 'Cairo, sans-serif')
      : (document.body.style.fontFamily = 'Lato, sans-serif');
  }, [i18n.language]);

  useEffect(() => {
    localLanguage && handleChangeLanguage(localLanguage);
  }, [handleChangeLanguage, localLanguage]);

  return useMemo(
    () => ({
      language: i18n.language as LanguageType,
      setLanguage: handleChangeLanguage,
      direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
    }),
    [handleChangeLanguage, i18n.language],
  );
};
