import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Row, message } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { AddCotactUs, UpdateContactUs, getContactUs } from '@app/services/contactUs';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button } from '@app/components/common/buttons/Button/Button';
import { EditOutlined } from '@ant-design/icons';
import { EditContactUs } from '@app/components/modal/EditContactUs';
import { CreateButtonText } from '../../GeneralStyles';
import styled from 'styled-components';
import { DAYS_OF_WEEK_NAME, PHONE_NUMBER_CODE, TIME_HOURS_MINUTES } from '@app/constants/appConstants';
import dayjs from 'dayjs';
import { ContactUsModel } from '@app/interfaces/interfaces';
import { AddContactUs } from '@app/components/modal/AddContactUs';

export type specifierType = {
  name: string;
  value: number | undefined;
};

export type companyData = {
  companyCode: string;
  id: number;
};

const ContactUs: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactData, setContacData] = useState<any>();
  // const [isOpenEditModalForm, setIsOpenEditModalForm] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<any | undefined>(undefined);
  const [startDay, setStartDay] = useState<string | undefined>('');
  const [endDay, setEndDay] = useState<string | undefined>('');
  const [noData, setNoData] = useState<boolean>(false);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const DetailsRow = styled.div`
    display: flex;
    justify-content: flex-start;
  `;

  const DetailsTitle = styled.div`
    color: var(--text-light-color);
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.semibold};
    margin-right: 0.5rem;
    width: 25%;
  `;

  const DetailsValue = styled.div`
    color: var(--text-main-color);
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.medium};
  `;

  const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin: 1.25rem 0.5rem;
  `;

  const { refetch, isRefetching } = useQuery(['getContactUs'], () =>
    getContactUs()
      .then((data) => {
        const result = data.data?.result;
        setContacData(result);
        setLoading(!data.data?.success);
      })
      .catch((error) => {
        console.log(error);
        if ((error = '{0} Not Found700')) {
          setNoData(true);
        } else notificationController.error({ message: error.message || error.error?.message });
        setLoading(false);
      }),
  );

  const addContactInfo = useMutation((data: ContactUsModel) =>
    AddCotactUs(data)
      .then((data) => {
        notificationController.success({ message: t('contactUs.addContactInfoSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
        setNoData(false);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addContactInfo.isLoading }));
  }, [addContactInfo.isLoading]);

  const handleEdit = (data: ContactUsModel) => {
    editContactInfo
      .mutateAsync({ ...data })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`contactUs.editContactSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  const editContactInfo = useMutation((data: ContactUsModel) => UpdateContactUs(data));

  useEffect(() => {
    if (isRefetching) {
      setLoading(true);
    } else setLoading(false);
  }, [isRefetching, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsEdit(false);
    setRefetchOnAdd(false);
  }, [isEdit, refetch, language, refetchOnAdd]);

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editContactInfo.isLoading }));
  }, [editContactInfo.isLoading]);

  useEffect(() => {
    if (contactData) getDaysName();
  }, [contactData]);

  const getDaysName = () => {
    const startDay = DAYS_OF_WEEK_NAME.find((item) => contactData?.startDay === item?.day);
    setStartDay(startDay?.dayName);
    const endDay = DAYS_OF_WEEK_NAME.find((item) => contactData?.endDay === item?.day);
    setEndDay(endDay?.dayName);
  };

  return (
    <>
      {noData && (
        <Card
          title={t('contactUs.contactUsInfo')}
          padding={contactData == undefined || contactData == null ? '1.25rem 1.25rem 1.25rem' : '1.25rem 1.25rem 0'}
        >
          <Row justify={'end'}>
            <Button
              type="primary"
              style={{
                marginBottom: '.5rem',
                width: 'auto',
                height: 'auto',
              }}
              onClick={() => handleModalOpen('add')}
            >
              <CreateButtonText>{t('contactUs.addContactUs')}</CreateButtonText>
            </Button>
          </Row>
        </Card>
      )}

      {!noData && (
        <>
          <PageTitle>{t('contactUs.contactUsInfo')}</PageTitle>
          <Row>
            <Card
              title={t('contactUs.contactUsInfo')}
              padding="0 1.25rem 1rem 1.25rem"
              style={{ width: '100%', height: 'auto' }}
            >
              <Spinner spinning={loading}>
                <Details>
                  <DetailsRow key={1}>
                    <DetailsTitle>{t('common.name')}</DetailsTitle>
                    <DetailsValue>{contactData?.name}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={2}>
                    <DetailsTitle> {t('common.address')} </DetailsTitle>
                    <DetailsValue>{contactData?.address}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={3}>
                    <DetailsTitle> {t('common.description')} </DetailsTitle>
                    <DetailsValue>{contactData?.description}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={4}>
                    <DetailsTitle> {t('contactUs.emailAddress')} </DetailsTitle>
                    <DetailsValue>{contactData?.emailAddress}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={5}>
                    <DetailsTitle> {t('contactUs.phoneNumber')} </DetailsTitle>
                    <DetailsValue>{contactData?.phoneNumber}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={13}>
                    <DetailsTitle> {t('common.telephoneNumber')} </DetailsTitle>
                    <DetailsValue>{contactData?.telephoneNumber}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={14}>
                    <DetailsTitle> {t('contactUs.whatsNumber')} </DetailsTitle>
                    <DetailsValue>{contactData?.whatsNumber}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={6}>
                    <DetailsTitle> {t('contactUs.facebook')} </DetailsTitle>
                    <DetailsValue>{contactData?.facebook}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={7}>
                    <DetailsTitle> {t('contactUs.instgram')} </DetailsTitle>
                    <DetailsValue>{contactData?.instgram}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={8}>
                    <DetailsTitle> {t('contactUs.twitter')} </DetailsTitle>
                    <DetailsValue>{contactData?.twitter}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={9}>
                    <DetailsTitle> {t('contactUs.startDate')} </DetailsTitle>
                    <DetailsValue>{t(`contactUs.daysOfWeek.${startDay}`)}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={10}>
                    <DetailsTitle> {t('contactUs.endDate')} </DetailsTitle>
                    <DetailsValue>{t(`contactUs.daysOfWeek.${endDay}`)}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={11}>
                    <DetailsTitle> {t('contactUs.startTime')} </DetailsTitle>
                    <DetailsValue>{dayjs(contactData?.startTime).format(TIME_HOURS_MINUTES)}</DetailsValue>
                  </DetailsRow>
                  <DetailsRow key={12}>
                    <DetailsTitle> {t('contactUs.endTime')} </DetailsTitle>
                    <DetailsValue>{dayjs(contactData?.endTime).format(TIME_HOURS_MINUTES)}</DetailsValue>
                  </DetailsRow>
                </Details>
              </Spinner>
            </Card>

            <Button
              type="primary"
              style={{
                margin: '1rem 1rem 1rem 0',
                width: 'auto',
                height: 'auto',
              }}
              onClick={() => {
                setEditmodaldata(contactData);
                handleModalOpen('edit');
              }}
              icon={<EditOutlined />}
            >
              <CreateButtonText>{t('common.edit')}</CreateButtonText>
            </Button>
          </Row>
        </>
      )}

      {/*    Add    */}
      {modalState.add && (
        <AddContactUs
          visible={modalState.add}
          onCancel={() => handleModalClose('add')}
          onCreate={(info) => {
            addContactInfo.mutateAsync(info);
          }}
          isLoading={addContactInfo.isLoading}
        />
      )}

      {/*    EDIT    */}
      {modalState.edit && (
        <EditContactUs
          contact_values={editmodaldata}
          visible={modalState.edit}
          onCancel={() => handleModalClose('edit')}
          onEdit={(data: any) => {
            const id = editmodaldata.id;
            const values = { ...data, id };
            editmodaldata !== undefined && handleEdit(values);
          }}
          isLoading={editContactInfo.isLoading}
        />
      )}
    </>
  );
};

export default ContactUs;
