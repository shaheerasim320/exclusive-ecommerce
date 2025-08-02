import { createSlice, createAsyncThunk, isPending, isRejected, isFulfilled } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api/axiosInstance";

const initialState = {
    product: null,
    products: [],
    flashSaleProducts: [],
    bestSellingProducts: [],
    allProducts: [],
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/products");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products")
        }
    }
);


export const fetchAllProducts = createAsyncThunk(
    "products/fetchAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/products/get-all");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products")
        }
    }
);


export const fetchBestSellingProducts = createAsyncThunk(
    "products/fetchBestSellingProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/products/best-selling-products");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products")
        }
    }
);

export const fetchProductByID = createAsyncThunk(
    "products/fetchProductByID",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/${id}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch product")
        }
    }
)

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ productID, updatedData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/products/${productID}`, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update product data");
        }
    }
);

export const addProduct = createAsyncThunk(
    "products/addProduct",
    async ({ productData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/products/", productData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add product");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async ({ productID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.delete(`/products/${productID}`)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete product");
        }
    }
);



const productSlice = createSlice({
    name: "productSlice",
    initialState,
    extraReducers: (builder) => {

        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
                state.error = null
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.allProducts = action.payload;
                state.error = null
            })
            .addCase(fetchBestSellingProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.bestSellingProducts = action.payload;
                state.error = null
            })
            .addCase(fetchProductByID.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload
                state.error = null
            })
            .addMatcher(
                (action) => isPending(fetchProducts, fetchBestSellingProducts, fetchProductByID, fetchAllProducts, addProduct, updateProduct, deleteProduct)(action),
                (state) => {
                    state.loading = true
                    state.error = null
                }
            )
            .addMatcher(
                (action) => isRejected(fetchProducts, fetchBestSellingProducts, fetchProductByID, fetchAllProducts, addProduct, updateProduct, deleteProduct)(action),
                (state, action) => {
                    state.loading = false
                    state.error = action.payload
                }
            )
            .addMatcher(
                (action) => isFulfilled(addProduct, updateProduct, deleteProduct)(action),
                (state) => {
                    state.error = null
                    state.loading = false
                }
            )
    },
});

export default productSlice.reducer;
