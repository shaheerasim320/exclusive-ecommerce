import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";


export const saveCard = createAsyncThunk("card/saveCard", async ({ paymentMethodId }, { rejectWithValue }) => {
    try {
        const response = await api.post("/card/save-card", { paymentMethodId });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to save card");
    }
}
)

export const removeCard = createAsyncThunk("card/removeCard", async ({ paymentMethodId }, { rejectWithValue }) => {
    try {
        const response = await api.delete("/card/remove-card", { data: { paymentMethodId } });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to remove card");
    }
}
);


export const setDefaultCard = createAsyncThunk("card/setDefaultCard", async ({ paymentMethodId }, { rejectWithValue }) => {
    try {
        const response = await api.post("/card/set-default-card", { paymentMethodId });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to set default card");
    }
}
)

export const getDefaultCard = createAsyncThunk("card/getDefaultCard", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/card/get-default-card");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get default card");
    }
}
)

export const getSavedCards = createAsyncThunk("card/getSavedCard", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/card/get-saved-cards");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get saved cards");
    }
}
)

export const getCardByID = createAsyncThunk("card/getCardByID", async ({ cardID }, { rejectWithValue }) => {
    try {
        const response = await api.get(`/card/get-card-by-id/${cardID}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get requested card");
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
                (action) => isPending(saveCard, removeCard, setDefaultCard, getDefaultCard, getSavedCards, getCardByID)(action),
                (state) => {
                    state.error = null
                    state.loading = true
                }
            )
            .addMatcher(
                (action) => isFulfilled(saveCard, removeCard, setDefaultCard)(action),
                (state) => {
                    state.error = null
                    state.loading = false
                }
            )
            .addMatcher(
                (action) => isRejected(saveCard, removeCard, setDefaultCard, getDefaultCard, getSavedCards, getCardByID)(action),
                (state, action) => {
                    state.error = action.payload
                    state.loading = false
                }
            )
    }
})

export default cardSlice.reducer
