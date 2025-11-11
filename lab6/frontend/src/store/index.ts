import { configureStore } from '@reduxjs/toolkit'
import complexClassesReducer from './slices/complexClassesSlice'

export const store = configureStore({
    reducer: {
        complexClasses: complexClassesReducer,
    },
    devTools: import.meta.env.MODE !== 'production' || window.location.hostname.includes('github.io'),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch