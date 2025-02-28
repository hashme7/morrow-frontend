import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios/Apis";
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
  isLoading: "",
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
  if (axiosError.response?.status == 404) {
    return rejectWithValue("request not found");
  } 
  if (axiosError.response?.status == 403) {
    return rejectWithValue(axiosError.response?.data.message);
  }
  return rejectWithValue(
    (axiosError.response?.data.message as string) || defaultMessage
  );
};

// Async Thunks
export const fetchUser = createAsyncThunk(
  "profile/fetchProfileDetails",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user/user-details`);
      return response.data;
    } catch (error) {
      return handleAxiosError(
        error,
        rejectWithValue,
        "Failed to fetch user details"
      );
    }
  }
);

export const changeProfilImg = createAsyncThunk(
  "profile/uploadImage",
  async (
    { data, userId }: { data: FormData; userId: ObjectId },
    { rejectWithValue }
  ) => {
    try {
      console.log(userId);
      const response = await axios.put(`/user/profileImg`, data);
      return response.data;
    } catch (error) {
      return handleAxiosError(
        error,
        rejectWithValue,
        "Failed to change the profile picture"
      );
    }
  }
);

export const changeEmail = createAsyncThunk(
  "profile/changeEmail",
  async (
    { email }: { email: string; },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/user/changeEmail`, { email });
      return response.data;
    } catch (error) {
      console.log(error,"error")
      return handleAxiosError(
        error,
        rejectWithValue,
        "Failed to change the email"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (
    {
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string;},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/user/changePassword`, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(
        error,
        rejectWithValue,
        "Failed to change the password"
      );
    }
  }
);

export const updateProfileField = createAsyncThunk(
  "profile/updateField",
  async (
    { field, value }: { field: string; value: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `/user/user-profile/${field == "userName" ? "username" : field}`,
        { value }
      );
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error on the update Profile field", error);
      return handleAxiosError(
        error,
        rejectWithValue,
        `Failed to update ${field}`
      );
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loading: (state) => {
      state.isLoading = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Details
      .addCase(fetchUser.fulfilled, (state, action) => {
        const { username, email, basedIn, fullName, phone, jobTitle } =
          action.payload.data;
        state.userName = username;
        state.email = email;
        state.basedIn = basedIn;
        state.fullName = fullName;
        state.phone = phone;
        state.jobTitle = jobTitle;
        state.error = false;
        state.errorMessage = "";
      })
      .addCase(changeProfilImg.fulfilled, (state, action) => {
        state.image = action.payload.data.image;
        state.error = false;
        state.errorMessage = "";
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = "secure"
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload as string;
        state.isLoading = "";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.error = false;
        state.errorMessage = "";
        state.isLoading = "";
      })
      .addCase(updateProfileField.fulfilled, (state, action) => {
        console.log("log from ", action.payload, action.meta.arg);
        const { field, value } = action.meta.arg as UpdateFieldPayload;
        state[field] = value as never;
        state.error = false;
        state.errorMessage = "";
        state.isLoading = "";
      })
      .addCase(updateProfileField.pending, (state, action) => {
        state.isLoading = action.meta.arg.field;
        console.log(state.isLoading, "loadin");
      })
      .addCase(updateProfileField.rejected, (state, action) => {
        console.log("from reject:", state, action);
        state.isLoading = "";
      });
  },
});

export const { loading } = profileSlice.actions;

export default profileSlice.reducer;
