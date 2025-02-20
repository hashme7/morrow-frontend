import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IRequestResponse, IRequestsState } from "../../types/requests";
import axios from "../../utils/axios/Apis";
import { AxiosError } from "axios";

const InitialState: IRequestsState = {
  requests: [],
  error: false,
  isLoading: false,
};

export const getRequests = createAsyncThunk<
  IRequestResponse,
  void,
  { rejectValue: string }
>("request/getRequest", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<IRequestResponse>(`/user/getRequests`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "Failed to fetch requests "
    );
  }
});

export const sendRequest = createAsyncThunk(
  "members/sendRequest",
  async (
    {
      projectId,
      userId,
      note,
    }: { projectId: string; userId: string; note: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `/user/createRequest?projectId=${projectId}&userId=${userId}&note=${note}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "failed to send request"
      );
    }
  }
);
export const acceptRequest = createAsyncThunk(
  "members/acceptRequest",
  async (
    { requestId, teamId }: { requestId: string; teamId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `/user/acceptRequest?requestId=${requestId}&teamId=${teamId}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "failed to accept request"
      );
    }
  }
);

const requestSlice = createSlice({
  name: "Request",
  initialState: InitialState,
  reducers: {
    clearError(state) {
      state.error = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRequests.fulfilled, (state, action) => {
      console.log(action.payload.data, "payload of get Requests..");
      state.requests = action.payload.data;
      state.error = false;
      state.isLoading = false;
    });
    builder.addCase(acceptRequest.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(acceptRequest.fulfilled, (state) => {
      state.isLoading = false;
      state.error = false;
    });
  },
});

export const { clearError } = requestSlice.actions;
export default requestSlice.reducer;
