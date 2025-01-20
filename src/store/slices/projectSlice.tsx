import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { IProjectResponse, projectInputs, IProject } from "../../types/project";
import extractIdFromToken from "../../utils/decodeToken";
import apiClient from "../../utils/axios/projectAxios";


interface IInitialState {
  projects: IProject[];
  selectProjectId: null | number;
  status: "idle" | "loading" | "failed";
  error: null | string;
  selectProject:IProject | null;
}

const initialState: IInitialState = {
  projects: [],
  selectProjectId: null,
  status: "idle",
  error: null,
  selectProject:null,
};

export const getProjects = createAsyncThunk<
  IProjectResponse,
  string,
  { rejectValue: string }
>("/get-projects", async (userId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<IProjectResponse>(
      `/getprojects/${userId}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "Failed to fetch projects"
    );
  }
});

// Async thunk to create a project
export const createProject = createAsyncThunk(
  "/create-project",
  async (values: projectInputs, { rejectWithValue }) => {
    try {
      const userId = extractIdFromToken();
      if (!userId) {
        console.log("userid is not there");
        return;
      }
      const response = await apiClient.post(
        `/create?userId=${userId}`,
        values
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "Failed to create project"
      );
    }
  }
);

// Slice with typed builder
const projects = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError(state) {
      state.status = "idle";
      state.error = null;
    },
    selectProject(state,action){
      state.selectProjectId = action.payload;
      state.selectProject = state.projects.filter((project)=>action.payload === project.id)[0];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      getProjects.fulfilled,
      (state, action: PayloadAction<IProjectResponse>) => {
        console.log('action.payload',action.payload) 
        state.status = "idle";
        state.projects = action.payload.data;
      }
    );
    builder.addCase(getProjects.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getProjects.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Unable to fetch projects";
      state.selectProject = null;
    });
    builder.addCase(createProject.pending,(state)=>{
      state.status = "loading"
    });
    builder.addCase(createProject.rejected,(state)=>{
      state.error = "unable to create project";
      state.status = 'failed';
    })
    builder.addCase(createProject.fulfilled,(state)=>{
      state.error ="";
      state.status = "idle";
    })
  },
});

export const { clearError , selectProject } = projects.actions;
export default projects.reducer;
