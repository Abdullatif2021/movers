export type CategoryType = 'services' | 'games' | 'notifications';

interface Category {
  name: CategoryType;
  title: string;
}

export const categoriesList: Category[] = [
  {
    name: 'services',
    title: 'Services',
  },
  {
    name: 'games',
    title: 'Games',
  },
  {
    name: 'notifications',
    title: 'Notifications',
  },
];
