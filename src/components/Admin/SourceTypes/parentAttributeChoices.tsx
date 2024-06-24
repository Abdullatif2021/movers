import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Row, Space, Tooltip, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import {
  getAllAttributeChoices,
  createAttributeChoice,
  DeleteAttributeChoice,
  UpdateAttributeChoice,
} from '@app/services/sourceTypes';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { Attachment, SourceTypeModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { EditOutlined, DeleteOutlined, LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddAttributeChoice } from '@app/components/modal/AddAttributeChoice';
import { EditAttributeChoice } from '@app/components/modal/EditAttributeChoice';
import { TableButton, Header, Modal, Image, TextBack, CreateButtonText } from '../../GeneralStyles';
import { useNavigate, useParams } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';

export type sourceTypes = {
  id: number;
  title: string;
  description: string;
  icon?: Attachment;
};

export const ParentAttributeChoices: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { attributeForSourceId } = useParams();
  const { desktopOnly, mobileOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<sourceTypes[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [dataSource, setDataSource] = useState<SourceTypeModel[] | undefined>(undefined);
  const [editmodaldata, setEditmodaldata] = useState<SourceTypeModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<SourceTypeModel | undefined>(undefined);
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['AttributeChoices', page, pageSize],
    () =>
      getAllAttributeChoices(attributeForSourceId, page, pageSize, searchString)
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          setData(result);
          setLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setLoading(false);
        }),
    {
      enabled: Data === undefined,
    },
  );

  useEffect(() => {
    if (isRefetching) {
      setLoading(true);
    } else setLoading(false);
  }, [isRefetching, refetch, refetchData]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsEdit(false);
    setIsDelete(false);
    setRefetchOnAdd(false);
  }, [isDelete, isEdit, refetchOnAdd, page, pageSize, searchString, refetch, refetchData]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addAttributeChoice = useMutation((data: SourceTypeModel) =>
    createAttributeChoice(data)
      .then((data) => {
        notificationController.success({
          message: t('attributeChoices.addAttributeChoiceSuccessMessage'),
        });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addAttributeChoice.isLoading }));
  }, [addAttributeChoice.isLoading]);

  const deleteAttributeChoice = useMutation((id: number) =>
    DeleteAttributeChoice(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: (
              <Alert message={t('attributeChoices.deleteAttributeChoiceSuccessMessage')} type={`success`} showIcon />
            ),
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleDelete = (id: any) => {
    if (page > 1 && dataSource?.length === 1) {
      deleteAttributeChoice.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteAttributeChoice.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteAttributeChoice.isLoading }));
  }, [deleteAttributeChoice.isLoading]);

  const editAttributeChoice = useMutation((data: SourceTypeModel) => UpdateAttributeChoice(data));

  const handleEdit = (data: SourceTypeModel, id: number) => {
    editAttributeChoice
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: (
            <Alert message={t(`attributeChoices.editAttributeChoiceSuccessMessage`)} type={`success`} showIcon />
          ),
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editAttributeChoice.isLoading }));
  }, [editAttributeChoice.isLoading]);

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [page, pageSize, language, refetch, refetchData]);

  useEffect(() => {
    if (page > 1 && Data?.length === 0) setPage(1);
  }, [page, Data]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>, dataIndex: 'name' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('sourceTypes.pointsToGiftToCompany')}</Header>,
      dataIndex: 'pointsToGiftToCompany',
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('sourceTypes.pointsToBuyRequest')}</Header>,
      dataIndex: 'pointsToBuyRequest',
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('attributeChoices.subAttributeChoice')}</Header>,
      dataIndex: 'types',
      render: (index: number, record: sourceTypes) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/attributesChild`, { state: record.title });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('attributeChoices.subAttributeChoice')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: SourceTypeModel) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setEditmodaldata(record);
                  handleModalOpen('edit');
                }}
              >
                <EditOutlined />
              </TableButton>
            </Tooltip>

            <Tooltip placement="top" title={t('common.delete')}>
              <TableButton
                severity="error"
                onClick={() => {
                  setDeletemodaldata(record);
                  handleModalOpen('delete');
                }}
              >
                <DeleteOutlined />
              </TableButton>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        id="attributeChoices"
        title={t('attributeChoices.attributeChoicesList')}
        padding={
          Data === undefined || Data?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0rem'
        }
      >
        <Row justify={'end'} align={'middle'}>
          {/*    ADD    */}
          {modalState.add && (
            <AddAttributeChoice
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                const values = { ...info, attributeId: attributeForSourceId, isAttributeChoiceParent: true };
                addAttributeChoice.mutateAsync(values);
              }}
              isLoading={addAttributeChoice.isLoading}
              type="parent"
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditAttributeChoice
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => {
                const values = {
                  ...data,
                  attributeId: attributeForSourceId,
                  // attributeChociceParentId: attributeId,
                  isAttributeChoiceParent: true,
                };
                editmodaldata !== undefined && handleEdit(values, editmodaldata.id);
              }}
              isLoading={editAttributeChoice.isLoading}
              iconId={editmodaldata?.icon !== undefined ? editmodaldata?.icon.id : 0}
            />
          )}

          {/*    Delete    */}
          {modalState.delete && (
            <ActionModal
              visible={modalState.delete}
              onCancel={() => handleModalClose('delete')}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('attributeChoices.deleteAttributeChoiceModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('attributeChoices.deleteAttributeChoiceModalDescription')}
              isDanger={true}
              isLoading={deleteAttributeChoice.isLoading}
            />
          )}

          <Button
            style={{
              margin: '0 .5rem .5rem 0',
              width: 'auto',
            }}
            type="ghost"
            onClick={() => navigate(-1)}
            icon={<LeftOutlined />}
          >
            <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
          </Button>

          <Button
            type="primary"
            style={{
              margin: '0 0   .5rem 0',
              width: 'auto',
            }}
            onClick={() => handleModalOpen('add')}
          >
            <CreateButtonText>{t('attributeChoices.addAttributeChoice')}</CreateButtonText>
          </Button>

          <ReloadBtn setRefetchData={setRefetchData} />
        </Row>
        <Table
          dataSource={Data}
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          pagination={{
            showSizeChanger: true,
            onChange: (page: number, pageSize: number) => {
              setPage(page);
              setPageSize(pageSize);
            },
            responsive: true,
            current: page,
            pageSize: pageSize,
            showTitle: false,
            showLessItems: true,
            showQuickJumper: true,
            total: totalCount || 0,
            pageSizeOptions: [5, 10, 15, 20],
            hideOnSinglePage: false,
          }}
          loading={loading}
          scroll={{ x: isTablet || isMobile ? 850 : '' }}
        />
      </Card>
    </>
  );
};
