import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { SerializerUserJSON } from '../../api/Api';

interface UserState {
    username: string;
    isAuthenticated: boolean;
    isModerator: boolean; // Добавляем поле для модератора
    error: string | null;
    loading: boolean;
}

const initialState: UserState = {
    username: '',
    isAuthenticated: false,
    isModerator: false, // По умолчанию не модератор
    error: null,
    loading: false,
};

// Добавляем новый thunk для получения информации о пользователе
export const getUserInfo = createAsyncThunk(
    'user/getUserInfo',
    async (login: string, { rejectWithValue }) => {
        try {
            const response = await api.users.infoList({ login });
            return {
                username: response.data.login,
                isModerator: response.data.is_moderator || false,
            };
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { data?: { detail?: string } } };
                return rejectWithValue(apiError.response?.data?.detail || 'Ошибка получения информации');
            }
            return rejectWithValue('Ошибка получения информации');
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials: { login: string; password: string }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.users.signinCreate(credentials as SerializerUserJSON);
            localStorage.setItem('token', response.data.token);
            
            // После успешного входа получаем информацию о пользователе
            const userInfo = await dispatch(getUserInfo(credentials.login)).unwrap();
            
            return { 
                username: credentials.login,
                isModerator: userInfo.isModerator 
            };
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
            return { 
                username: data.login,
                isModerator: false // Новые пользователи не модераторы по умолчанию
            };
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
    reducers: {
        // Добавляем редьюсер для обновления статуса модератора
        updateModeratorStatus: (state, action) => {
            state.isModerator = action.payload;
        },
        // Редьюсер для сброса состояния
        resetUser: () => initialState,
    },
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
                state.isModerator = action.payload.isModerator;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.isModerator = false;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.username = action.payload.username;
                state.isModerator = action.payload.isModerator;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get User Info
            .addCase(getUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.isModerator = action.payload.isModerator;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
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
                state.isModerator = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.login) {
                    state.username = action.payload.login;
                }
                if (action.payload.is_moderator !== undefined) {
                    state.isModerator = action.payload.is_moderator;
                }
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { updateModeratorStatus, resetUser } = userSlice.actions;
export default userSlice.reducer;