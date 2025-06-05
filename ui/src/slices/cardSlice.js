import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import axios from "axios"

export const createSetupIntent = createAsyncThunk(
    "card/createSetupIntent",
    async ({ name }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/card/create-setup-intent",
                { name },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post(
                        "http://localhost:8080/api/v1/card/create-setup-intent",
                        { name },
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to create setup intent"
            );
        }
    }
);

export const saveCard = createAsyncThunk(
    "card/saveCard",
    async ({ paymentMethodId }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/card/save-card",
                { paymentMethodId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post(
                        "http://localhost:8080/api/v1/card/save-card",
                        { paymentMethodId },
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to save card"
            );
        }
    }
)

export const removeCard = createAsyncThunk(
    "card/removeCard",
    async ({ paymentMethodId }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.delete(
                "http://localhost:8080/api/v1/card/remove-card",
                {
                    data: { paymentMethodId },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.delete(
                        "http://localhost:8080/api/v1/card/remove-card",
                        {
                            data: { paymentMethodId },
                            withCredentials: true,
                        }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove card"
            );
        }
    }
);


export const setDefaultCard = createAsyncThunk(
    "card/setDefaultCard",
    async ({ paymentMethodId }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/card/set-default-card",
                { paymentMethodId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.post(
                        "http://localhost:8080/api/v1/card/set-default-card",
                        { paymentMethodId },
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to set default card"
            );
        }
    }
)

export const getDefaultCard = createAsyncThunk(
    "card/getDefaultCard",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/v1/card/get-default-card",
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get(
                        "http://localhost:8080/api/v1/card/get-default-card",
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to get default card"
            );
        }
    }
)

export const getSavedCards = createAsyncThunk(
    "card/getSavedCard",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/v1/card/get-saved-cards",
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get(
                        "http://localhost:8080/api/v1/card/get-saved-cards",
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to get saved cards"
            );
        }
    }
)

export const getCardByID = createAsyncThunk(
    "card/getCardByID",
    async ({ cardID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/v1/card/get-card-by-id/${cardID}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await dispatch(refreshAccessToken()).unwrap();
                    const retryResponse = await axios.get(
                        `http://localhost:8080/api/v1/card/get-card-by-id/${cardID}`,
                        { withCredentials: true }
                    );
                    return retryResponse.data;
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    return rejectWithValue("Session expired. Please log in again.");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to get requested card"
            );
        }
    }
)

const initialState = {
    loading: false,
    error: null,
    defaultCard: null,
    savedCards: null,
    card: null
}

const cardSlice = createSlice({
    name: "cardSlice",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getDefaultCard.fulfilled, (state, action) => {
                state.error = null
                state.defaultCard = action.payload
                state.loading = false
            })
            .addCase(getSavedCards.fulfilled, (state, action) => {
                state.error = null
                state.savedCards = action.payload
                state.loading = false
            })
            .addCase(getCardByID.fulfilled, (state, action) => {
                state.error = null
                state.card = action.payload
                state.loading = false
            })
            .addMatcher(
                (action) => isPending(createSetupIntent, saveCard, removeCard, setDefaultCard, getDefaultCard, getSavedCards, getCardByID)(action),
                (state) => {
                    state.error = null
                    state.loading = true
                }
            )
            .addMatcher(
                (action) => isFulfilled(createSetupIntent, saveCard, removeCard, setDefaultCard)(action),
                (state) => {
                    state.error = null
                    state.loading = false
                }
            )
            .addMatcher(
                (action) => isRejected(createSetupIntent, saveCard, removeCard, setDefaultCard, getDefaultCard, getSavedCards, getCardByID)(action),
                (state, action) => {
                    state.error = action.payload
                    state.loading = false
                }
            )
    }
})

export default cardSlice.reducer
