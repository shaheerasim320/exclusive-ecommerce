import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import axios from "axios"
import api from "../api/axiosInstance";

export const saveAddress = createAsyncThunk("address/saveAddress", async ({ name, phoneNumber, address, city, province, country, defaultBillingAddress = false, defaultShippingAddress = false }, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.post("/address/save-address", { name, phoneNumber, address, city, province, country, defaultBillingAddress, defaultShippingAddress });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to save address");
    }
}
);

export const setDefaultBillingAddress = createAsyncThunk("address/setDefaultBillingAddress", async ({ addressId }, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.post("/address/set-default-billing-address", { addressId });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to set default billing address");
    }
}
)

export const setDefaultShippingAddress = createAsyncThunk("address/setDefaultShippingAddress", async ({ addressId }, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.post("/address/set-default-shipping-address", { addressId });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to set default shipping address");
    }
}
)

// export const removeCard = createAsyncThunk(
//     "card/removeCard",
//     async ({ paymentMethodId }, { rejectWithValue, dispatch }) => {
//         try {
//             const response = await axios.delete(
//                 "http://localhost:8080/api/v1/card/remove-card",
//                 { paymentMethodId },
//                 { withCredentials: true }
//             );
//             return response.data;
//         } catch (error) {
//             if (error.response?.status === 401) {
//                 try {
//                     await dispatch(refreshAccessToken()).unwrap();
//                     const retryResponse = await axios.delete(
//                         "http://localhost:8080/api/v1/card/remove-card",
//                         { paymentMethodId },
//                         { withCredentials: true }
//                     );
//                     return retryResponse.data;
//                 } catch (refreshError) {
//                     console.error("Token refresh failed:", refreshError);
//                     return rejectWithValue("Session expired. Please log in again.");
//                 }
//             }
//             return rejectWithValue(
//                 error.response?.data?.message || "Failed to remove card"
//             );
//         }
//     }
// )

// export const setDefaultCard = createAsyncThunk(
//     "card/setDefaultCard",
//     async ({ paymentMethodId }, { rejectWithValue, dispatch }) => {
//         try {
//             const response = await axios.post(
//                 "http://localhost:8080/api/v1/card/set-default-card",
//                 { paymentMethodId },
//                 { withCredentials: true }
//             );
//             return response.data;
//         } catch (error) {
//             if (error.response?.status === 401) {
//                 try {
//                     await dispatch(refreshAccessToken()).unwrap();
//                     const retryResponse = await axios.post(
//                         "http://localhost:8080/api/v1/card/set-default-card",
//                         { paymentMethodId },
//                         { withCredentials: true }
//                     );
//                     return retryResponse.data;
//                 } catch (refreshError) {
//                     console.error("Token refresh failed:", refreshError);
//                     return rejectWithValue("Session expired. Please log in again.");
//                 }
//             }
//             return rejectWithValue(
//                 error.response?.data?.message || "Failed to set default card"
//             );
//         }
//     }
// )

export const getDefaultShippingAddress = createAsyncThunk("address/getDefaultShippingAddress", async (_, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.get("/address/get-default-shipping-address");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get default shipping address");
    }
}
)

export const getDefaultBillingAddress = createAsyncThunk("address/getDefaultBillingAddress", async (_, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.get("/address/get-default-billing-address",);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get default billing address");
    }
}
)

export const getSavedAddresses = createAsyncThunk("address/getSavedAddresses", async (_, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.get("/address/get-user-addresses");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get saved addresses");
    }
}
)

export const getAddressByID = createAsyncThunk("address/getAddressByID", async ({ addressID }, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.get(`/address/get-address-by-id/${addressID}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get address by id");
    }
}
)

export const updateUserAddress = createAsyncThunk("address/updateUserAddress", async ({ addressId, updatedData }, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.put("/address/update-address", { addressId, updatedData },);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
}
)

const initialState = {
    loading: false,
    error: null,
    savedAddresses: null,
    defaultShippingAddress: null,
    defaultBillingAddress: null,
    address: null
}

const addressSlice = createSlice({
    name: "addressSlice",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getDefaultShippingAddress.fulfilled, (state, action) => {
                state.error = null
                state.defaultShippingAddress = action.payload
                state.loading = false
            })
            .addCase(getDefaultBillingAddress.fulfilled, (state, action) => {
                state.error = null
                state.defaultBillingAddress = action.payload
                state.loading = false
            })
            .addCase(getSavedAddresses.fulfilled, (state, action) => {
                state.error = null
                state.savedAddresses = action.payload.addresses
                state.loading = false
            })
            .addCase(getAddressByID.fulfilled, (state, action) => {
                state.error = null;
                state.address = action.payload;
                state.loading = false;
            })
            .addMatcher(
                (action) => isPending(getDefaultBillingAddress, getDefaultShippingAddress, setDefaultBillingAddress, setDefaultShippingAddress, getSavedAddresses, saveAddress, getAddressByID, updateUserAddress)(action),
                (state) => {
                    state.error = null
                    state.loading = true
                }
            )
            .addMatcher(
                (action) => isFulfilled(setDefaultBillingAddress, setDefaultShippingAddress, saveAddress, updateUserAddress)(action),
                (state) => {
                    state.error = null
                    state.loading = false
                }
            )
            .addMatcher(
                (action) => isRejected(getDefaultBillingAddress, getDefaultShippingAddress, setDefaultBillingAddress, setDefaultShippingAddress, getSavedAddresses, saveAddress, getAddressByID, updateUserAddress)(action),
                (state, action) => {
                    state.error = action.payload
                    state.loading = false
                }
            )
    }
})

export default addressSlice.reducer
