import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import  axios,{ AxiosError } from "axios";
import { ObjectId } from "mongodb";

interface SignupState{
  userName:string,
  email:string,
  password:string,
  otpSent:boolean,
  errorMessage:string | null,
  userId:ObjectId | null,
}

const intialState:SignupState = {
  userName:'',
  email: "",
  password: "",
  otpSent: false,
  errorMessage: null,
  userId :null
}

interface SignupResponse {
  username: string,
  password: string,
  email: string,
  isProjectManager: boolean,
  isVerified: boolean,
  _id: ObjectId,
  registrationTime: Date,
  createdAt: Date,
  updatedAt: Date,
  __v?: number
}


export const signupUser = createAsyncThunk('/sign-up',async(userData:{ username: string; email: string; password: string },{rejectWithValue})=>{
  try {
    const response = await axios.post<SignupResponse>(
      "https://morrow.hashim-dev007.online/auth/sign-up",
      userData
    );
    return response.data;
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError<{message:string}>
    if(axiosError.response && axiosError.response.data){
      return rejectWithValue(axiosError.response.data.message || "Signup failed")
    }
    return rejectWithValue("Network erro");
  }
})

const signupSlice = createSlice({
  name:'signup',
  initialState:intialState,
  reducers:{
    clearError(state){
      state.errorMessage = null;
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(signupUser.fulfilled,(state,action)=>{
      state.otpSent = true;
      state.errorMessage = null;
      state.userId = action.payload._id;
    })
    builder.addCase(signupUser.rejected, (state, action) => {
      state.errorMessage = action.payload as string;
    });
  }
})

export const {clearError}  = signupSlice.actions;
export default signupSlice.reducer;
