import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./redux/slices/authSlice";
import { apiSlice } from "./redux/slices/apiSlice";
import formSlice from "./redux/slices/formSlice";

export const store = configureStore({
    reducer: {
        formData: formSlice,
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true, // Enable Redux DevTools Chrome extension
});

// Typescript helper to infer the type of the state
export type RootState = ReturnType<typeof store.getState>;
// Typescript helper to infer the type of the dispatch function 
export type AppDispatch = typeof store.dispatch; 