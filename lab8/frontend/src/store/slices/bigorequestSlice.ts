import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { SerializerBigORequestJSON, SerializerCompClassRequestJSON } from '../../api/Api';

interface BigORequestState {
    draftId: number | null;
    count: number;
    items: SerializerCompClassRequestJSON[];
    data: SerializerBigORequestJSON;
    isDraft: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: BigORequestState = {
    draftId: null,
    count: 0,
    items: [],
    data: {} as SerializerBigORequestJSON,
    isDraft: false,
    loading: false,
    error: null,
};

interface DraftResponse {
    draftId: number | null;
    count: number;
    items: SerializerCompClassRequestJSON[];
    isDraft: boolean;
}

interface BigORequestResponse {
    data: SerializerBigORequestJSON;
    items: SerializerCompClassRequestJSON[];
    count: number;
    isDraft: boolean;
}

export const getDraftBigORequest = createAsyncThunk(
    'bigorequest/getDraft',
    async (_, { rejectWithValue }): Promise<DraftResponse | ReturnType<typeof rejectWithValue>> => {
        try {
            const response = await api.bigorequest.bigorequestCartList();
            const data = response.data;

            return {
                draftId: data.id || null,
                count: data.compclass_count || 0,
                items: [],
                isDraft: true,
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ошибка загрузки корзины';
            return rejectWithValue(errorMessage);
        }
    }
);

export const getBigORequest = createAsyncThunk(
    'bigorequest/getBigORequest',
    async (id: number, { rejectWithValue }): Promise<BigORequestResponse | ReturnType<typeof rejectWithValue>> => {
        try {
            const response = await api.bigorequest.bigorequestDetail({ id });
            const data = response.data;

            console.log('API Response:', data); // Добавьте это для отладки

            // Получаем основную информацию о заявке
            const bigorequest = data.bigorequest || data;
            // Получаем классы сложности - они в поле compclasses
            const compclasses = data.compclasses || [];

            return {
                data: bigorequest,
                items: compclasses, // Используем compclasses вместо data.items
                count: compclasses.length,
                isDraft: (bigorequest?.status || '').toLowerCase() === 'черновик' ||
                    (bigorequest?.status || '').toLowerCase() === 'draft',
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ошибка загрузки заявки';
            return rejectWithValue(errorMessage);
        }
    }
);


export const addComplexClassToRequest = createAsyncThunk(
    'bigorequest/addComplexClass',
    async (compclassId: number, { rejectWithValue }): Promise<SerializerBigORequestJSON | ReturnType<typeof rejectWithValue>> => {
        try {
            const response = await api.complexclass.addToBigorequestCreate({ id: compclassId });
            return response.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ошибка добавления';
            return rejectWithValue(errorMessage);
        }
    }
);

interface UpdateCompClassParams {
    compclassId: number;
    bigoRequestId: number;
    data: SerializerCompClassRequestJSON;
}

export const updateCompClassRequest = createAsyncThunk(
    'bigorequest/updateCompClass',
    async ({ compclassId, bigoRequestId, data }: UpdateCompClassParams, { rejectWithValue }): Promise<SerializerCompClassRequestJSON | ReturnType<typeof rejectWithValue>> => {
        try {
            const response = await api.compclassrequest.compclassrequestUpdate(
                { compclassId, bigoRequestId },
                data
            );
            return response.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ошибка обновления класса';
            return rejectWithValue(errorMessage);
        }
    }
);

interface DeleteCompClassParams {
    compclassId: number;
    bigoRequestId: number;
}

interface DeleteCompClassResponse {
    compclassId: number;
    bigoRequestId: number;
    data: SerializerBigORequestJSON;
}

export const deleteCompClassRequest = createAsyncThunk(
    'bigorequest/deleteCompClass',
    async ({ compclassId, bigoRequestId }: DeleteCompClassParams, { rejectWithValue }): Promise<DeleteCompClassResponse | ReturnType<typeof rejectWithValue>> => {
        try {
            const response = await api.compclassrequest.compclassrequestDelete({ compclassId, bigoRequestId });
            return { compclassId, bigoRequestId, data: response.data };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ошибка удаления класса';
            return rejectWithValue(errorMessage);
        }
    }
);

export const formBigORequest = createAsyncThunk(
    'bigorequest/formRequest',
    async (id: number, { rejectWithValue }): Promise<SerializerBigORequestJSON | ReturnType<typeof rejectWithValue>> => {
        try {
            const response = await api.bigorequest.formBigorequestUpdate({ id });
            return response.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ошибка формирования заявки';
            return rejectWithValue(errorMessage);
        }
    }
);

interface FinishBigORequestParams {
    id: number;
    status: string;
}

export const finishBigORequest = createAsyncThunk(
    'bigorequest/finishRequest',
    async ({ id, status }: FinishBigORequestParams, { rejectWithValue }): Promise<SerializerBigORequestJSON | ReturnType<typeof rejectWithValue>> => {
        try {
            const response = await api.bigorequest.finishBigorequestUpdate({ id }, { status });
            return response.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ошибка завершения заявки';
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteBigORequest = createAsyncThunk(
    'bigorequest/deleteRequest',
    async (id: number, { rejectWithValue }): Promise<number | ReturnType<typeof rejectWithValue>> => {
        try {
            await api.bigorequest.deleteBigorequestDelete({ id });
            return id;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ошибка удаления заявки';
            return rejectWithValue(errorMessage);
        }
    }
);

const bigorequestSlice = createSlice({
    name: 'bigorequest',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Partial<SerializerBigORequestJSON>>) => {
            state.data = { ...state.data, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Get Draft
            .addCase(getDraftBigORequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDraftBigORequest.fulfilled, (state, action) => {
                state.loading = false;
                state.draftId = action.payload.draftId;
                state.count = action.payload.count;
                state.items = action.payload.items;
                state.isDraft = action.payload.isDraft;
            })
            .addCase(getDraftBigORequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get BigO Request
            .addCase(getBigORequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBigORequest.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.items = action.payload.items;
                state.count = action.payload.count;
                state.isDraft = action.payload.isDraft;
                state.draftId = action.payload.data.bigo_request_id || null;
            })
            .addCase(getBigORequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add Complex Class
            .addCase(addComplexClassToRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComplexClassToRequest.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.data = action.payload;
                }
            })
            .addCase(addComplexClassToRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Comp Class
            .addCase(updateCompClassRequest.fulfilled, (state, action) => {
                const updatedItem = action.payload;
                const index = state.items.findIndex(
                    item => item.comp_class_request_id === updatedItem.comp_class_request_id
                );
                if (index !== -1) {
                    state.items[index] = updatedItem;
                }
            })
            // Delete Comp Class
            .addCase(deleteCompClassRequest.fulfilled, (state, action) => {
                const { compclassId } = action.payload;
                state.items = state.items.filter(
                    item => item.complexclass_id !== compclassId
                );
                state.count = state.items.length;
            })
            // Form BigO Request
            .addCase(formBigORequest.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isDraft = false;
            })
            // Finish BigO Request
            .addCase(finishBigORequest.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            // Delete BigO Request
            .addCase(deleteBigORequest.fulfilled, () => {
                return initialState;
            });
    },
});

export const { setData, clearError, resetState } = bigorequestSlice.actions;
export default bigorequestSlice.reducer;