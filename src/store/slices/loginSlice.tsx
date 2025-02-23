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

const initialState: LoginState = {
  email: "",
  password: "",
  isLoggedIn: false,
  role: null,
  errorMessage: null,
};
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (
    loginData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginApi.post<LoginResponse>("/auth/login", loginData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response) {
        if (axiosError.response.status === 401) {
          return rejectWithValue("Invalid email or password");
        }

        return rejectWithValue(
          axiosError.response.data.message || "Login failed"
        );
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

export const logout = createAsyncThunk(
  "logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await loginApi.post<LogoutResponse>("/auth/logout");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
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
      console.log(action, "actionsss");
      state.isLoggedIn = true;
      state.errorMessage = null;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.isLoggedIn = false;
    });
    builder.addCase(checkTokenValidity.fulfilled, (state, action) => {
      if (action.payload.valid) {
        state.isLoggedIn = true;
      } else {
        state.isLoggedIn = false;
      }
    });
    builder.addCase(checkTokenValidity.rejected, (state, action) => {
      console.log(action, "action in rejection");
      state.isLoggedIn = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoggedIn = false;
    });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      console.log(action.payload);
      state.isLoggedIn = true;
    });
    builder.addCase(gitHubLogin.fulfilled, (state, action) => {
      if (action.payload.accessToken && action.payload.refreshToken) {
        state.isLoggedIn = true;
      }
    });
  },
});

export const { clearError, setIsLoggedIn } = loginSlice.actions;

export default loginSlice.reducer;
