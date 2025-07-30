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

export const syncWishlist = createAsyncThunk("wishlist/sync", async (mergeOptions, { rejectWithValue }) => {
    try {
        const res = await api.post("/wishlist/merge-wishlist", { mergeOptions });
        return res.data.wishlist;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to sync wishlist");
    }
});

const initialState = {
  items: [],
  error: null,
  loading: false
};




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
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // -------- Fetch Wishlist --------
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // -------- Add to Wishlist --------
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // -------- Remove from Wishlist --------
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // -------- Sync Wishlist --------
      .addCase(syncWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(syncWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});


export default wishlistSlice.reducer;
