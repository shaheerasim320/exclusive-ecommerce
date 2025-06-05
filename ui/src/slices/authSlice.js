import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials,{rejectWithValue}) => {
    try {
        const res = await api.post("/users/login", credentials);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to login user");
    }
})

export const refreshAccessToken = createAsyncThunk("auth/refreshAccessToken", async (_,{rejectWithValue}) => {
    try {
        const res = await api.post("/users/refresh-access-token");
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to refresh access token");
    }
})

export const getUserProfile = createAsyncThunk("auth/getUserProfile", async (_,{rejectWithValue}) => {
    try {
        const res = await api.get("/users/refresh-user");
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to refresh user");
    }
});

export const logout = createAsyncThunk("auth/logout", async (_,{rejectWithValue}) => {
    try {
        const res = await api.get("/users/logout");
    return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to logout user");
    }
    const res = await api.get("/users/logout");
    return res.data;
})

const initialState = {
    user: null,
    accessToken: null,
    status: "idle",
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
            })
    }
})

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;