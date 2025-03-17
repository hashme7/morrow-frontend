import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { ObjectId } from "mongodb";
import axios from '../../utils/axios/Apis';

interface SignupState {
  userName: string;
  email: string;
  password: string;
  otpSent: boolean;
  errorMessage: string | null;
  userId: ObjectId | null;
}

const intialState: SignupState = {
  userName: "",
  email: "",
  password: "",
  otpSent: false,
  errorMessage: null,
  userId: null,
};

interface SignupResponse {
  username: string;
  password: string;
  email: string;
  isProjectManager: boolean;
  isVerified: boolean;
  _id: ObjectId;
  registrationTime: Date;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

export const signupUser = createAsyncThunk(
  "/sign-up",
  async (
    userData: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<SignupResponse>(
        "/auth/sign-up",
        userData
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.status == 409) {
        return rejectWithValue("Entered email is already signed!");
      } else if (axiosError.status === 400) {
        return rejectWithValue("Otp sending is failed, Try again later!");
      } else if (axiosError.status == 500) {
        return rejectWithValue("Server is Down, Please try again later!");
      }
      return rejectWithValue(axiosError.message);
    }
  }
);

const signupSlice = createSlice({
  name: "signup",
  initialState: intialState,
  reducers: {
    clearError(state) {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.otpSent = true;
      state.errorMessage = null;
      state.userId = action.payload._id;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.errorMessage = action.payload as string;
    });
  },
});

export const { clearError } = signupSlice.actions;
export default signupSlice.reducer;
