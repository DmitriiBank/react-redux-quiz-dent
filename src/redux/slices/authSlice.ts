import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {TestRecord} from "../../utils/User.ts";

export interface AuthState {
    uid: string | null;
    email: string | null;
    displayName: string | null;
    isAuth: boolean;
    isLoading: boolean;
    testList: TestRecord[];
}

const initialState: AuthState = {
    uid: null,
    email: null,
    displayName: null,
    isAuth: false,
    isLoading: true,
    testList: []
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginAction: (state, {payload}: PayloadAction<{
            uid: string;
            email: string | null;
            displayName: string | null;
            testList: TestRecord[];
            isAuth?: boolean;
            isLoading?: boolean;
        }>) => {
            state.uid = payload.uid;
            state.email = payload.email;
            state.displayName = payload.displayName;
            state.isAuth = true;
            state.testList = payload.testList || [];
            state.isLoading = false;
        },
        logout: (state) => {
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.testList = [];
            state.isAuth = false;
            state.isLoading = false;
        }, setLoading: (state, {payload}: PayloadAction<boolean>) => {
            state.isLoading = payload;
        }
    }
});

export const {
    loginAction,
    logout,
    setLoading
} = authSlice.actions;

export default authSlice.reducer;