import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ComplexClass } from '../../modules/compclassapi'
import { listComplexClasses, getComplexClass } from '../../modules/compclassapi'
import { COMPLEXCLASS_MOCK } from '../../modules/mock'

interface ComplexClassesState {
    items: ComplexClass[]
    currentItem: ComplexClass | null
    loading: boolean
    error: string | null
    useMock: boolean
    searchQuery: string
    isFiltered: boolean
}

const initialState: ComplexClassesState = {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    useMock: false,
    searchQuery: '',
    isFiltered: false
}

export const fetchComplexClasses = createAsyncThunk(
    'complexClasses/fetchAll',
    async (searchDegree?: string) => {
        try {
            const data = await listComplexClasses({ degree: searchDegree || '' })

            if (data.length > 0) {
                return {
                    data,
                    useMock: false,
                    isFiltered: !!searchDegree && searchDegree.trim() !== ''
                }
            } else {
                let filteredMock = COMPLEXCLASS_MOCK
                if (searchDegree && searchDegree.trim() !== '') {
                    filteredMock = COMPLEXCLASS_MOCK.filter(compclass =>
                        compclass.degree_text.toLowerCase().includes(searchDegree.toLowerCase())
                    )
                }
                return {
                    data: filteredMock,
                    useMock: true,
                    isFiltered: !!searchDegree && searchDegree.trim() !== ''
                }
            }
        } catch (error) {
            console.error('Error fetching complex classes:', error)
            let filteredMock = COMPLEXCLASS_MOCK
            if (searchDegree && searchDegree.trim() !== '') {
                filteredMock = COMPLEXCLASS_MOCK.filter(compclass =>
                    compclass.degree_text.toLowerCase().includes(searchDegree.toLowerCase())
                )
            }
            return {
                data: filteredMock,
                useMock: true,
                isFiltered: !!searchDegree && searchDegree.trim() !== ''
            }
        }
    }
)

export const fetchComplexClassById = createAsyncThunk(
    'complexClasses/fetchById',
    async (id: number) => {
        try {
            const data = await getComplexClass(id)
            if (data) return { data, useMock: false }
            const mockData = COMPLEXCLASS_MOCK.find(c => c.compclass_id === id) || null
            return { data: mockData, useMock: true }
        } catch {
            const mockData = COMPLEXCLASS_MOCK.find(c => c.compclass_id === id) || null
            return { data: mockData, useMock: true }
        }
    }
)

const complexClassesSlice = createSlice({
    name: 'complexClasses',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
        },
        clearCurrentItem: (state) => {
            state.currentItem = null
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComplexClasses.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchComplexClasses.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload.data
                state.useMock = action.payload.useMock
                state.isFiltered = action.payload.isFiltered
            })
            .addCase(fetchComplexClasses.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch complex classes'
                state.items = COMPLEXCLASS_MOCK
                state.useMock = true
                state.isFiltered = false
            })
            .addCase(fetchComplexClassById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchComplexClassById.fulfilled, (state, action) => {
                state.loading = false
                state.currentItem = action.payload.data
                state.useMock = action.payload.useMock
            })
            .addCase(fetchComplexClassById.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch complex class'
                state.currentItem = null
            })
    }
})

export const {
    setSearchQuery,
    clearCurrentItem,
    clearError
} = complexClassesSlice.actions

export default complexClassesSlice.reducer