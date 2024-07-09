// authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        status: 'idle',
    },
    reducers: {
        register: (state, action) => {
            state.user = action.payload;
            state.status = 'success';
        },
        login: (state, action) => {
            state.user = action.payload;
            state.status = 'logged_in';
        },
        logout: (state) => {
            state.user = null;
            state.status = 'idle';
        },
    },
});

export const { register, login, logout } = authSlice.actions;

export default authSlice.reducer;
