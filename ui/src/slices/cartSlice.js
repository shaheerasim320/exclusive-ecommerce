import api from "../api/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

export const removeFromCart = createAsyncThunk("cart/remove", async ({ cartItemId }, { rejectWithValue }) => {
    try {
        const res = await api.delete("/cart/remove", { data: { cartItemId } });
        return res.data.items;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete from wishlist");
    }
});

export const syncCart = createAsyncThunk("cart/sync", async (mergeOptions, { rejectWithValue }) => {
    try {
        const res = await api.post("/cart/merge-cart", { mergeOptions });
        return res.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to sync cart");
    }
});

export const updateProductQuantity = createAsyncThunk(
    "cart/updateProductQuantity", async ({ cartItemId, quantity }, { rejectWithValue }) => {
        try {
            const res = await api.post("/cart/update-product-quantity", { cartItemId, quantity });
            return res.data.items;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update product quantity");
        }
    }
);

export const getCartItemByProductID = createAsyncThunk(
    "cart/getCartItemByProductID",
    async ({ productID, quantity, color, size }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/cart/cartItem?productID=${productID}&quantity=${quantity}&color=${color}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to Fetch Cart Item");
        }
    }
);

export const applyCoupon = createAsyncThunk(
    "cart/applyCoupon",
    async ({ couponCode }, { rejectWithValue }) => {
        try {
            const response = await api.post("/cart/apply-coupon", { couponCode });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to apply coupon");
        }
    }
);

export const getAppliedCoupon = createAsyncThunk(
    "cart/getAppliedCoupon",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/cart/get-applied-coupon");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to check coupon applied status");
        }
    }
);

export const removeCoupon = createAsyncThunk(
    "cart/removeCoupon",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.delete("/cart/remove-coupon");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove coupon");
        }
    }
);

const calculateSubtotal = (cartItems) => {
    return cartItems.reduce((total, item) => {
        const itemPrice = item.product?.discount > 0 ? Math.round(calculateDiscountPrice(item.product?.price, item.product?.discount)) : item.product?.price;
        return total + itemPrice * item.quantity;
    }, 0);
};

const calculateCouponDiscountAmount = (coupon, subtotal) => {
    return !coupon ? 0 : coupon?.discountType == "fixed" ? coupon?.discountValue : (coupon.discountValue / 100) * subtotal;
};

const updateTotals = (state) => {
    const subtotal = calculateSubtotal(state.items);
    const couponDiscount = calculateCouponDiscountAmount(state.coupon, subtotal);
    const total = subtotal - couponDiscount;

    state.subtotal = subtotal;
    state.couponDiscount = couponDiscount;
    state.total = total;
};

const initialState = {
    items: [],
    error: null,
    loading: false,
    coupon: null,
    subtotal: 0,
    couponDiscount: 0,
    total: 0,
    cartItem: null
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                updateTotals(state);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload;
                updateTotals(state);
                state.loading = false;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload;
                updateTotals(state);
                state.loading = false;
            })
            .addCase(syncCart.fulfilled, (state, action) => {
                state.items = action.payload;
                localStorage.removeItem("guest_cart");
                updateTotals(state);
                state.loading = false;
            })
            .addCase(updateProductQuantity.fulfilled, (state, action) => {
                state.items = action.payload;
                updateTotals(state);
                state.loading = false;
            })
            .addCase(getCartItemByProductID.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItem = action.payload;
                state.error = null;
            })
            .addCase(getAppliedCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupon = action.payload;
                updateTotals(state);
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupon = action.payload;
                updateTotals(state);
            })
            .addCase(removeCoupon.fulfilled, (state) => {
                state.loading = false;
                state.coupon = null;
                updateTotals(state);
            })
            .addMatcher(
                (action) => [getAppliedCoupon.pending.type, applyCoupon.pending.type, getCartItemByProductID.pending.type, removeCoupon.pending.type].includes(action.type),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => [getAppliedCoupon.rejected.type, applyCoupon.rejected.type, getCartItemByProductID.rejected.type, removeCoupon.rejected.type].includes(action.type),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload || action.error.message;
                }
            );
    }
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
