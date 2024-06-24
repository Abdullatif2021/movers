import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Space } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button, Button as ButtonCol } from '@app/components/common/buttons/Button/Button';
import { useQuery } from 'react-query';
import { getAllDrafts } from '@app/services/drafts';
import { Table } from '@app/components/common/Table/Table';
import { notificationController } from '@app/controllers/notificationController';
import { CreateButtonText, Header } from '../../GeneralStyles';
import { RequestModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { useNavigate, useParams } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined } from '@ant-design/icons';
import { TextBack } from '@app/components/GeneralStyles';

export const Drafts: React.FC = () => {
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();
  const { userId } = useParams();

  const [dataSource, setDataSource] = useState<RequestModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const { refetch, isRefetching } = useQuery(
    ['Drafts'],
    () =>
      getAllDrafts(userId)
        .then((data) => {
          const result = data.data?.result?.items;
          setDataSource(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataSource === undefined,
    },
  );

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [language]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.completeDraft')}</Header>,
      dataIndex: 'completeDraft',
      render: (index: number, record: any) => {
        return (
          <Space>
            <ButtonCol
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                Navigate(`/${userId}/drafts/${record.id}/completeDraft`, { state: record.name });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('requests.completeDraft')}
              </div>
            </ButtonCol>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card title={t('requests.draftsList')} style={{ height: 'auto', marginBottom: '70px' }}>
        <Row justify={'end'}>
          <Btn
            style={{
              margin: '1rem 1rem 1rem 0',
              width: 'auto',
              height: 'auto',
            }}
            type="ghost"
            onClick={() => Navigate(-1)}
            icon={<LeftOutlined />}
          >
            <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
          </Btn>

          <Button
            type="primary"
            style={{
              margin: '1rem 1rem 1rem 0',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => Navigate(`/${userId}/addRequest`)}
          >
            <CreateButtonText>{t('requests.addNewRequest')}</CreateButtonText>
          </Button>
        </Row>

        <Table
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          loading={loading}
          dataSource={dataSource}
          scroll={{ x: isTablet || isMobile ? 950 : 800 }}
        />
      </Card>
    </>
  );
};
