import { createAsyncThunk, createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import axios from "axios";

export const uploadImage = createAsyncThunk(
    "image/uploadImage",
    async ({ file }, { dispatch, rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const response = await axios.post("http://localhost:8080/api/v1/image/upload", formData, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    const retryFormData = new FormData();
                    retryFormData.append("image", file);
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/image/upload", retryFormData, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to upload image");
        }
    }
)

export const deleteImage = createAsyncThunk(
    "image/deleteImage",
    async ({ publicId }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/image/delete", { publicId }, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/image/delete", { publicId }, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to upload image");
        }
    }
)

const initialState = {
    loading: false,
    error: null,
    imageUrl: null
}

const imageSlice = createSlice({
    name: "imageSlice",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.error = null
                state.imageUrl = action.payload.imageUrl
                state.loading = false
            })
            .addMatcher(
                (action) => isPending(uploadImage, deleteImage)(action),
                (state) => {
                    state.error = null
                    state.loading = true
                }
            )
            .addMatcher(
                (action) => isRejected(uploadImage, deleteImage)(action),
                (state, action) => {
                    state.error = action.payload
                    state.loading = false
                }
            )
    }
})

export default imageSlice.reducer