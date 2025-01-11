import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from '../../utils/axios/usersApi'
import { AxiosError } from "axios";
import { ObjectId } from "mongodb";

const initialState = {
  image: "",
  fullName: "",
  userName: "",
  basedIn: "",
  jobTitle: "",
  phone: "",
  email: "",
  isLoading: false,
  errorMessage: "",
  successMessage: "",
  error: false,
};

type ProfileState = typeof initialState;
interface UpdateFieldPayload {
  field: keyof ProfileState;
  value: ProfileState[keyof ProfileState];
}

const handleAxiosError = (
  error: unknown, 
  rejectWithValue: (value: string) => void, 
  defaultMessage: string
) => {
  const axiosError = error as AxiosError<{ message: string }>;
  return rejectWithValue(axiosError.response?.data.message as string || defaultMessage);
};


// Async Thunks
export const fetchUser = createAsyncThunk(
  "profile/fetchProfileDetails",
  async ({ userId }: { userId: ObjectId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user-details/${userId}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, rejectWithValue, "Failed to fetch user details");
    }
  }
);

export const changeProfilImg = createAsyncThunk(
  "profile/uploadImage",
  async ({ data, userId }: { data: FormData; userId: ObjectId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/profileImg/${userId}`, data);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, rejectWithValue, "Failed to change the profile picture");
    }
  }
);

export const changeEmail = createAsyncThunk(
  "profile/changeEmail",
  async ({ email, userId }: { email: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/changeEmail/${userId}`, { email });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, rejectWithValue, "Failed to change the email");
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (
    { currentPassword, newPassword, userId }: { currentPassword: string; newPassword: string; userId: ObjectId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/changePassword/${userId}`, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, rejectWithValue, "Failed to change the password");
    }
  }
);

export const updateProfileField = createAsyncThunk(
  "profile/updateField",
  async (
    { field, value, userId }: { field: string; value: string; userId: ObjectId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/user-profile/${field}/${userId}`, {  value });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, rejectWithValue, `Failed to update ${field}`);
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loading: (state) => {
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Details
      .addCase(fetchUser.fulfilled, (state, action) => {
        const { username, email, basedIn, fullName, phone, jobTitle } = action.payload.data;
        state.userName = username;
        state.email = email;
        state.basedIn = basedIn;
        state.fullName = fullName;
        state.phone = phone;
        state.jobTitle = jobTitle;
        state.error = false;
        state.errorMessage = "";
      })
      // Change Profile Image
      .addCase(changeProfilImg.fulfilled, (state, action) => {
        state.image = action.payload.data.image;
        state.error = false;
        state.errorMessage = "";
      })
      // Change Password
      .addCase(changePassword.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.error = false;
        state.errorMessage = "";
      })
      // Update Profile Fields
      .addCase(updateProfileField.fulfilled, (state, action) => {
        const { field, value } = action.meta.arg as UpdateFieldPayload;
      
        if (field in state) {
          state[field] = value as never;
          state.error = false;
          state.errorMessage = "";
        } else {
          console.error(`Invalid field: ${field}`);
        }
      });
  },
});

export const { loading } = profileSlice.actions;

export default profileSlice.reducer;
