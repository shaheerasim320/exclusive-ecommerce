import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import axios from "axios";

export const processPayment = createAsyncThunk(
    "payment/processPayment",
    async ({ amount, currency, paymentMethodId }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/payment/process-payment",
                { amount, currency, paymentMethodId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post(
                        "http://localhost:8080/api/v1/payment/process-payment",
                        { amount, currency, paymentMethodId },
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to create payment intent"
            );
        }
    }
);


const initialState = {
    loading: false,
    error: null,
};

const paymentSlice = createSlice({
    name: "paymentSlice",
    initialState,
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => isPending(processPayment)(action),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => isFulfilled(processPayment)(action),
                (state) => {
                    state.error = null
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => isRejected(processPayment)(action),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )
    },
});

export default paymentSlice.reducer;
