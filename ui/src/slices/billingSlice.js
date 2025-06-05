import axios from "axios";
import { createAsyncThunk, isFulfilled, isPending, isRejected, createSlice } from "@reduxjs/toolkit";

export const createBillingRecord = createAsyncThunk(
    "billing/createBillingRecord",
    async ({ items, couponID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/billing/create-billing-record", { items, couponID }, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/billing/create-billing-record", { items, couponID }, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to create a billing record");
        }
    }
)

export const fetchBillingDetailsByID = createAsyncThunk(
    "billing/fetchBillingDetailsByID",
    async ({ billingID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/billing/fetchBillingDetailsByID/${billingID}`, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get(`http://localhost:8080/api/v1/billing/fetchBillingDetailsByID/${billingID}`, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to create a billing record");
        }
    }
)

export const applyCoupon = createAsyncThunk(
    "billing/applyCoupon",
    async ({ billingID, couponCode }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/billing/apply-coupon", { billingID, couponCode }, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/billing/apply-coupon", { billingID, couponCode }, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to apply coupon");
        }
    }
)

export const getAppliedCoupon = createAsyncThunk(
    "billing/getAppliedCoupon",
    async ({ billingID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/billing/get-applied-coupon/${billingID}`, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get(`http://localhost:8080/api/v1/billing/get-applied-coupon/${billingID}`, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to get applied coupon");
        }
    }
)

export const deleteBillingRecordByID = createAsyncThunk(
    "billing/deleteBillingRecordByID",
    async ({ billingID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/billing/delete-billing-by-id/${billingID}`, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.delete(`http://localhost:8080/api/v1/billing/delete-billing-by-id/${billingID}`, { withCredentials: true })
                    console.log("successfull in deletiing from slice after refreshing token")
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to get applied coupon");
        }
    }
)

const initialState = {
    loading: false,
    error: null,
    billingItem: null,
    coupon: null
}

const billingSlice = createSlice({
    name: "billingSlice",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchBillingDetailsByID.fulfilled, (state, action) => {
                state.billingItem = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(getAppliedCoupon.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.coupon = action.payload
            })
            .addMatcher(
                (action) => isPending(createBillingRecord,  fetchBillingDetailsByID, applyCoupon, getAppliedCoupon, deleteBillingRecordByID)(action),
                (state) => {
                    state.loading = true
                    state.error = null
                }
            )
            .addMatcher(
                (action) => isRejected(createBillingRecord,  fetchBillingDetailsByID, applyCoupon, getAppliedCoupon, deleteBillingRecordByID)(action),
                (state, action) => {
                    state.loading = false
                    state.error = action.payload
                }
            )
            .addMatcher(
                (action) => isFulfilled(createBillingRecord,  applyCoupon, deleteBillingRecordByID)(action),
                (state) => {
                    state.loading = false
                    state.error = null
                }
            )
    }
})

export default billingSlice.reducer