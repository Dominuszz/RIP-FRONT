import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { SerializerUserJSON } from '../../api/Api';

interface UserState {
    username: string;
    isAuthenticated: boolean;
    error: string | null;
    loading: boolean; // Добавляем свойство loading
}

const initialState: UserState = {
    username: '',
    isAuthenticated: false,
    error: null,
    loading: false, // Инициализируем loading
};

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials: { login: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.users.signinCreate(credentials as SerializerUserJSON);
            localStorage.setItem('token', response.data.token);
            return { username: credentials.login };
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { data?: { detail?: string } } };
                return rejectWithValue(apiError.response?.data?.detail || 'Ошибка авторизации');
            }
            return rejectWithValue('Ошибка авторизации');
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (data: { login: string; password: string }, { rejectWithValue }) => {
        try {
            await api.users.signupCreate(data as SerializerUserJSON);
            return { username: data.login };
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { data?: { detail?: string } } };
                return rejectWithValue(apiError.response?.data?.detail || 'Ошибка регистрации');
            }
            return rejectWithValue('Ошибка регистрации');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await api.users.signoutCreate();
            localStorage.removeItem('token');
            return true;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { data?: { detail?: string } } };
                return rejectWithValue(apiError.response?.data?.detail || 'Ошибка выхода');
            }
            return rejectWithValue('Ошибка выхода');
        }
    }
);
export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (userData: { login: string; password?: string }, { rejectWithValue }) => {
        try {
            const updateData: SerializerUserJSON = {
                login: userData.login,
            };

            if (userData.password) {
                updateData.password = userData.password;
            }

            const response = await api.users.infoUpdate(
                { login: userData.login },
                updateData
            );
            return response.data;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { data?: { detail?: string } } };
                return rejectWithValue(apiError.response?.data?.detail || 'Ошибка обновления профиля');
            }
            return rejectWithValue('Ошибка обновления профиля');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.username = action.payload.username;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.username = action.payload.username;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.username = '';
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // В extraReducers добавьте:
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Если в ответе есть новое имя пользователя, обновляем его
                if (action.payload.login) {
                    state.username = action.payload.login;
                }
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

    },
});

export default userSlice.reducer;