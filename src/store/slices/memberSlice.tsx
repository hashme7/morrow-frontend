import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IUpdateResponse, IUser } from "../../types/member";
import { AxiosError } from "axios";
import axios from "../../utils/axios/Apis";

interface IInitialState {
  members: IUser[];
  users: IUser[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  currUserPage: number;
  totalUserPage: number;
  totalUserItems: number;
  isLoading: boolean;
  error: string | null;
}

export const getTeamMembers = createAsyncThunk(
  "members/getTeamMembers",
  async (
    { projectId, page }: { projectId: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/user/getTeamMembers?projectId=${projectId}&page=${page}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "Failed to fetch team members"
      );
    }
  }
);
export const updateRole = createAsyncThunk<
  IUpdateResponse,
  { teamId: string; userId: string; role: string },
  { rejectValue: string }
>(
  "members/update-role",
  async ({ teamId, userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/user/update-role?userId=${userId}&teamId=${teamId}&role=${role}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "Failed to fetch requests "
      );
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "members/getAllUsers",
  async ({ page }: { page: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user/users?page=${page}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "Failed to fetch requests "
      );
    }
  }
);

const initialState: IInitialState = {
  members: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  users: [],
  currUserPage: 0,
  totalUserPage: 0,
  totalUserItems: 0,
  isLoading: false,
  error: null,
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    resetMembers: (state) => {
      state.members = [];
      state.totalItems = 0;
      state.totalPages = 0;
      state.currentPage = 0;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeamMembers.fulfilled, (state, action) => {
        const { data, totalItems, totalPages, currentPage } = action.payload;
        const hash = new Map();
        for (const member of state.members) {
          hash.set(String(member._id), member);
        }
        const filterMember = data.filter(
          (member: IUser) => !hash.has(String(member._id))
        );
        state.members = [...state.members, ...filterMember]; 
        state.members = data;
        state.totalItems = totalItems;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.isLoading = false;
      })
      .addCase(getTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        const { data, totalItems, totalPages, currentPage } = action.payload;
        const hash = new Map();
        for (const user of state.users) {
          hash.set(user._id, user);
        }
        const filteredData = data.filter(
          (user: IUser) => !hash.has(String(user._id))
        );
        state.users = [...state.users, ...filteredData];
        state.totalUserItems = totalItems;
        state.totalUserPage = totalPages;
        state.currUserPage = currentPage;
      });
  },
});

export const { resetMembers } = membersSlice.actions;
export default membersSlice.reducer;
