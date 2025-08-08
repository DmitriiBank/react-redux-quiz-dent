import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
    authUser: string;
    displayName: string;
    isLoading: boolean;
}

const initialState: AuthState = {
    authUser: "",
    displayName: "",
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginAction: (state, action) => {
            state.authUser = action.payload.email;
            state.displayName = action.payload.displayName;
            state.isLoading = false;
        },
        logout: (state) => {
            state.authUser = "";
            state.displayName = "";
            state.isLoading = false;
        },
        setAuthLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
});



export const { loginAction, logout , setAuthLoading} = authSlice.actions;
export default authSlice.reducer;
