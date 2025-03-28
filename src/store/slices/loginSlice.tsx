import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  gitHubLoginResponse,
  LoginResponse,
  LoginState,
  LogoutResponse,
  TokenValidityResponse,
} from "../../types/login/loginState";
import loginApi from "../../utils/axios/Apis";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { persistor } from '../store';

const initialState: LoginState = {
  email: "",
  password: "",
  isLoggedIn: false,
  role: null,
  errorMessage: "",
};
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (
    loginData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginApi.post<LoginResponse>(
        "/auth/login",
        loginData
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response) {
        if (axiosError.response.status == 500) {
          return rejectWithValue("Server is down please try again later");
        }
        return rejectWithValue(axiosError.response.data.message);
      }
      return rejectWithValue("Network error");
    }
  }
);

export const checkTokenValidity = createAsyncThunk(
  "auth/checkTokenValidity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await loginApi.get<TokenValidityResponse>(
        "/auth/validate-token"
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "Token validation failed"
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  "google-login",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await loginApi.post<{
        message: string;
        refreshToken: string;
        accessToken: string;
        userId: string;
      }>("/auth/google-login", { token });
      return response.data;
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "Token validation failed.."
      );
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "forgot-password",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await loginApi.post<{ message: string }>(
        `/auth/forgot-password`,
        { email }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        if (axiosError.response.status == 500) {
          return rejectWithValue("Server is down please try again later");
        }
        return rejectWithValue(axiosError.response.data.message);
      }
      return rejectWithValue("Network error");
    }
  }
);
export const resetPassword = createAsyncThunk(
  "reset-password",
  async (
    { newPassword, token }: { newPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginApi.post<{ message: string }>(
        `/auth/reset-password/${token}?password=${newPassword}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        if (axiosError.response.status == 500) {
          return rejectWithValue("Server is down please try again later");
        }
        return rejectWithValue(axiosError.response.data.message);
      }
      return rejectWithValue("Network error");
    }
  }
);

export const logout = createAsyncThunk(
  "logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await loginApi.post<LogoutResponse>("/auth/logout");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      console.log("removing all datas from the redux")
      await persistor.purge();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "logout is failed"
      );
    }
  }
);

export const gitHubLogin = createAsyncThunk(
  "gitHublogin",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await loginApi.post<gitHubLoginResponse>(
        "/auth/github-login",
        { code }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "gitHub Login Failed"
      );
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearError(state) {
      state.errorMessage = null;
    },
    setIsLoggedIn(state) {
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      localStorage.setItem("userId", action.payload.userId);
      state.isLoggedIn = true;
      state.errorMessage = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.errorMessage = action.payload as string;
      state.isLoggedIn = false;
    });
    builder.addCase(checkTokenValidity.fulfilled, (state, action) => {
      if (action.payload.valid) {
        localStorage.setItem("userId", action.payload.userId);
        state.isLoggedIn = true;
      } else {
        localStorage.removeItem("userId");
        state.isLoggedIn = false;
      }
    });
    builder.addCase(checkTokenValidity.rejected, (state, action) => {
      console.log(action, "action in rejection");
      localStorage.removeItem("userId");
      state.isLoggedIn = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      localStorage.removeItem("userId");
      state.isLoggedIn = false;
    });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      console.log(action.payload);
      localStorage.setItem("userId", action.payload.userId);
      state.isLoggedIn = true;
    });
    builder.addCase(gitHubLogin.fulfilled, (state, action) => {
      if (action.payload.accessToken && action.payload.refreshToken) {
        localStorage.setItem("userId", action.payload.userId);
        state.isLoggedIn = true;
      }
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      console.log("reject forgot password", state, action);
      state.errorMessage = "";
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      console.log("reject forgot password", state, action);
      state.errorMessage = action.payload as string;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      console.log("failed in action",action);
      state.errorMessage = action.payload as string;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.errorMessage = "";
    })
  },
});

export const { clearError, setIsLoggedIn } = loginSlice.actions;

export default loginSlice.reducer;
