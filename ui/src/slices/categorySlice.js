import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import axios from "axios"

export const addCategory = createAsyncThunk(
    "category/addCategory",
    async ({ name, parentCategory = null, slug, description = "", icon }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/category/add-category", { name, parentCategory, slug, description, icon }, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/category/add-category", { name, parentCategory, slug, description, icon }, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to add a category");
        }
    }
)

export const getDropDownMainCategories = createAsyncThunk(
    "category/getDropDownMainCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/category/get-drop-down-main-categories", { withCredentials: true })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch drop down main categories");
        }
    }
)

export const getMainCategories = createAsyncThunk(
    "category/getMainCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/category/get-main-categories", { withCredentials: true })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch main categories");
        }
    }
)

export const getSubCategories = createAsyncThunk(
    "category/getSubCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/category/get-sub-categories", { withCredentials: true })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch sub categories");
        }
    }
)

export const getCategoryByID = createAsyncThunk(
    "category/getCategoryByID",
    async ({ categoryID }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/category/get-category-by-id/${categoryID}`, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get(`http://localhost:8080/api/v1/category/get-category-by-id/categoryID:${categoryID}`, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to fetch requested category");
        }
    }
)

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async ({ categoryID, name, parentCategory = null, slug, description = "", icon }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/category/update-category", { categoryID, name, parentCategory, slug, description, icon }, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post("http://localhost:8080/api/v1/category/update-category", { categoryID, name, parentCategory, slug, description, icon }, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to update requested category");
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async ({ categoryID }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/category/delete-category/${categoryID}`, { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.delete(`http://localhost:8080/api/v1/category/delete-category/${categoryID}`, { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to delete requested category");
        }
    }
)

export const getHirearcialDropDownCategories = createAsyncThunk(
    "categories/getHirearcialDropDownCategories",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/category/get-hirearcial-dropdown-categories", { withCredentials: true })
            return response.data
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get("http://localhost:8080/api/v1/category/get-hirearcial-dropdown-categories", { withCredentials: true })
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(error.response?.data?.message || "Failed to get product form drop down categories");
        }
    }
)

const initialState = {
    dropDownMainCategories: null,
    mainCategories: null,
    subCategories: null,
    loading: false,
    error: null,
    categoryDetail: null,
    mainCategories: null,
    hirearcialDropDownCategories: null,
}

const categorySlice = createSlice({
    name: "categorySlice",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getMainCategories.fulfilled, (state, action) => {
                state.mainCategories = action.payload
                state.error = null
                state.loading = false
            })
            .addCase(getDropDownMainCategories.fulfilled, (state, action) => {
                state.dropDownMainCategories = action.payload
                state.error = null
                state.loading = false
            })
            .addCase(getCategoryByID.fulfilled, (state, action) => {
                state.categoryDetail = action.payload
                state.error = false
                state.loading = false;
            })
            .addCase(getSubCategories.fulfilled, (state, action) => {
                state.subCategories = action.payload
                state.error = false
                state.loading = false;
            })
            .addCase(getHirearcialDropDownCategories.fulfilled, (state, action) => {
                state.hirearcialDropDownCategories = action.payload
                state.error = false
                state.loading = false;
            })
            .addMatcher(
                (action) => isPending(addCategory, getDropDownMainCategories, getMainCategories, getCategoryByID, updateCategory, getSubCategories, deleteCategory, getHirearcialDropDownCategories)(action),
                (state) => {
                    state.error = null
                    state.loading = true
                }
            )
            .addMatcher(
                (action) => isFulfilled(addCategory, updateCategory, deleteCategory)(action),
                (state) => {
                    state.error = null
                    state.loading = false
                }
            )
            .addMatcher(
                (action) => isRejected(addCategory, getDropDownMainCategories, getMainCategories, getCategoryByID, updateCategory, getSubCategories, deleteCategory, getHirearcialDropDownCategories)(action),
                (state, action) => {
                    state.error = action.payload
                    state.loading = false
                }
            )
    }
})

export default categorySlice.reducer