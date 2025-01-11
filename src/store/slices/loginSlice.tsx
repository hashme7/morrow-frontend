  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  gitHubLoginResponse,
  LoginResponse,
  LoginState,
  LogoutResponse,
  TokenValidityResponse,
} from "../../types/login/loginState";
import loginApi from "../../utils/axios/loginApi";
import { AxiosError } from "axios";

const initialState: LoginState = {
  email: "",
  password: "",
  isLoggedIn: false,
  role: null,
  errorMessage: null,
};
export const loginUser = createAsyncThunk(
  "/login",
  async (
    loginData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginApi.post<LoginResponse>(
        "/login",
        loginData
      );
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
        "/validate-token"
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
        userId:string;
      }>("http://localhost:8000/google-login", { token });
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
      const response = await loginApi.post<LogoutResponse>(
        "http://localhost:8000/logout"
      );
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
  async(code:string,{rejectWithValue})=>{
    try {
      const response = await loginApi.post<gitHubLoginResponse>("http://localhost:8000/github-login",{code});
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{message:string}>
      return rejectWithValue(axiosError.response?.data.message || "gitHub Login Failed"
      )
    }
  }
)

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearError(state) {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.errorMessage = null;
      localStorage.setItem("userId",action.payload.userId);
    });
    builder.addCase(checkTokenValidity.fulfilled, (state, action) => {
      if (action.payload.valid) {
        state.isLoggedIn = true;
      } else {
        state.isLoggedIn = false;
      }
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoggedIn = false;
    });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      console.log(action.payload);
      state.isLoggedIn = true;
    });
    builder.addCase(gitHubLogin.fulfilled, (state,action)=>{
      if(action.payload.accessToken && action.payload.refreshToken){
        state.isLoggedIn =true;
      }
    })
  },
});

export const { clearError } = loginSlice.actions;

export default loginSlice.reducer;
