import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;
            localStorage.setItem('dokita_token', token);
            return { token, user };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Erreur de connexion.');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;
            localStorage.setItem('dokita_token', token);
            return { token, user };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Erreur d\'inscription.');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {}
        localStorage.removeItem('dokita_token');
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user:    null,
        token:   localStorage.getItem('dokita_token') || null,
        loading: false,
        error:   null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearAuth: (state) => {
            state.user    = null;
            state.token   = null;
            state.loading = false;
            state.error   = null;
            localStorage.removeItem('dokita_token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user    = action.payload.user;
                state.token   = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
            });

        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user    = action.payload.user;
                state.token   = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
            });

        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user  = null;
                state.token = null;
            });
    },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;