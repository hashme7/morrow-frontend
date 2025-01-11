import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IApi } from "../../types/api";
import { AxiosError } from "axios";
import taskApi from "../../utils/axios/taskAxios";

type ApiState = {
  apis: IApi[];
};
const initialState: ApiState = {
  apis: [],
};

export const saveApi = createAsyncThunk<
  IApi,
  { projectId: number; url: string; method: string; body: any,response:any },
  { rejectValue: string }
>("/test-api", async({ projectId, url, method, body ,response}, { rejectWithValue }) => {
    try {
        const res = await taskApi.post('/save-api', { projectId, url, method, body, response });
        return res.data;
    } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "failed to get task"
    );
  }
});
export const getApis = createAsyncThunk<IApi[], { projectId: number }, { rejectValue: string }>("/get-apis",async ({projectId},{rejectWithValue}) => {
  try {
    const res = await taskApi.get(`/get-apis/${projectId}`);
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "failed to get task"
    );
  }
})

const ApiSlice = createSlice({
  name: "Apis",
  initialState,
  reducers: {},
    extraReducers: (builder) => {
      builder.addCase(saveApi.fulfilled, (state, action) => {
          console.log("kkkk");
          state.apis = [...state.apis,action.payload];
        })
      builder.addCase(getApis.fulfilled, (state, action) => {
        console.log(action.payload)
        state.apis = action.payload;
      })
  },
});

export default ApiSlice.reducer;
