import { useLanguage } from '@app/hooks/useLanguage';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../buttons/Button/Button';

interface Props {
  text: string;
  maxLength: number;
}

export const ShowMoreText: React.FC<Props> = ({ text, maxLength }) => {
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const displayText = showAll ? text : text.slice(0, maxLength);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      <p
        style={{
          // fontSize: isDesktop
          //   ? FONT_SIZE.md
          //   : isTablet
          //   ? FONT_SIZE.sm
          //   : isMobile
          //   ? FONT_SIZE.xs
          //   : mobileOnly
          //   ? FONT_SIZE.xxs
          //   : '',
          fontFamily: language === 'en' ? FONT_FAMILY.en : FONT_FAMILY.ar,
        }}
      >
        {displayText}
      </p>
      {!showAll && text.length > maxLength && (
        <Button type="text" onClick={toggleShowAll}>
          {t('common.ShowMore')}
        </Button>
      )}
    </>
  );
};
