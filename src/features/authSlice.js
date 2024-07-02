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
    },
});

export const { register, login } = authSlice.actions;

export default authSlice.reducer;
