import api from "../api/axiosInstance";
import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/wishlist/get-wishlist-items");
        return res.data.items;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist items");
    }
})

export const addToWishlist = createAsyncThunk("wishlist/add", async ({ product }, { rejectWithValue }) => {
    try {
        const res = await api.post("/wishlist/add", { product });
        return res.data.items;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
})

export const removeFromWishlist = createAsyncThunk("wishlist/remove", async ({ wishlistItemId }, { rejectWithValue }) => {
    try {
        const res = await api.delete("/wishlist/remove", { data: { wishlistItemId } });
        return res.data.items;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete from wishlist");
    }
})

export const syncWishlist = createAsyncThunk("wishlist/sync", async (_, { getState, rejectWithValue }) => {
    try {
        const guestItems = getState().wishlist.items;
        const res = await api.post("/wishlist/merge", { guestItems });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to sync wishlist");
    }
})

const initialState = {
    items: [],
    error: null,
    status: "idle"
}


export const moveAllItemsToCart = createAsyncThunk(
    "wishlist/moveAllItemsToCart",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/wishlist/move-all-items-to-cart", {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    // await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/wishlist/move-all-items-to-cart", {}, { withCredentials: true });
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to move all items to cart");
        }
    }
);


export const addToCart = createAsyncThunk(
    "wishlist/addToCart",
    async ({ itemID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/wishlist/add-to-cart", { itemID }, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    // await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/wishlist/add-to-cart", { itemID }, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to move all items to cart");
        }
    }
)

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.items = action.payload;
            })

            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.items = action.payload;
            })

            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = "succedded";
            })

            .addCase(syncWishlist.fulfilled, (state, action) => {
                state.status = "succedded";
                state.items = action.payload;
            })
            .addMatcher(
                (action) => isPending(fetchWishlist, addToWishlist, removeFromWishlist, syncWishlist, moveAllItemsToCart,)(action),
                (state) => {
                    state.status = "loading";
                }
            )

            .addMatcher(
                (action) => isRejected(fetchWishlist, addToWishlist, removeFromWishlist, syncWishlist, moveAllItemsToCart,)(action),
                (state, action) => {
                    state.status = "failed";
                    state.error = action.payload || action.error.message;
                }
            )

            .addMatcher(
                (action) => isFulfilled(removeFromWishlist, moveAllItemsToCart)(action),
                (state) => {
                    state.loading = false;
                    state.error = null;
                }
            );
    }
});

export default wishlistSlice.reducer;
