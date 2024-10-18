import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_AUTH_URL, API_USER_URL, API_ADMIN_URL, getRandomAvatarURL } from '../../constants';

// Async Thunks
// User Authentication Thunks
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await axios.post(`${API_AUTH_URL}/login`, { email, password });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Login failed. Please check your credentials.');
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async ({ name, email, age, gender, address, phoneNumber, password }, thunkAPI) => {
        try {

            const response = await axios.post(`${API_AUTH_URL}/signup`, {
                name, email, age: Number(age), gender, address, phoneNumber: Number(phoneNumber), password, image_url: getRandomAvatarURL()
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Signup failed. Please check your information.');
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_USER_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch user profile');
        }
    }
);

export const uploadProfilePicture = createAsyncThunk(
    'auth/uploadProfilePicture',
    async (file, thunkAPI) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', "ml_default");

        try {
            const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dcfoqhrxb/upload";

            // Send the file to Cloudinary
            const response = await fetch(cloudinaryUrl, { method: 'POST', body: formData });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Image upload failed.');
            }

            const data = await response.json();
            const imageUrl = data.secure_url;
            const token = localStorage.getItem('token');

            // Send the image URL to the backend
            const backendResponse = await axios.post(
                `${API_USER_URL}/upload-profile-picture`,
                { image_url: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (backendResponse.status !== 200) {
                throw new Error('Failed to update profile picture in the backend.');
            }

            // Optionally dispatch fetchUserProfile to refresh user data
            await thunkAPI.dispatch(fetchUserProfile()).unwrap();

            // Return a success message or some data
            return { success: true }; // Return success status
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Profile picture upload failed.');
        }
    }
);



// Admin Authentication Thunks
export const loginAdmin = createAsyncThunk(
    'adminAuth/loginAdmin',
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await axios.post(`${API_AUTH_URL}/admin/login`, { email, password });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Admin login failed. Please check your credentials.');
        }
    }
);

// Admin CRUD Thunks
export const fetchUserProfileList = createAsyncThunk(
    'adminCrud/fetchUserProfileList',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_ADMIN_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && Array.isArray(response.data.users)) {
                return response.data.users;
            } else {
                throw new Error("User data is not in the expected format");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to fetch user profiles');
        }
    }
);

export const blockUser = createAsyncThunk(
    'adminCrud/blockUser',
    async (userID, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${API_ADMIN_URL}/users/block/?id=${userID}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue('User Block failed');
        }
    }
);

export const unblockUser = createAsyncThunk(
    'adminCrud/unblockUser',
    async (userID, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${API_ADMIN_URL}/users/unblock/?id=${userID}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue('User Unblock failed');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'adminCrud/deleteUser',
    async (userID, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${API_ADMIN_URL}/users/?id=${userID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue('User Delete failed');
        }
    }
);



// Slices
// User Auth Slice
const userAuthSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('token');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        removeError: (state, action) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('refresh_token', action.payload.refresh_token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Admin Auth Slice
const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState: {
        admin: null,
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        logoutAdmin: (state) => {
            state.admin = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');

        },
        removeError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload.admin;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('refresh_token', action.payload.refresh_token);
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Admin CRUD Slice
const adminCrudSlice = createSlice({
    name: 'adminCrud',
    initialState: {
        users: [],
        token: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(blockUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(blockUser.fulfilled, (state, action) => {
                state.loading = false;
                if (state.users) {
                    const index = state.users.findIndex(user => user.id === action.payload.id);
                    if (index !== -1) {
                        state.users[index] = { ...state.users[index], isBlocked: true };
                    }
                }
            })
            .addCase(blockUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(unblockUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unblockUser.fulfilled, (state, action) => {
                state.loading = false;
                if (state.users) {
                    const index = state.users.findIndex(user => user.id === action.payload.id);
                    if (index !== -1) {
                        state.users[index] = { ...state.users[index], isBlocked: false };
                    }
                }
            })
            .addCase(unblockUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                if (state.users) {
                    state.users = state.users.filter(user => user.id !== action.payload.id);
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserProfileList.fulfilled, (state, action) => {
                const modifiedUsers = action.payload.map(user => ({
                    ...user,
                    gender: user.gender.toUpperCase(),
                }));

                state.users = modifiedUsers;
            });
    },
});

// User CRUD Slice
const userCrudSlice = createSlice({
    name: 'userCrud',
    initialState: {
        user: null,
        userList: null,
        loading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadProfilePicture.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadProfilePicture.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(uploadProfilePicture.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});


// Exports
export const { logout, removeError } = userAuthSlice.actions;
export const { logoutAdmin } = adminAuthSlice.actions;
export const { setUser } = userCrudSlice.actions;

export const userAuthReducer = userAuthSlice.reducer;
export const adminAuthReducer = adminAuthSlice.reducer;
export const adminCrudReducer = adminCrudSlice.reducer;
export const userCrudReducer = userCrudSlice.reducer;

