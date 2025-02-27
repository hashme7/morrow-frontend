import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IApi } from "../../types/api";
import { AxiosError } from "axios";
import Api from "../../utils/axios/Apis";

type ApiState = {
  apis: IApi[];
};
const initialState: ApiState = {
  apis: [],
};

export const saveApi = createAsyncThunk<
  IApi,
  { projectId: number; url: string; method: string; body: any; response: any },
  { rejectValue: string }
>(
  "/save-api",
  async ({ projectId, url, method, body, response }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/task/save-api", {
        projectId,
        url,
        method,
        body,
        response,
      });
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "failed to get task"
      );
    }
  }
);
export const getApis = createAsyncThunk<
  IApi[],
  { projectId: number },
  { rejectValue: string }
>("/get-apis", async ({ projectId }, { rejectWithValue }) => {
  try {
    const res = await Api.get(`/task/get-apis/${projectId}`);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "failed to get task"
    );
  }
});

const ApiSlice = createSlice({
  name: "Apis",
  initialState,
  reducers: {
    clearApis(state) {
      state.apis = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveApi.fulfilled, (state, action) => {
      state.apis = [...state.apis, action.payload];
    });
    builder.addCase(getApis.fulfilled, (state, action) => {
      console.log(action.payload);
      state.apis = action.payload;
    });
  },
});

export const { clearApis } = ApiSlice.actions;
export default ApiSlice.reducer;
