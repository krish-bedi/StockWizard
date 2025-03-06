import { createSlice } from "@reduxjs/toolkit";
import { sessionManager } from "../../utils/sessionManager";

// Auth Slice: Manages local auth state (logged in/out, user info)

// Initial state is set from localStorage if available
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,
};

// User info is stored in localStorage and cleared on logout
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      sessionManager.startSessionTimer(15 * 60 * 1000); // 15 minutes
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      sessionManager.clearSessionTimer();
      window.location.href = '/login';
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
