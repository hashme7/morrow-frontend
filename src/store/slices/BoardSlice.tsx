import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../utils/axios/Apis";
import {
  createStatusColumn,
  createStatusResponse,
  deleteStatusResponse,
  getStatusResponse,
  getTaskResponse,
  IColumn,
  ITask,
  updateStatusResponse,
} from "../../types/board/board";
import { Types } from "mongoose";
import { AxiosError } from "axios";

type TaskState = {
  columns: Omit<IColumn, "team_id">[];
  tasks: ITask[];
};

const initialState: TaskState = {
  columns: [],
  tasks: [],
};

export const createColumn = createAsyncThunk<
  createStatusResponse,
  createStatusColumn,
  { rejectValue: string }
>("/createColumn", async (statusData, { rejectWithValue }) => {
  try {
    console.log(statusData, "statusData");
    const response = await Api.post<createStatusResponse>(
      "/task/create-status",
      statusData
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "failed to create new task"
    );
  }
});

export const getColumn = createAsyncThunk<
  getStatusResponse,
  { teamId: string },
  { rejectValue: string }
>("tasks/getStatus", async ({ teamId }, { rejectWithValue }) => {
  try {
    const response = await Api.get<getStatusResponse>(
      `/task/get-status/${teamId}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "failed to get the status"
    );
  }
});

export const editColumnName = createAsyncThunk<
  updateStatusResponse,
  { name: string; id: string; team_id: string },
  { rejectValue: string }
>("/updateColumn", async ({ name, id, team_id }, { rejectWithValue }) => {
  try {
    const response = await Api.post<updateStatusResponse>(
      `/task/update-status/${team_id}`,
      { name, id }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "failed to update the name"
    );
  }
});

export const deleteColumn = createAsyncThunk<
  deleteStatusResponse,
  { id: string; team_id: string },
  { rejectValue: string }
>("/deleteColumn", async ({ id, team_id }, { rejectWithValue }) => {
  try {
    const response = await Api.delete<deleteStatusResponse>(
      `/task/delete-task/${team_id}?id=${id}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "failed to delete the column"
    );
  }
});

export const createTask = createAsyncThunk<
  ITask,
  {
    name: string;
    id: string;
    status: string;
    priority: string;
    team_id: string;
    assignee: { _id: Types.ObjectId }[];
  },
  { rejectValue: string }
>(
  "/addTask",
  async (
    { name, id, priority, status, team_id, assignee },
    { rejectWithValue }
  ) => {
    try {
      const response = await Api.post<ITask>(
        `/task/create-task/${team_id}?status=${status}&name=${name}&id=${id}&priority=${priority}`,
        { assignee }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "failed to create the Task"
      );
    }
  }
);

export const getTasks = createAsyncThunk<
  getTaskResponse,
  { team_id: string },
  { rejectValue: string }
>("/getTask", async ({ team_id }, { rejectWithValue }) => {
  try {
    const response = await Api.get<getTaskResponse>(
      `/task/getTasks/${team_id}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message || "failed to get task"
    );
  }
});

export const updateTaskStatus = createAsyncThunk<
  ITask,
  { team_id: string; id: string; status: string },
  { rejectValue: string }
>(
  "/update-taskStatus",
  async ({ team_id, id, status }, { rejectWithValue }) => {
    try {
      const response = await Api.put<ITask>(
        `/task/update-taskStatus/${team_id}?id=${id}&status=${status}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "failed to get task"
      );
    }
  }
);

// Slice
const BoardSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTask(state) {
      state.tasks = state.tasks;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createColumn.fulfilled, (state, action) => {
      state.columns = [...state.columns, action.payload.data];
      console.log("state,column", state.columns);
    });
    builder.addCase(getColumn.fulfilled, (state, action) => {
      const data = action.payload.data;
      const todo = data.find((item) => item.id === "todo");
      const completed = data.find((item) => item.id === "completed");
      const middleItems = data.filter(
        (item) => item.id !== "todo" && item.id !== "completed"
      );
      const reorderedColumns = [
        ...(todo ? [todo] : []),
        ...middleItems,
        ...(completed ? [completed] : []),
      ];
      state.columns = reorderedColumns;
    });
    builder.addCase(editColumnName.fulfilled, (state, action) => {
      const filteredColumns = state.columns.filter(
        (column) => column.id !== action.payload.data.id
      );
      state.columns = [...filteredColumns, action.payload.data];
    });
    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      const filteredColumns = state.columns.filter(
        (column) => column.id != action.payload.data
      );
      state.columns = [...filteredColumns];
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      console.log("createTask", action.payload);
      state.tasks = [...state.tasks, action.payload];
      console.log(state.tasks);
    });
    builder.addCase(getTasks.fulfilled, (state, action) => {
      const transformedTasks = action.payload.map((task) => ({
        ...task,
        status: task.status.id || "",
      }));
      state.tasks = transformedTasks.filter(
        (task) => !state.tasks.includes(task)
      );
    });
    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      state.tasks = state.tasks.map((task: ITask) => {
        if (task._id == action.payload._id) return action.payload;
        return task;
      });
    });
  },
});

export const { setTask } = BoardSlice.actions;
export default BoardSlice.reducer;
