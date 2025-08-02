import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const fetchActiveFlashSale = createAsyncThunk(
    "flashSale/fetchActiveFlashSale",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/flashSale/active");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch active flash sales")
        }
    }
)

const initialState = {
    flashSale: null,
    error: null
}
const flashSaleSlice = createSlice({
    name: 'flashSale',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveFlashSale.fulfilled, (state, action) => {
                state.flashSale=action.payload;
                state.error = null;
            })
            .addCase(fetchActiveFlashSale.rejected, (state,action) => {
                state.error = action.payload;
            })
    }
})

export default flashSaleSlice.reducer;
