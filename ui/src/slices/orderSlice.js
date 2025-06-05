import axios from "axios";
import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";

export const createOrder = createAsyncThunk(
    "orders/createOrder",
    async ({ orderId, products, coupon, paymentMethod, transactionId, shippingAddress }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/orders/place-order",
                { orderId, products, coupon, paymentMethod, transactionId, shippingAddress },
                { withCredentials: true }
            )
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post(
                        "http://localhost:8080/api/v1/orders/place-order",
                        { orderId, products, coupon, paymentMethod, transactionId, shippingAddress },
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to create order"
            );
        }
    }
)

export const getPlacedOrders = createAsyncThunk(
    "orders/getPlacedOrders",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/orders/get-placed-orders", { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get("http://localhost:8080/api/v1/orders/get-placed-orders", { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to retrieve placed orders"
            );
        }
    }
)

export const getRecentOrders = createAsyncThunk(
    "orders/getRecentOrders",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/orders/get-recent-orders", { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get("http://localhost:8080/api/v1/orders/get-recent-orders", { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to retrieve recent orders"
            );
        }
    }
)

export const getOrderByID = createAsyncThunk(
    "orders/getOrderByID",
    async ({ orderID }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/orders/get-order-by-id/${orderID}`, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get(`http://localhost:8080/api/v1/orders/get-order-by-id/${orderID}`, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to retrieve requested order"
            );
        }
    }
)

export const getCancelledOrders = createAsyncThunk(
    "orders/getCancelledOrders",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/orders/get-cancelled-orders", { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get("http://localhost:8080/api/v1/orders/get-cancelled-orders", { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to retrieve cancelled orders"
            );
        }
    }
)

export const getReturnedOrders = createAsyncThunk(
    "orders/getReturnedOrders",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/orders/get-returned-orders", { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get("http://localhost:8080/api/v1/orders/get-returned-orders", { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to retrieve returned orders"
            );
        }
    }
)

export const cancelOrder = createAsyncThunk(
    "orders/cancelOrder",
    async ({ orderID }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/orders/cancel-order", { orderID }, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/orders/cancel-order", { orderID }, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to cancel order"
            );
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
            .addCase(createOrder.fulfilled, (state) => {
                state.error = null
                state.loading = false
            })
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
                (action) => isPending(createOrder, getPlacedOrders, getRecentOrders, getOrderByID, getCancelledOrders, getReturnedOrders, cancelOrder)(action),
                (state) => {
                    state.error = null
                    state.loading = true
                }
            )
            .addMatcher(
                (action) => isRejected(createOrder, getPlacedOrders, getRecentOrders, getOrderByID, getCancelledOrders, getReturnedOrders, cancelOrder)(action),
                (state, action) => {
                    state.error = action.payload
                    state.loading = false
                }
            )
    }
})

export default orderSlice.reducer