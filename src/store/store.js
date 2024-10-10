// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { userAuthReducer, adminAuthReducer } from './auth/authSlice';
import { userCrudReducer } from './auth/authSlice'; // Fixed import

const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        adminAuth: adminAuthReducer,
        userCrud: userCrudReducer,
    },
});

export default store;
