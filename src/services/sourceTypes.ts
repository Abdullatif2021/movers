import { SourceTypeModel } from './../interfaces/interfaces';
import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

//SourceType
const getAllSourceTypes = async (page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.sourceType}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const getSourceTypes = async () => {
  return await httpApi.get(`${apiPrefix.sourceType}/GetAll`);
};

const createSourceType = async (data: SourceTypeModel) => {
  return await httpApi.post(`${apiPrefix.sourceType}/Create`, data);
};

const DeleteSourceType = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.sourceType}/Delete?Id=${id}`);
};

const UpdateSourceType = async (data: any) => {
  return await httpApi.put(`${apiPrefix.sourceType}/Update`, data);
};

const ActivateSourceType = async (id: number) => {
  return await httpApi.put(`${apiPrefix.sourceType}/SwitchActivation`, { id, isActive: true });
};

const DeActivateSourceType = async (id: number) => {
  return await httpApi.put(`${apiPrefix.sourceType}/SwitchActivation`, { id, isActive: false });
};

//AttributeForSourceType
const getAllAttributeForSourceTypes = async (
  id: string | undefined,
  page: number,
  pageSize: number,
  search: string,
) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.attributeForSourceType}/GetAll?SourceTypeId=${id}&SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const getAttributeForSourceTypes = async (id: any) => {
  return await httpApi.get(`${apiPrefix.attributeForSourceType}/GetAll`, {
    params: {
      SourceTypeId: id,
    },
  });
};

const createAttributeForSourceType = async (data: SourceTypeModel) => {
  return await httpApi.post(`${apiPrefix.attributeForSourceType}/Create`, data);
};

const DeleteAttributeForSourceType = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.attributeForSourceType}/Delete?Id=${id}`);
};

const UpdateAttributeForSourceType = async (data: any) => {
  return await httpApi.put(`${apiPrefix.attributeForSourceType}/Update`, data);
};

const ActivateAttributeForSourceType = async (id: number) => {
  return await httpApi.put(`${apiPrefix.attributeForSourceType}/SwitchActivation`, { id, isActive: true });
};

const DeActivateAttributeForSourceType = async (id: number) => {
  return await httpApi.put(`${apiPrefix.attributeForSourceType}/SwitchActivation`, { id, isActive: false });
};

//AttributeChoices
const getAllAttributeChoices = async (id: string | undefined, page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.allAttributeChoices}/GetAll?AttributeId=${id}&SkipCount=${skip}&MaxResultCount=${pageSize}&IsParent=true&KeyWord=${search}`,
  );
};

const createAttributeChoice = async (data: SourceTypeModel) => {
  return await httpApi.post(`${apiPrefix.allAttributeChoices}/Create`, data);
};

const DeleteAttributeChoice = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.allAttributeChoices}/Delete?Id=${id}`);
};

const UpdateAttributeChoice = async (data: any) => {
  return await httpApi.put(`${apiPrefix.allAttributeChoices}/Update`, data);
};

//ChildAttributeChoices
const getAllChildAttributeChoices = async (id: string | undefined, page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.allAttributeChoices}/GetAll?ParentId=${id}&SkipCount=${skip}&MaxResultCount=${pageSize}&IsParent=false&KeyWord=${search}`,
  );
};

const getChildAttributeChoice = async (id: number | undefined) => {
  return await httpApi.get(`${apiPrefix.allAttributeChoices}/GetAll?ParentId=${id}&IsParent=false`);
};

const createChildAttributeChoice = async (data: SourceTypeModel) => {
  return await httpApi.post(`${apiPrefix.allAttributeChoices}/Create`, data);
};

const DeleteChildAttributeChoice = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.allAttributeChoices}/Delete?Id=${id}`);
};

const UpdateChildAttributeChoice = async (data: any) => {
  return await httpApi.put(`${apiPrefix.allAttributeChoices}/Update`, data);
};

export {
  getAllSourceTypes,
  getSourceTypes,
  createSourceType,
  DeleteSourceType,
  UpdateSourceType,
  ActivateSourceType,
  DeActivateSourceType,
  getAllAttributeForSourceTypes,
  getAttributeForSourceTypes,
  createAttributeForSourceType,
  DeleteAttributeForSourceType,
  UpdateAttributeForSourceType,
  ActivateAttributeForSourceType,
  DeActivateAttributeForSourceType,
  getAllAttributeChoices,
  createAttributeChoice,
  DeleteAttributeChoice,
  UpdateAttributeChoice,
  getAllChildAttributeChoices,
  getChildAttributeChoice,
  createChildAttributeChoice,
  DeleteChildAttributeChoice,
  UpdateChildAttributeChoice,
};
