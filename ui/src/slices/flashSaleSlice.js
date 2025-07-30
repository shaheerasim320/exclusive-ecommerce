import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const fetchActiveFlashSales = createAsyncThunk(
    "flashSale/fetchActiveFlashSales",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/flashSale/get-active-flash-sale");
            return response.data.flashSales;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch active flash sales")
        }
    }
)

const initialState = {
    flashSales: null,
    error: null
}
const flashSaleSlice = createSlice({
    name: 'flashSales',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveFlashSales.fulfilled, (state, action) => {
                state.flashSales=action.payload;
                state.error = null;
            })
            .addCase(fetchActiveFlashSales.rejected, (state,action) => {
                state.error = action.payload;
            })
    }
})

export default flashSaleSlice.reducer;
