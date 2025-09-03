import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
    persistReducer, persistStore,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from 'redux-persist';

import authReducer from './slices/authSlice';
import langReducer from './slices/langSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    lang: langReducer,
});


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['lang', 'auth'], // минимум 'lang'; 'auth' — по желанию
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) =>
        getDefault({
            serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
        }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch