import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { EmailSetting } from './EmailSetting';
import { SmsSetting } from './SmsSetting';
import { FileSizeSetting } from './FileSizeSetting';
import { HoursInSystemSetting } from './HoursInSystemSetting';
import { DiscountPercentageSetting } from './DiscountPercentageSetting';
import CommissionSetting from './CommissionSetting';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const Configurations: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();

  const [hasPermissions, setHasPermissions] = useState({
    GetEmailSetting: false,
    GetSmsSetting: false,
    GetFileSizeSetting: false,
    GetHoursInSystem: false,
    GetDiscountPercentage: false,
    GetCommissionForBranchesWithoutCompany: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('GetEmailSetting')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        GetEmailSetting: true,
      }));
    }

    if (userPermissions.includes('GetSmsSetting')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        GetSmsSetting: true,
      }));
    }

    if (userPermissions.includes('GetFileSizeSetting')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        GetFileSizeSetting: true,
      }));
    }

    if (userPermissions.includes('GetHoursInSystem')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        GetHoursInSystem: true,
      }));
    }

    if (userPermissions.includes('GetDiscountPercentage')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        GetDiscountPercentage: true,
      }));
    }

    if (userPermissions.includes('GetCommissionForBranchesWithoutCompany')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        GetCommissionForBranchesWithoutCompany: true,
      }));
    }
  }, [userPermissions]);

  return (
    <>
      <Row gutter={20}>
        {hasPermissions.GetEmailSetting && (
          <Col span={24} style={{ marginBottom: '2rem' }}>
            <EmailSetting />
          </Col>
        )}
        {hasPermissions.GetSmsSetting && (
          <Col span={24} style={{ marginBottom: '2rem' }}>
            <SmsSetting />
          </Col>
        )}
        {hasPermissions.GetFileSizeSetting && (
          <Col span={24} style={{ marginBottom: '2rem' }}>
            <FileSizeSetting />
          </Col>
        )}

        {hasPermissions.GetHoursInSystem && (
          <Col span={24} style={{ marginBottom: '2rem' }}>
            <HoursInSystemSetting />
          </Col>
        )}
        {hasPermissions.GetDiscountPercentage && (
          <Col span={24} style={{ marginBottom: '2rem' }}>
            <DiscountPercentageSetting />
          </Col>
        )}
        {hasPermissions.GetCommissionForBranchesWithoutCompany && (
          <Col span={24} style={{ marginBottom: '2rem' }}>
            <CommissionSetting />
          </Col>
        )}
      </Row>
    </>
  );
};
