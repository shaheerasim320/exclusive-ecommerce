import { createSlice, createAsyncThunk, isPending, isRejected, isFulfilled } from "@reduxjs/toolkit";
import axios from "axios";

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
            const response = await axios.get("http://localhost:8080/api/v1/products/products");
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
            const response = await axios.get("http://localhost:8080/api/v1/products/get-all-products", { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get("http://localhost:8080/api/v1/products/get-all-products", { withCredentials: true });
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to fetch all products");
        }
    }
);

export const fetchFlashSaleProducts = createAsyncThunk(
    "products/fetchFlashSaleProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/products/flash-sale-products");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch flash sale products")
        }
    }
);

export const fetchBestSellingProducts = createAsyncThunk(
    "products/fetchBestSellingProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/products/best-selling-products");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch best selling products")
        }
    }
);

export const fetchProductByID = createAsyncThunk(
    "products/fetchProductByID",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/products/products/${id}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch product")
        }
    }
)

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ productID, updatedData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/v1/products/product/${productID}`,
                updatedData,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.put(
                        `http://localhost:8080/api/v1/products/product/${productID}`,
                        updatedData,
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to update product data");
        }
    }
);

export const addProduct = createAsyncThunk(
    "products/addProduct",
    async ({ productData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/products/products",
                productData,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post(
                        "http://localhost:8080/api/v1/products/products",
                        productData,
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to add product");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async ({ productID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/products/products/${productID}`, { withCredentials: true })
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.delete(`http://localhost:8080/api/v1/products/products/${productID}`, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
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
            .addCase(fetchFlashSaleProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.flashSaleProducts = action.payload;
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
                (action) => isPending(fetchProducts, fetchBestSellingProducts, fetchFlashSaleProducts, fetchProductByID, fetchAllProducts, addProduct, updateProduct, deleteProduct)(action),
                (state) => {
                    state.loading = true
                    state.error = null
                }
            )
            .addMatcher(
                (action) => isRejected(fetchProducts, fetchBestSellingProducts, fetchFlashSaleProducts, fetchProductByID, fetchAllProducts, addProduct, updateProduct, deleteProduct)(action),
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
