// store/slices/complexClassesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  listComplexClassesWithPagination, 
  getComplexClass,
  type ComplexClass,
  type ListComplexClassesParams 
} from '../../modules/compclassapi';
import { COMPLEXCLASS_MOCK } from '../../modules/mock';

interface ComplexClassesState {
  items: ComplexClass[];
  currentItem: ComplexClass | null;
  loading: boolean;
  error: string | null;
  useMock: boolean;
  searchQuery: string;
  isFiltered: boolean;
  // Новые поля для пагинации
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  // Для измерения времени запросов
  queryTime: number | null;
}

const initialState: ComplexClassesState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  useMock: false,
  searchQuery: '',
  isFiltered: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 7, // По умолчанию 7 на странице
  },
  queryTime: null,
};

// Обновленный thunk с поддержкой пагинации
export const getComplexClassesList = createAsyncThunk(
  'complexClasses/getComplexClassesList',
  async (params: { page?: number; useIndex?: boolean } = {}, { getState, rejectWithValue }) => {
    const { complexClasses } = getState() as { complexClasses: ComplexClassesState };
    const { searchQuery, pagination } = complexClasses;
    
    const startTime = performance.now();
    
    try {
      const queryParams: ListComplexClassesParams = {
        degree: searchQuery,
        page: params.page || pagination.currentPage,
        limit: pagination.itemsPerPage,
      };
      
      // Параметр для тестирования индексов
      if (params.useIndex !== undefined) {
        // Можно добавить специальный параметр для бэкенда
        // Например: queryParams.use_index = params.useIndex
      }
      
      const response = await listComplexClassesWithPagination(queryParams);
      
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      
      return {
        data: response.items || [],
        pagination: {
          currentPage: response.page || 1,
          totalPages: response.total_pages || 1,
          totalItems: response.total || 0,
          itemsPerPage: response.limit || 7,
        },
        queryTime,
        useMock: false,
        isFiltered: !!searchQuery && searchQuery.trim() !== '',
      };
    } catch (error) {
      console.error('Error fetching complex classes:', error);
      
      // Fallback на мок-данные
      let filteredMock = COMPLEXCLASS_MOCK;
      if (searchQuery && searchQuery.trim() !== '') {
        filteredMock = COMPLEXCLASS_MOCK.filter(compclass =>
          compclass.degree_text?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
        );
      }
      
      // Применяем пагинацию к мок-данным
      const page = params.page || pagination.currentPage;
      const limit = pagination.itemsPerPage;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMock = filteredMock.slice(startIndex, endIndex);
      
      const totalPages = Math.ceil(filteredMock.length / limit);
      
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      
      return rejectWithValue({
        data: paginatedMock,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: filteredMock.length,
          itemsPerPage: limit,
        },
        queryTime,
        useMock: true,
        isFiltered: !!searchQuery && searchQuery.trim() !== '',
        error: 'Failed to fetch from API, using mock data',
      });
    }
  }
);

// Существующий thunk остается без изменений
export const getComplexClassById = createAsyncThunk(
  'complexClasses/getComplexClassById',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await getComplexClass(id);
      if (data) return { data, useMock: false };
      const mockData = COMPLEXCLASS_MOCK.find(c => c.compclass_id === id) || null;
      return { data: mockData, useMock: true };
    } catch (error) {
      console.error('Error fetching complex class by id:', error);
      const mockData = COMPLEXCLASS_MOCK.find(c => c.compclass_id === id) || null;
      return rejectWithValue({
        data: mockData,
        useMock: true,
        error: `Failed to fetch, using mock: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }
);

const complexClassesSlice = createSlice({
  name: 'complexClasses',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      // Сбрасываем на первую страницу при изменении размера страницы
      state.pagination.currentPage = 1;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetQueryTime: (state) => {
      state.queryTime = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComplexClassesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComplexClassesList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
        state.useMock = action.payload.useMock;
        state.isFiltered = action.payload.isFiltered;
        state.queryTime = action.payload.queryTime;
      })
      .addCase(getComplexClassesList.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { 
          data: ComplexClass[]; 
          pagination: ComplexClassesState['pagination'];
          useMock: boolean; 
          isFiltered: boolean; 
          error: string;
          queryTime: number;
        };
        state.items = payload.data;
        state.pagination = payload.pagination;
        state.useMock = payload.useMock;
        state.isFiltered = payload.isFiltered;
        state.error = payload.error;
        state.queryTime = payload.queryTime;
      })
      .addCase(getComplexClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComplexClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload.data;
        state.useMock = action.payload.useMock;
      })
      .addCase(getComplexClassById.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { data: ComplexClass | null; useMock: boolean; error: string };
        state.currentItem = payload.data;
        state.useMock = payload.useMock;
        state.error = payload.error;
      });
  },
});

export const { 
  setSearchQuery, 
  setCurrentPage, 
  setItemsPerPage,
  clearCurrentItem, 
  clearError,
  resetQueryTime 
} = complexClassesSlice.actions;
export default complexClassesSlice.reducer;