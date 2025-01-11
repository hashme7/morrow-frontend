import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IDbDesign } from "../../types/diagram";
import taskApi from "../../utils/axios/taskAxios";
import { AxiosError } from "axios";

const initialState: IDbDesign = {
  projectId: 0,
  nodes: [],
  edges: [],
  viewport: {
    x: 0,
    y: 0,
    zoom: 0,
  },
};

export const saveDiagram = createAsyncThunk(
  "/save-diagram",
  async (dbDesign: IDbDesign, { rejectWithValue }) => {
    try {
      console.log("saving the files....")
      const response = await taskApi.post("/save-diagram", { dbDesign });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "failed to get task"
      );
    }
  }
);
export const getDiagram = createAsyncThunk(
  "/get-diagram",
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await taskApi.get(`/get-diagram?projectId=${projectId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "failed to get task"
      );
    }
  }
);

const DiagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveDiagram.fulfilled, (state, action) => {
      // Object.assign(state, action.payload);
      state.projectId = action.payload.projectId;
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
      state.viewport = action.payload.viewport;
    });
    builder.addCase(getDiagram.fulfilled, (state, action) => {
      if (action.payload) {
        state.projectId = action.payload.projectId;
        state.nodes = action.payload.nodes;
        state.edges = action.payload.edges;
        state.viewport = action.payload.viewport;
      } else {
        console.log("dfkasjdf;kas")
        state = {
          projectId: 0,
          nodes: [],
          edges: [],
          viewport: {
            x: 0,
            y: 0,
            zoom: 0,
          },
        };
      }
    });
  },
});

export default DiagramSlice.reducer;