import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiUrl from '../../configs/apiUrls';

export const signupThunk = createAsyncThunk(
    'auth/signup',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await fetch(ApiUrl.AUTH.SIGNUP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                return rejectWithValue(data.message || 'Signup failed');
            }
            return data;
        } catch (e) {
            return rejectWithValue(e.message || 'Signup failed');
        }
    }
);

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await fetch(ApiUrl.AUTH.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                return rejectWithValue(data.message || 'Login failed');
            }
            return data;
        } catch (e) {
            return rejectWithValue(e.message || 'Login failed');
        }
    }
);

export const googleThunk = createAsyncThunk(
    'auth/google',
    async ({ email, name }, { rejectWithValue }) => {
        try {
            const res = await fetch(ApiUrl.AUTH.GOOGLE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, name }),
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                return rejectWithValue(data.message || 'Google sign-in failed');
            }
            return data;
        } catch (e) {
            return rejectWithValue(e.message || 'Google sign-in failed');
        }
    }
);

export const fetchProfileThunk = createAsyncThunk(
    'auth/me',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(ApiUrl.AUTH.ME, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                return rejectWithValue(
                    data.message || 'Failed to fetch profile'
                );
            }
            return data;
        } catch (e) {
            return rejectWithValue(e.message || 'Failed to fetch profile');
        }
    }
);

export const updateProfileThunk = createAsyncThunk(
    'auth/updateProfile',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await fetch(ApiUrl.AUTH.ME, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                return rejectWithValue(
                    data.message || 'Failed to update profile'
                );
            }
            return data;
        } catch (e) {
            return rejectWithValue(e.message || 'Failed to update profile');
        }
    }
);

export const logoutThunk = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(ApiUrl.AUTH.LOGOUT, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                return rejectWithValue(data.message || 'Logout failed');
            }
            return true;
        } catch (e) {
            return rejectWithValue(e.message || 'Logout failed');
        }
    }
);

const initialState = {
    user: null,
    status: 'idle',
    error: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signupThunk.fulfilled, (state) => {
                state.status = 'succeeded';
                // backend returns success only; don't set user here
            })
            .addCase(signupThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Signup failed';
            })
            .addCase(loginThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Login failed';
            })
            .addCase(googleThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(googleThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(googleThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Google sign-in failed';
            });
        builder
            .addCase(fetchProfileThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProfileThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload?.data || action.payload;
            })
            .addCase(fetchProfileThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch profile';
            })
            .addCase(updateProfileThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateProfileThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload?.data || action.payload;
            })
            .addCase(updateProfileThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to update profile';
            });
        builder.addCase(logoutThunk.fulfilled, (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
            state.isAuthenticated = false;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
