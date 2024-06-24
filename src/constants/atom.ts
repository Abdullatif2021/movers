import { atom } from 'jotai';
import { DEFAULT_PAGE_SIZE } from './pagination';

const IsSetGeneral = atom<boolean>(false);

const currentMyGamesPageAtom = atom<number>(1);
const currentGamesPageAtom = atom<number>(1);
const currentCompaniesPageAtom = atom<number>(1);
// eslint-disable-next-line
const gameStatusAtom = atom<any | undefined>(undefined);
// eslint-disable-next-line
const MyGameStatusAtom = atom<any | undefined>(undefined);

const gamesPageSizeAtom = atom<number>(DEFAULT_PAGE_SIZE);
const myGamesPageSizeAtom = atom<number>(DEFAULT_PAGE_SIZE);

const refetchOnDeleteArticleBlogAtom = atom<boolean>(false);
const refetchOnSwitchArticleActivationAtom = atom<boolean>(false);
const refetchOnUpdateArticleAtom = atom<boolean>(false);

const refetchOnDeleteVideoBlogAtom = atom<boolean>(false);
const refetchOnSwitchVideoActivationAtom = atom<boolean>(false);
const refetchOnUpdateVideoAtom = atom<boolean>(false);

export {
  // game settings
  IsSetGeneral,
  // games, my-games
  currentMyGamesPageAtom,
  currentGamesPageAtom,
  currentCompaniesPageAtom,
  gameStatusAtom,
  MyGameStatusAtom,
  gamesPageSizeAtom,
  myGamesPageSizeAtom,
  // Articles
  refetchOnDeleteArticleBlogAtom,
  refetchOnSwitchArticleActivationAtom,
  refetchOnUpdateArticleAtom,
  // Videos
  refetchOnDeleteVideoBlogAtom,
  refetchOnSwitchVideoActivationAtom,
  refetchOnUpdateVideoAtom,
};
