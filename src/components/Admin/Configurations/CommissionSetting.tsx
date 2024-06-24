import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { EditOutlined } from '@ant-design/icons';
import { Details, DetailsRow, DetailsTitle, DetailsValue, TableButton } from '@app/components/GeneralStyles';
import EditCommissionSetting from '@app/components/modal/EditCommissionSetting';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { useResponsive } from '@app/hooks/useResponsive';
import { CommiossionSettingConfig } from '@app/interfaces/interfaces';
import {
  GetCommissionForBranchesWithoutCompany,
  SetCommissionForBranchesWithoutCompany,
} from '@app/services/configurations';
import { Alert, Row, Tooltip, message } from 'antd';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@app/hooks/reduxHooks';

const CommissionSetting = () => {
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    edit: false,
  });
  const [editmodaldata, setEditmodaldata] = useState<any>(undefined);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    SetCommissionForBranchesWithoutCompany: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('SetCommissionForBranchesWithoutCompany')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        SetCommissionForBranchesWithoutCompany: true,
      }));
    }
  }, [userPermissions]);

  const [commissionForBranchesWithOutCompany, setCommissionForBranchesWithOutCompany] = useState<
    CommiossionSettingConfig | undefined
  >(undefined);

  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isDesktop, isTablet } = useResponsive();

  //  Aois
  const { isRefetching, refetch } = useQuery(['CommissionGroup'], () => {
    GetCommissionForBranchesWithoutCompany()
      .then((data: any) => {
        const result = data?.data?.result;
        setCommissionForBranchesWithOutCompany(result);
        setLoading(!data.data?.success);
      })
      .catch((err: any) => {
        notificationController.error({ message: err?.message || err.error?.message });
      });
  });

  const editCommissionGroup = useMutation((data: CommiossionSettingConfig) =>
    SetCommissionForBranchesWithoutCompany(data),
  );

  const handledit = (data: CommiossionSettingConfig) => {
    editCommissionGroup
      .mutateAsync(data)
      .then((data: any) => {
        setIsEdit(data?.data?.success);

        message.open({
          content: <Alert message={t(`config.editCommissionSettingSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  //
  useEffect(() => {
    setLoading(true);
    refetch();
    setIsEdit(false);
  }, [isEdit, refetch, language]);

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editCommissionGroup.isLoading }));
  }, [editCommissionGroup.isLoading]);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  return (
    <>
      <Row justify={'end'}>
        {/*    EDIT    */}
        {modalState.edit && (
          <EditCommissionSetting
            values={editmodaldata}
            visible={modalState.edit}
            onCancel={() => handleModalClose('edit')}
            onEdit={(data: any) => editmodaldata !== undefined && handledit(data)}
            isLoading={editCommissionGroup.isLoading}
          />
        )}
      </Row>

      <Card
        title={t('config.commissionSettings')}
        bordered={false}
        extra={
          hasPermissions.SetCommissionForBranchesWithoutCompany && (
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setModalState;
                  setEditmodaldata(commissionForBranchesWithOutCompany);
                  handleModalOpen('edit');
                }}
              >
                <EditOutlined />
              </TableButton>
            </Tooltip>
          )
        }
        loading={loading}
      >
        <Details>
          <DetailsRow key={1}>
            <DetailsTitle style={{ width: '95%', marginRight: '0' }}>
              {t('config.commissionForBranchesWithOutCompany')}
            </DetailsTitle>
            <DetailsValue>{commissionForBranchesWithOutCompany?.commissionForBranchesWithOutCompany}</DetailsValue>
          </DetailsRow>
        </Details>
      </Card>
    </>
  );
};

export default CommissionSetting;
