import React, { useEffect, useState } from 'react';
import { Col, Row as R } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import styled from 'styled-components';
import { media } from '@app/styles/themes/constants';
import { useTranslation } from 'react-i18next';
import ServiceStatistics from '@app/components/Admin/Statistics/ServiceStatistics';
import GeneralStatistics from '@app/components/Admin/Statistics/GeneralStatistics';
import CitiesStatistics from '@app/components/Admin/Statistics/CitiesStatistics';
import CompaniesStatistics from '@app/components/Admin/Statistics/CompaniesStatistics';
import BranchesStatistics from '@app/components/Admin/Statistics/BranchesStatistics';
import UsersStatistics from '@app/components/Admin/Statistics/UsersStatistics';
import UsersInYearStatistics from '@app/components/Admin/Statistics/UsersInYearStatistics';
import RequestsInTimeLineStatistics from '@app/components/Admin/Statistics/RequestsStatistics';
import UsersViaBrokersStatistics from '@app/components/Admin/Statistics/UsersViaBrokersStatistics';
import { useAppSelector } from '@app/hooks/reduxHooks';

const Row = styled(R)`
  @media only screen and ${media.xl} {
    padding: 1.3rem 2.3rem 2rem 2.3rem;
  }
`;

const Statistics: React.FC = () => {
  const { t } = useTranslation();
  const [hasPermissions, setHasPermissions] = useState({
    RequestsInTimeLineStatistics: false,
    UsersInYearStatistics: false,
    UsersStatistics: false,
    UsersViaBrokersStatistics: false,
    CompaniesStatistics: false,
    BranchesStatistics: false,
    ServiceStatistics: false,
    CitiesStatistics: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Request.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        RequestsInTimeLineStatistics: true,
      }));
    }

    if (userPermissions.includes('Pages.Users.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        UsersInYearStatistics: true,
      }));
    }

    if (userPermissions.includes('Pages.Users.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        UsersStatistics: true,
      }));
    }

    if (userPermissions.includes('Pages.Users.List') && userPermissions.includes('Broker.FullControl')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        UsersViaBrokersStatistics: true,
      }));
    }

    if (userPermissions.includes('Company.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        CompaniesStatistics: true,
      }));
    }

    if (userPermissions.includes('CompanyBranch.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        BranchesStatistics: true,
      }));
    }

    if (userPermissions.includes('Service.FullControl')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        ServiceStatistics: true,
      }));
    }

    if (userPermissions.includes('City.FullControl')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        CitiesStatistics: true,
      }));
    }
  }, [userPermissions]);

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Statistics')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col id="GeneralStatistics" xs={24}>
          <GeneralStatistics />
        </Col>

        {hasPermissions.RequestsInTimeLineStatistics && (
          <Col id="RequestsInTimeLineStatistics" xs={24}>
            <RequestsInTimeLineStatistics />
          </Col>
        )}

        {hasPermissions.UsersInYearStatistics && (
          <Col id="UsersInYearStatistics" xs={24}>
            <UsersInYearStatistics />
          </Col>
        )}

        {hasPermissions.UsersStatistics && (
          <Col id="UsersStatistics" xs={24}>
            <UsersStatistics />
          </Col>
        )}

        {hasPermissions.UsersViaBrokersStatistics && (
          <Col id="UsersViaBrokersStatistics" xs={24}>
            <UsersViaBrokersStatistics />
          </Col>
        )}

        {hasPermissions.CompaniesStatistics && (
          <Col id="CompaniesStatistics" xs={24}>
            <CompaniesStatistics />
          </Col>
        )}

        {hasPermissions.BranchesStatistics && (
          <Col id="BranchesStatistics" xs={24}>
            <BranchesStatistics />
          </Col>
        )}

        {hasPermissions.ServiceStatistics && (
          <Col id="ServiceStatistics" xs={12}>
            <ServiceStatistics />
          </Col>
        )}

        {hasPermissions.CitiesStatistics && (
          <Col id="CitiesStatistics" xs={12}>
            <CitiesStatistics />
          </Col>
        )}
      </Row>
    </>
  );
};

export default Statistics;
