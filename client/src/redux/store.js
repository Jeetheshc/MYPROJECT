import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/UserSlice";
import adminReducer from "./features/AdminSlice";


export const store = configureStore({
    reducer: {
        user: userReducer,
        admin: adminReducer,
         },
});