import axios from "axios";
import { logout, refreshAccessToken } from "../slices/authSlice";

let store;

export const injectStore = (_store) => {
    store = _store;
};

const api = axios.create({
    baseURL: "https://exclusive-ecommerce-backend.vercel.app/api/v1",
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
