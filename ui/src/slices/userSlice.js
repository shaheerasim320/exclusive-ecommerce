import axios from "axios";
import { createSlice, createAsyncThunk, isPending, isRejected, isFulfilled } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
    error: null,
    sucess: false,
    delayedAction: null,
};

export const registerUser = createAsyncThunk(
    "users/registerUser",
    async ({ fullName, email, password, phoneNumber, gender }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/users/users", {
                fullName,
                email,
                password,
                phoneNumber,
                gender
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to register user");
        }

    }
);

export const verifyUser = createAsyncThunk(
    "users/verifyUser",
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/v1/users/verify/${token}`, {});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Falied to verify user")
        }

    }
);

export const resendToken = createAsyncThunk(
    "users/resendToken",
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/users/resend-token", { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Falied to resend email")
        }

    }
);


export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async ({ fullName, phoneNumber, gender, currentPassword = "", newPassword = "", confirmPassword = "" }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/users/update-profile", { fullName, phoneNumber, gender, currentPassword, newPassword, confirmPassword }, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/users/update-profile", { fullName, phoneNumber, gender, currentPassword, newPassword, confirmPassword }, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to update user profile");
        }
    }
)


const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null
        },
        setDelayedAction: (state, action) => {
            state.delayedAction = action.payload
        },
        clearDelayedAction: (state) => {
            state.delayedAction = null
        },
        resetSucess: (state) => {
            state.sucess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.error = null;
                state.loading = false;
            })
            .addMatcher(
                (action) => isPending(registerUser, verifyUser, resendToken, updateProfile)(action),
                (state) => {
                    state.sucess = false
                    state.loading = true
                    state.error = null
                }
            )
            .addMatcher(
                (action) => isFulfilled(registerUser, verifyUser, resendToken)(action),
                (state) => {
                    state.loading = false
                    state.error = null
                    state.sucess = true
                }
            )
            .addMatcher(
                (action) => isRejected(registerUser, verifyUser, resendToken, updateProfile)(action),
                (state, action) => {
                    state.sucess = false
                    state.error = action.payload;
                    state.loading = false;
                }
            )
    },
});
export const { resetError, setDelayedAction, clearDelayedAction, resetSucess } = userSlice.actions;
export default userSlice.reducer;
