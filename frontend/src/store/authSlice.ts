
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../types";

// State bilkul clean, isme OTP aur tempEmail dono handle honge aapki assignment ke mutabik
const initialState: AuthState & { isOtpRequired: boolean; tempEmail: string | null } = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  isOtpRequired: false, 
  tempEmail: null,      
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isOtpRequired = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<{ email: string }>) => {
      state.loading = false;
      state.isOtpRequired = true; 
      state.tempEmail = action.payload.email;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setOtpRequired: (state, action: PayloadAction<{ required: boolean; email: string | null }>) => {
      state.isOtpRequired = action.payload.required;
      state.tempEmail = action.payload.email;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isOtpRequired = false;
      state.tempEmail = null;
      state.loading = false;
      state.error = null;
    },
    // 🔴 KHALI REDUCERS FORGOT PASSWORD KE LIYE - TA_KE UI CRASH NA HO
    forgotPasswordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    forgotPasswordSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// 🔴 SARE ACTIONS EXPORT KIYE HAIN TA_KE AUTHFORM KO ERROR NA AAYE
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  setOtpRequired,
  logout,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;