import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.ts";
import langReducer from "./slices/langSlice.ts";

export const store = configureStore({
    reducer: {
        "auth": authReducer,
        "lang": langReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch