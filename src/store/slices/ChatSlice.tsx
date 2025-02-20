import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { IMessage } from "../../types/Chat";
import api from '../../utils/axios/loginApi'
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
      state.chats = [...state.chats,action.payload];
    },  
    setSeenMsg(state, action) {
      console.log("msg status changing......")
      state.chats = state.chats.map((chat) => {
        if (chat._id == action.payload._id) {
          return action.payload;
        } else {
          return chat;
        }
      })
    }
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.fulfilled, () => {
      console.log("fakdfk;adskfjkjdskfjaksjdl;f");
    });
    builder.addCase(getMessage.fulfilled, (state, action) => {
      state.chats = [...action.payload];
    });
  },
});

export const { clearError,setMessage ,setSeenMsg} = chats.actions;

export default chats.reducer;
