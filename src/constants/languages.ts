import { LanguageType } from '@app/interfaces/interfaces';

interface Language {
  id: number;
  name: LanguageType;
  title: string;
  countryCode: string;
}

export const languages: Language[] = [
  {
    id: 1,
    name: 'en',
    title: 'English',
    countryCode: 'gb',
  },
  {
    id: 2,
    name: 'ar',
    title: 'Syria',
    countryCode: 'sy',
  },
];
