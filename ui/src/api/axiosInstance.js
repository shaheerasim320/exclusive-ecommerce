import axios from "axios";
import { logout, refreshAccessToken } from "../slices/authSlice";

let store;

export const injectStore = (_store) => {
    store = _store;
};

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
});

// Add token to request headers
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 403 &&
            !originalRequest._retry &&
            originalRequest.url !== "/users/refresh-access-token"
        ) {
            originalRequest._retry = true;

            try {
                const { accessToken } = await store.dispatch(refreshAccessToken()).unwrap();

                // Update token in Redux store (already done in the slice if refreshAccessToken is correct)
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
