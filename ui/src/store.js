import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './slices/timerSlice';
import productReducer from './slices/productSlice'
import userSlice from "./slices/userSlice"
import cartReducer from "./slices/cartSlice"
import wishlistReducer from "./slices/wishlistSlice"
import orderSlice from "./slices/orderSlice"
import cardSlice from "./slices/cardSlice"
import addressSlice from "./slices/addressSlice"
import categorySlice from "./slices/CategorySlice"
import imageSlice from "./slices/imageSlice"
import authSlice from "./slices/authSlice"
import flashSaleSlice from "./slices/flashSaleSlice"
import { injectStore } from './api/axiosInstance';


export const store = configureStore({
    reducer: {
        timer: timerReducer,
        products: productReducer,
        user: userSlice,
        cart: cartReducer,
        wishlist: wishlistReducer,
        order: orderSlice,
        card: cardSlice,
        address: addressSlice,
        category: categorySlice,
        image: imageSlice,
        auth: authSlice,
        flashSale:flashSaleSlice
    }
});

injectStore(store);
