import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { IProjectResponse, projectInputs, IProject } from "../../types/project";
import apiClient from "../../utils/axios/Apis";

interface IInitialState {
  projects: IProject[];
  selectProjectId: null | number;
  status: "idle" | "loading" | "failed";
  error: null | string;
  selectProject: IProject | null;
}

const initialState: IInitialState = {
  projects: [],
  selectProjectId: null,
  status: "idle",
  error: null,
  selectProject: null,
};

export const getProjects = createAsyncThunk<
  IProjectResponse,
  void,
  { rejectValue: string }
>("/get-projects", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<IProjectResponse>(
      `/project/getprojects/`
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
      const response = await apiClient.post(`/project/create`, values);
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
    selectProject(state, action) {
      state.selectProjectId = action.payload;
      state.selectProject = state.projects.filter(
        (project) => action.payload === project.id
      )[0];
       console.log(JSON.stringify(state.selectProject))
    },
    clearSelectProject(state) {
      state.selectProject = null;
      state.selectProjectId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getProjects.fulfilled,
      (state, action: PayloadAction<IProjectResponse>) => {
        console.log("action.payload", action.payload);
        state.status = "idle";
        state.projects = action.payload.data;
        if (!state.selectProject && state.projects.length) {
          state.selectProject = state.projects[state.projects.length - 1];
          state.selectProjectId = state.projects[state.projects.length - 1].id;
        }
      }
    );
    builder.addCase(getProjects.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getProjects.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Unable to fetch projects";
      state.selectProject = null;
      state.selectProjectId = null;
    });
    builder.addCase(createProject.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createProject.rejected, (state) => {
      state.error = "unable to create project";
      state.status = "failed";
    });
    builder.addCase(createProject.fulfilled, (state) => {
      state.error = "";
      state.status = "idle";
    });
  },
});

export const { clearError, selectProject, clearSelectProject } =
  projects.actions;
export default projects.reducer;
