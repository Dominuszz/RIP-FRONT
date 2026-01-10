// modules/compclassapi.ts
import { api } from '../api';
import type { 
  SerializerComplexClassJSON, 
  SerializerComplexClassListResponse 
} from '../api/Api';

export type ComplexClass = SerializerComplexClassJSON & {
  array_size?: number; // Для связи с заявкой
};

// Обновленный метод для получения списка с пагинацией
export interface ListComplexClassesParams {
  degree?: string;
  page?: number;
  limit?: number;
}

export const listComplexClasses = async (
  params: ListComplexClassesParams = {}
): Promise<ComplexClass[]> => {
  try {
    const query: Record<string, any> = {};
    
    if (params.degree) {
      query['search-degree'] = params.degree;
    }
    if (params.page) {
      query.page = params.page;
    }
    if (params.limit) {
      query.limit = params.limit;
    }
    
    const response = await api.complexclass.complexclassList(query);
    
    // Проверяем структуру ответа (старая vs новая)
    if (Array.isArray(response.data)) {
      // Старый формат (массив)
      return response.data as ComplexClass[];
    } else {
      // Новый формат с пагинацией
      const data = response.data as SerializerComplexClassListResponse;
      return data.items || [];
    }
  } catch (error) {
    console.error('Error fetching complex classes:', error);
    throw error;
  }
};

// Новый метод для получения полного ответа с пагинацией
export const listComplexClassesWithPagination = async (
  params: ListComplexClassesParams = {}
): Promise<SerializerComplexClassListResponse> => {
  try {
    const query: Record<string, any> = {};
    
    if (params.degree) {
      query['search-degree'] = params.degree;
    }
    if (params.page) {
      query.page = params.page;
    }
    if (params.limit) {
      query.limit = params.limit;
    }
    
    const response = await api.complexclass.complexclassList(query);
    
    // Преобразуем ответ в нужную структуру
    if (Array.isArray(response.data)) {
      // Старый формат - преобразуем в новый
      return {
        items: response.data as SerializerComplexClassJSON[],
        total: response.data.length,
        page: params.page || 1,
        limit: params.limit || 7,
        total_pages: Math.ceil(response.data.length / (params.limit || 7))
      };
    } else {
      // Новый формат
      return response.data as SerializerComplexClassListResponse;
    }
  } catch (error) {
    console.error('Error fetching complex classes with pagination:', error);
    throw error;
  }
};

// Существующий метод остается для совместимости
export const getComplexClass = async (id: number): Promise<ComplexClass | null> => {
  try {
    const response = await api.complexclass.complexclassDetail({ id });
    return response.data as ComplexClass;
  } catch (error) {
    console.error('Error fetching complex class:', error);
    return null;
  }
};