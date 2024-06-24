import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './DragAndDropBoard.css';
import { Spin, Badge, Row, Tooltip, Col } from 'antd';
import { EditOutlined, ReloadOutlined, RollbackOutlined } from '@ant-design/icons';
import { getAllGroups, createGroup, updateGroup, SwipeCompany } from '@app/services/commissionGroups';
import { useMutation, useQuery } from 'react-query';
import { notificationController } from '@app/controllers/notificationController';
import { useTranslation } from 'react-i18next';
import { AddCommissionGroup } from '@app/components/modal/AddCommissionGroup';
import { EditCommissionGroup } from '@app/components/modal/EditCommissionGroup';
import { Card } from '@app/components/common/Card/Card';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { CreateButtonText, TableButton } from '@app/components/GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import ReloadBtn from '../ReusableComponents/ReloadBtn';

interface Company {
  bio: string;
  name: string;
  address: string;
  translations: {
    name: string;
    bio: string;
    address: string;
    language: string;
  }[];
  companyContact: any;
  generalRating: any;
  reviews: any;
  numberOfTransfers: number;
  id: number;
}

interface Group {
  name: string;
  companies: Company[];
  isDefault: boolean;
  id: any;
}

const DragAndDropBoard = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [dataGroup, setDataGroup] = useState<Group[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<any | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [isDefault, setIsDefault] = useState(0);
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const { refetch, isRefetching } = useQuery(
    ['AllGroups'],
    () =>
      getAllGroups()
        .then((data) => {
          const result = data.data?.result?.items;
          setDataGroup(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataGroup === undefined,
    },
  );

  const SwipeCompanyFromGroupToAnother = useMutation((data: any) =>
    SwipeCompany(data)
      .then((data) => {
        setLoading(true);
        notificationController.success({ message: t('groups.SwipeCompanySuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  const addGroup = useMutation((data: any) =>
    createGroup(data)
      .then((data) => {
        notificationController.success({ message: t('groups.addGroupSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  const editGroup = useMutation((data: any) => updateGroup(data));

  const handleEdit = (data: any, id: number, isDefault: boolean) => {
    editGroup
      .mutateAsync({ name: data, id, isDefault: isDefault })
      .then((data) => {
        setIsEdit(data.data?.success);
        notificationController.success({ message: t('groups.editGroupSuccessMessage') });
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addGroup.isLoading }));
  }, [addGroup.isLoading]);

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editGroup.isLoading }));
  }, [editGroup.isLoading]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsEdit(false);
    setRefetchOnAdd(false);
  }, [language, refetchOnAdd, isEdit, refetchData]);

  useEffect(() => {
    if (dataGroup) {
      const defaultGroup = dataGroup?.find((group) => group.isDefault === true)?.id;
      setIsDefault(defaultGroup);
    }
  }, [dataGroup != undefined]);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
    const sourceGroupId: string = source.droppableId;
    const companyId: any = draggableId;

    try {
      setLoading(true);
      if (sourceGroupId != destination.droppableId) {
        await SwipeCompanyFromGroupToAnother.mutateAsync({
          oldGroupId: sourceGroupId,
          newGroupId: destination.droppableId,
          companyId: companyId,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  //  reset company
  const handleResetCompany = async (sourceGroupId: string, companyId: number) => {
    try {
      setLoading(true);
      await SwipeCompanyFromGroupToAnother.mutateAsync({
        oldGroupId: sourceGroupId,
        newGroupId: isDefault,
        companyId: companyId,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const commonContent = (group: Group) => (
    <Card
      className="groupCard"
      title={`${group.name} %`}
      bordered={false}
      extra={
        <Row>
          <Col>
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  handleModalOpen('edit');
                  setEditmodaldata(group);
                }}
              >
                <EditOutlined />
              </TableButton>
            </Tooltip>
          </Col>
          {/* <Col>
              <Tooltip placement="top" title={t('common.delete')}>
                <TableButton severity="error">
                  <DeleteOutlined />
                </TableButton>
              </Tooltip>
            </Col> */}
        </Row>
      }
    >
      <div className="column" key={group.id}>
        <Droppable droppableId={group.id.toString()} key={group.id.toString()}>
          {(provided) => (
            <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
              {group.companies?.map((company, index) => (
                <Draggable key={company.id.toString()} draggableId={company.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      className="task"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>{company.name}</div>

                      {!group.isDefault && (
                        <Tooltip placement="top" title={t('common.reset')}>
                          <TableButton severity="success" onClick={() => handleResetCompany(group.id, company.id)}>
                            <RollbackOutlined />
                          </TableButton>
                        </Tooltip>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </Card>
  );

  return (
    <Card title={t('groups.groupsList')} padding={'1.25rem 1.25rem 0'}>
      <Row justify={'end'} align={'middle'}>
        <Btn
          type="primary"
          style={{
            margin: '0 .5rem .5rem 0',
            width: 'auto',
          }}
          onClick={() => handleModalOpen('add')}
        >
          <CreateButtonText>{t('groups.addGroup')}</CreateButtonText>
        </Btn>
        <ReloadBtn setRefetchData={setRefetchData} />
      </Row>
      <div className="drag-and-drop-board">
        <Row style={{ marginBottom: '1rem' }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Spin spinning={loading || isRefetching}>
              {dataGroup?.map((group) => {
                return !group.isDefault ? (
                  commonContent(group)
                ) : (
                  <Badge.Ribbon text={t('groups.default')} key={group.id}>
                    {commonContent(group)}
                  </Badge.Ribbon>
                );
              })}
            </Spin>
          </DragDropContext>
        </Row>

        {/*    Add Group   */}
        {modalState.add && (
          <AddCommissionGroup
            visible={modalState.add}
            onCancel={() => handleModalClose('add')}
            onCreate={(info) => {
              addGroup.mutateAsync(info);
            }}
            isLoading={addGroup.isLoading}
          />
        )}

        {/*    EDIT    */}
        {modalState.edit && (
          <EditCommissionGroup
            values={editmodaldata}
            visible={modalState.edit}
            onCancel={() => handleModalClose('edit')}
            onEdit={(data) => {
              editmodaldata !== undefined && handleEdit(data.name, data.id, data.isDefault);
            }}
            isLoading={editGroup.isLoading}
          />
        )}
      </div>
    </Card>
  );
};

export default DragAndDropBoard;
