import axios from "axios";
import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";


export const getPlacedOrders = createAsyncThunk("orders/getPlacedOrders", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/orders/get-placed-orders")
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to retrieve placed orders");
    }
}
)

export const getRecentOrders = createAsyncThunk("orders/getRecentOrders", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/orders/get-recent-orders")
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to retrieve recent orders");
    }
}
)

export const getOrderByID = createAsyncThunk(
    "orders/getOrderByID",
    async ({ orderID }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/orders/get-order-by-id/${orderID}`, { withCredentials: true })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to retrieve requested order");
        }
    }
)

export const getCancelledOrders = createAsyncThunk("orders/getCancelledOrders", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/orders/get-cancelled-orders")
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to retrieve cancelled orders");
    }
}
)

export const getReturnedOrders = createAsyncThunk("orders/getReturnedOrders", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/orders/get-returned-orders")
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to retrieve returned orders");
    }
}
)

export const cancelOrder = createAsyncThunk("orders/cancelOrder", async ({ orderID }, { rejectWithValue }) => {
    try {
        const response = await api.post("/orders/cancel-order", { orderID })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to cancel order");
    }
}
)
const initialState = {
    loading: false,
    error: null,
    orders: null,
    returns: null,
    cancellation: null,
    recentOrders: null,
    order: null
}

const orderSlice = createSlice({
    name: "orderSlice",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getPlacedOrders.fulfilled, (state, action) => {
                state.error = null
                state.orders = action.payload
                state.loading = false
            })
            .addCase(getRecentOrders.fulfilled, (state, action) => {
                state.error = null
                state.recentOrders = action.payload
                state.loading = false
            })
            .addCase(getOrderByID.fulfilled, (state, action) => {
                state.error = null
                state.order = action.payload
                state.loading = false
            })
            .addCase(getCancelledOrders.fulfilled, (state, action) => {
                state.error = null
                state.cancellation = action.payload
                state.loading = false
            })
            .addCase(getReturnedOrders.fulfilled, (state, action) => {
                state.error = null
                state.returns = action.payload
                state.loading = false
            })
            .addCase(cancelOrder.fulfilled, (state) => {
                state.error = null
                state.loading = false
            })
            .addMatcher(
                (action) => isPending(getPlacedOrders, getRecentOrders, getOrderByID, getCancelledOrders, getReturnedOrders, cancelOrder)(action),
                (state) => {
                    state.error = null
                    state.loading = true
                }
            )
            .addMatcher(
                (action) => isRejected(getPlacedOrders, getRecentOrders, getOrderByID, getCancelledOrders, getReturnedOrders, cancelOrder)(action),
                (state, action) => {
                    state.error = action.payload
                    state.loading = false
                }
            )
    }
})

export default orderSlice.reducer