import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
    authUser: string;
    displayName: string;
}

const initialState: AuthState = {
    authUser: "",
    displayName: "",
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginAction: (state, action) => {
            state.authUser = action.payload.email;
            state.displayName = action.payload.displayName;
        },
        logout: (state) => {
            state.authUser = "";
            state.displayName = "";
        }
    },
});

export const { loginAction, logout } = authSlice.actions;
export default authSlice.reducer;
