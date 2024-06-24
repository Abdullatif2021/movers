import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';
import { faqModel } from '@app/interfaces/interfaces';

const getAllFrequentlyQuestions = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.frequentlyQuestions}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}`);
};

const createFrequentlyQuestion = async (data: faqModel) => {
  return await httpApi.post(`${apiPrefix.frequentlyQuestions}/Create`, data);
};

const DeleteFrequentlyQuestion = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.frequentlyQuestions}/Delete?Id=${id}`);
};

const UpdateFrequentlyQuestion = async (data: any) => {
  return await httpApi.put(`${apiPrefix.frequentlyQuestions}/Update`, data);
};

export { getAllFrequentlyQuestions, createFrequentlyQuestion, DeleteFrequentlyQuestion, UpdateFrequentlyQuestion };
