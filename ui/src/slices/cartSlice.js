import api from "../api/axiosInstance";
import { createSlice, createAsyncThunk, isPending, isRejected, isFulfilled } from "@reduxjs/toolkit";
import { calculateDiscountPrice } from "../functions/DiscountPriceCalculator";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/cart/get-cart-items");
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist items");
    }
});

export const addToCart = createAsyncThunk("cart/add", async ({ product, quantity, color, size }, { rejectWithValue }) => {
    try {
        const item = { product, quantity, color, size };
        const res = await api.post("/cart/add", item);
        return res.data.items;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
});

export const removeFromCart = createAsyncThunk("cart/remove", async ({ cartItemId }, { getState }) => {
    try {
        const res = await api.delete("/cart/remove", { data: { cartItemId } });
        return res.data.items;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete from wishlist");
    }
});

export const syncCart = createAsyncThunk("cart/sync", async (_, { getState }) => {
    const guestItems = getState().cart.items;
    const res = await api.post("/cart/merge", { guestItems });
    return res.data.items;
})


export const updateProductQuantity = createAsyncThunk(
    "cart/updateProductQuantity", async ({ cartItemId, quantity }, { rejectWithValue }) => {
        try {
            const res = await api.post("/cart/update-product-quantity", { cartItemId, quantity });
            return res.data.items;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete from wishlist");
        }
    }
);



export const getCartItemByProductID = createAsyncThunk(
    "cart/getCartItemByProductID",
    async ({ productID, quantity, color, size }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/cart/cartItem?productID=${productID}&quantity=${quantity}&color=${color}&size=${size}`, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    // await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get(`http://localhost:8080/api/v1/cart/cartItem?productID=${productID}&quantity=${quantity}&color=${color}&size=${size}`, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to Fetch Cart Item");
        }
    }
)

export const applyCoupon = createAsyncThunk(
    "cart/applyCoupon",
    async ({ couponCode }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/cart/apply-coupon", { couponCode }, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    // await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/cart/apply-coupon", { couponCode }, { withCredentials: true })
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
    "cart/getAppliedCoupon",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/cart/get-applied-coupon", { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    // await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get("http://localhost:8080/api/v1/cart/get-applied-coupon", { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to check coupon applied status");
        }
    }
)

export const removeCoupon = createAsyncThunk(
    "cart/removeCart",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.delete("http://localhost:8080/api/v1/cart/remove-coupon", { withCredentials: true });
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    // await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.delete("http://localhost:8080/api/v1/cart/remove-coupon", { withCredentials: true });
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to remove coupon");
        }
    }
)

const calculateSubtotal = (cartItems) => {
    return cartItems.reduce((total, item) => {
        const itemPrice = item.product?.discount > 0 ? Math.round(calculateDiscountPrice(item.product?.price, item.product?.discount)) : item.product?.price;
        return total + itemPrice * item.quantity;
    }, 0);
};


const calculateCouponDiscountAmount = (coupon, subtotal) => {
    return !coupon ? 0 : coupon?.discountType == "fixed" ? coupon?.discountValue : (coupon.discountValue / 100) * subtotal;
}

const updateTotals = (state) => {
    const subtotal = calculateSubtotal(state.items);
    const couponDiscount = calculateCouponDiscountAmount(state.coupon, subtotal);
    const total = subtotal - couponDiscount;

    state.subtotal = subtotal;
    state.couponDiscount = couponDiscount;
    state.total = total;
}


const initialState = {
    items: [],
    error: null,
    status: "idle",
    loading: false,
    coupon: null,
    subtotal: 0,
    couponDiscount: 0,
    total: 0
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload;
                updateTotals(state);
                state.status = "succeeded"
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload;
                updateTotals(state);
                state.status = "succeeded"
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload;
                updateTotals(state);
                state.status = "succedded";
            })
            .addCase(syncCart.fulfilled, (state, action) => {
                state.items = action.payload;
                localStorage.removeItem("guest_cart");
            })
            .addCase(updateProductQuantity.fulfilled, (state, action) => {
                state.items = action.payload;
                updateTotals(state);
                state.status = "succedded";
            })

            .addCase(getCartItemByProductID.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.cartItem = action.payload;
            })
            .addCase(getAppliedCoupon.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.coupon = action.payload
            })

            .addMatcher(
                (action) => isPending(getAppliedCoupon, applyCoupon, getCartItemByProductID, removeCoupon)(action),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addMatcher(
                (action) => isRejected(getAppliedCoupon, applyCoupon, getCartItemByProductID, removeCoupon)(action),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )

            .addMatcher(
                (action) => isFulfilled(applyCoupon, removeCoupon)(action),
                (state) => {
                    state.loading = false;
                    state.error = null;
                }
            )

    },
});

export default cartSlice.reducer;