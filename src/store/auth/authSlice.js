// Admin auth slice
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
        },
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
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// src/redux/authSlices.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_AUTH_URL, API_USER_URL } from '../../constants';

// User authentication thunks
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
                name,
                email,
                age: Number(age),
                gender,
                address,
                phoneNumber: Number(phoneNumber),
                password,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Signup failed. Please check your information.');
        }
    }
);

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

// User auth slice
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
            localStorage.removeItem('token');
        },
        setUser: (state, action) => {
            console.log("setting user after image upload")
            state.user = action.payload; 
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
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_USER_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Image upload failed.');
            }

            const data = await response.json();
            const imageUrl = data.secure_url;
            const token = localStorage.getItem('token');
            await axios.post(`${API_USER_URL}/upload-profile-picture`, {
                image_url: imageUrl,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Fetch the updated profile
            const updatedUser = await thunkAPI.dispatch(fetchUserProfile()).unwrap();
            return updatedUser; 
        } catch (error) {
            return thunkAPI.rejectWithValue('Profile picture upload failed.');
        }
    }
);

// User CRUD slice
const userCrudSlice = createSlice({
    name: 'userCrud',
    initialState: {
        user:null,
        loading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            console.log("setting user after image upload")
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
                // Handle success case if needed
            })
            .addCase(uploadProfilePicture.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload; 
            })
        
    },
});

export const userCrudReducer = userCrudSlice.reducer;
export const { setUser } = userCrudSlice.actions;


export const { logout } = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;
export const adminAuthReducer = adminAuthSlice.reducer;

const authReducers = { userAuth: userAuthReducer, adminAuth: adminAuthReducer };
export default authReducers;

