import { configureStore } from '@reduxjs/toolkit';
import complexClassesReducer from './slices/complexClassesSlice';
import userReducer from './slices/userSlice';
import bigorequestReducer from './slices/bigorequestSlice';

export const store = configureStore({
    reducer: {
        complexClasses: complexClassesReducer,
        user: userReducer,
        bigorequest: bigorequestReducer,
    },
    devTools: import.meta.env.MODE !== 'production' || window.location.hostname.includes('github.io'),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;