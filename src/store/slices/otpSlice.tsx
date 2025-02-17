import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import { ObjectId } from "mongodb";

interface OtpState {
  loading: boolean;
  otpVerified: boolean;
  errorMessage: string | null;
}

const initialState: OtpState = {
  loading: false,
  otpVerified: false,
  errorMessage: null,
};

export const verifyOtp = createAsyncThunk(
  "verify-otp",
  async (
    { otp, userId }: { otp: string; userId: ObjectId | null },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "https://morrow.hashim-dev007.online/auth/verify-otp",
        {
          otp,
          userId,
        }
      );
      return response.data;
    }  catch (error:unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        }
      }
      return rejectWithValue("Something went wrong");
    }
  }
);
export const resendOtp = createAsyncThunk(
  "resend-otp",
  async ({ userId }: { userId: ObjectId | null }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://morrow.hashim-dev007.online/auth/resend-otp",
        { userId }
      );
      return response.data;
    } catch (error:unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        }
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    resetOtpState: (state) => {
      state.loading = false;
      state.otpVerified = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
        state.errorMessage = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        console.log("incorrect otp");
        state.loading = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(resendOtp.pending,(state)=>{
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(resendOtp.rejected,(state,action)=>{
        state.loading = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(resendOtp.fulfilled,(state)=>{
        state.loading = false;
      })
  },
});

export const { resetOtpState } = otpSlice.actions;

export default otpSlice.reducer;
