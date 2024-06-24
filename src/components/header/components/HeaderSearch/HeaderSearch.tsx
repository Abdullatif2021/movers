import React, { useState } from 'react';
import { SearchDropdown } from '../searchDropdown/SearchDropdown';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './HeaderSearch.styles';

export const HeaderSearch: React.FC = () => {
  const { mobileOnly, isTablet } = useResponsive();

  const [query, setQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  return (
    <>
      {mobileOnly && (
        <>
          <Button
            type={isModalVisible ? 'ghost' : 'text'}
            icon={<S.SearchIcon onClick={() => setModalVisible(true)} />}
          />
          <S.SearchModal
            open={isModalVisible}
            closable={false}
            footer={null}
            onCancel={() => setModalVisible(false)}
            destroyOnClose
          >
            <SearchDropdown
              query={query}
              setQuery={setQuery}
              isOverlayVisible={isOverlayVisible}
              setOverlayVisible={setOverlayVisible}
            />
          </S.SearchModal>
        </>
      )}

      {isTablet && (
        <SearchDropdown
          query={query}
          setQuery={setQuery}
          isOverlayVisible={isOverlayVisible}
          setOverlayVisible={setOverlayVisible}
        />
      )}
    </>
  );
};
