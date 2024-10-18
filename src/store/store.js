// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { userAuthReducer, adminAuthReducer, userCrudReducer, adminCrudReducer } from './slices/slice';

const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        adminAuth: adminAuthReducer,
        userCrud: userCrudReducer,
        adminCrud: adminCrudReducer,
    },
});

export default store;
