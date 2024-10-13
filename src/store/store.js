// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { userAuthReducer, adminAuthReducer } from './auth/authSlice';
import { userCrudReducer, adminCrudReducer } from './auth/authSlice'; // Fixed import

const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        adminAuth: adminAuthReducer,
        userCrud: userCrudReducer,
        adminCrud: adminCrudReducer,
    },
});

export default store;
