import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../Store";
import { users } from "@prisma/client";

interface StateType {
    isAuthenticated: boolean;
    userData: users | null;
}

const initialState = {
    isAuthenticated: false,
    userData: null,
};

export const UserDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
    }
});

export const { setIsAuthenticated, setUserData } = UserDataSlice.actions;

export default UserDataSlice.reducer;