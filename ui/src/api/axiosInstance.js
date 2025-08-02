import axios from "axios";
import { logout, refreshAccessToken } from "../slices/authSlice";

let store;

export const injectStore = (_store) => {
    store = _store;
};

const api = axios.create({
    baseURL: "http://127.0.0.1:5001/exclusive-ecommerce-backend/us-central1/api/v1",
    withCredentials: true,
});

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


api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 403 &&
            !originalRequest._retry &&
            error.config.url !== "/users/refresh-access-token"
        ) {
            originalRequest._retry = true;
            try {
                const { accessToken } = await store.dispatch(refreshAccessToken()).unwrap();
                store.dispatch();
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