import React, { useEffect, useRef, useState } from 'react';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { InputSearch } from '../HeaderSearch/HeaderSearch.styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setSearchString } from '@app/store/slices/searchSlice';
import { useLocation } from 'react-router-dom';

interface SearchOverlayProps {
  query: string;
  setQuery: (query: string) => void;
  isOverlayVisible: boolean;
  setOverlayVisible: (state: boolean) => void;
}

export const SearchDropdown: React.FC<SearchOverlayProps> = ({ query, setQuery, setOverlayVisible }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSearchChange = (event: any) => {
    const searchString = event?.target?.value ?? '';
    dispatch(setSearchString(searchString));
    setQuery(searchString);
  };

  useEffect(() => {
    setOverlayVisible(!!query);
  }, [query, setOverlayVisible]);

  useEffect(() => {
    dispatch(setSearchString(''));
    handleSearchChange('');
  }, [dispatch, location.pathname]);

  const ref = useRef<any>(null);

  return (
    <>
      <HeaderActionWrapper>
        {!(
          location.pathname === '/' ||
          location.pathname === '/commissionGroups' ||
          location.pathname === '/contactUs' ||
          location.pathname === '/Configurations'
        ) && (
          <InputSearch
            width="100%"
            value={query}
            placeholder={t('header.search')}
            onChange={handleSearchChange}
            enterButton={null}
            addonAfter={null}
          />
        )}
        <div ref={ref} />
      </HeaderActionWrapper>
    </>
  );
};
