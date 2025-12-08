import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {type ComplexClass, getComplexClass} from '../../modules/compclassapi';
import { listComplexClasses } from '../../modules/compclassapi'
import { COMPLEXCLASS_MOCK } from '../../modules/mock';

interface ComplexClassesState {
    items: ComplexClass[];
    currentItem: ComplexClass | null;
    loading: boolean;
    error: string | null;
    useMock: boolean;
    searchQuery: string;
    isFiltered: boolean;
}

const initialState: ComplexClassesState = {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    useMock: false,
    searchQuery: '',
    isFiltered: false,
};

export const getComplexClassesList = createAsyncThunk(
    'complexClasses/getComplexClassesList',
    async (_, { getState, rejectWithValue }) => {
        const { complexClasses } = getState() as { complexClasses: ComplexClassesState };
        const searchDegree = complexClasses.searchQuery;
        try {
            const data = await listComplexClasses({ degree: searchDegree });
            return {
                data,
                useMock: false,
                isFiltered: !!searchDegree && searchDegree.trim() !== '',
            };
        } catch (error) {
            console.error('Error fetching complex classes:', error);
            let filteredMock = COMPLEXCLASS_MOCK;
            if (searchDegree && searchDegree.trim() !== '') {
                filteredMock = COMPLEXCLASS_MOCK.filter(compclass =>
                    compclass.degree_text?.toLowerCase().includes(searchDegree.toLowerCase()) ?? false
                );
            }
            return rejectWithValue({
                data: filteredMock,
                useMock: true,
                isFiltered: !!searchDegree && searchDegree.trim() !== '',
                error: 'Failed to fetch from API, using mock data',
            });
        }
    }
);

export const getComplexClassById = createAsyncThunk(
    'complexClasses/getComplexClassById',
    async (id: number, { rejectWithValue }) => {
        try {
            const data = await getComplexClass(id);
            if (data) return { data, useMock: false };
            const mockData = COMPLEXCLASS_MOCK.find(c => c.compclass_id === id) || null;
            return { data: mockData, useMock: true };
        } catch (error) {
            // Fix: Use the error parameter
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
        clearCurrentItem: (state) => {
            state.currentItem = null;
        },
        clearError: (state) => {
            state.error = null;
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
                state.useMock = action.payload.useMock;
                state.isFiltered = action.payload.isFiltered;
            })
            .addCase(getComplexClassesList.rejected, (state, action) => {
                state.loading = false;
                const payload = action.payload as { data: ComplexClass[]; useMock: boolean; isFiltered: boolean; error: string };
                state.items = payload.data;
                state.useMock = payload.useMock;
                state.isFiltered = payload.isFiltered;
                state.error = payload.error;
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

export const { setSearchQuery, clearCurrentItem, clearError } = complexClassesSlice.actions;
export default complexClassesSlice.reducer;