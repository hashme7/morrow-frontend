import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { IMessage } from "../../types/Chat";
import api from "../../utils/axios/Apis";
interface IInitialState {
  teamName: string;
  teamId: string;
  chats: IMessage[];
  error: null | string;
}

const initialState: IInitialState = {
  teamName: "",
  teamId: "",
  chats: [],
  error: null,
};

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      senderId,
      receiverId,
      content,
    }: { senderId: string; receiverId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/communicate/sendMessage?senderId=${senderId}&receiverId=${receiverId}&content=${content}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "failed to send meessages"
      );
    }
  }
);
export const getMessage = createAsyncThunk(
  "chat/getMessage",
  async (
    { receiverId, page }: { receiverId: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/communicate/getMessage?receiverId=${receiverId}&page=${page}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data.message);
    }
  }
);

const chats = createSlice({
  name: "chats",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setMessage(state, action) {
      state.chats = [...state.chats, action.payload];
    },
    clearChat(state) {
      state.teamName = "";
      state.teamId = "";
      state.chats = [];
      state.error = null
        
    },
    setSeenMsg(state, action) {
      state.chats = state.chats.map((chat) => {
        if (chat._id == action.payload._id) {
          return action.payload;
        } else {
          return chat;
        }
      });
      console.log("onmessage setSeenMesg",state.chats);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMessage.fulfilled, (state, action) => {
      state.chats = [...action.payload];
    });
  },
});

export const { clearError, setMessage, setSeenMsg , clearChat} = chats.actions;

export default chats.reducer;
