import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post("/users/login", credentials);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to login user");
  }
});


export const refreshAccessToken = createAsyncThunk("auth/refreshAccessToken", async (_, { rejectWithValue }) => {
  try {
    const res = await api.post("/users/refresh-access-token");
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to refresh access token");
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const res = await api.post("/users/logout");
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to logout user");
  }
});

export const refreshUser = createAsyncThunk("auth/refreshUser", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/users/refresh-user");
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to refresh access token");
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile",async (userData, { rejectWithValue, getState }) => {
  try {
      const res = await api.put("/users/update-profile", userData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);


const initialState = {
  user: null,
  accessToken: null,
  error: null,
  loading: false
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
      })

      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(refreshUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setAccessToken, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
