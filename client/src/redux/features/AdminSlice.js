import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAdminAuth: false,
    adminData: {},
};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        saveAdminData: (state, action) => {
            (state.isAdminAuth = true), (state.adminData = action.payload);
        },
        clearAdminData: (state) => {
            (state.isAdminAuth = false), (state.adminData = {});
        },
    },
});

// Action creators are generated for each case reducer function
export const { saveAdminData,clearAdminData } = adminSlice.actions;

export default adminSlice.reducer;