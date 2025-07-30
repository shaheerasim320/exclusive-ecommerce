// App.jsx
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import AdminHeader from './components/AdminHeader';
import AdminRoute from './components/AdminRoute';

// Auth Pages
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import PasswordForm from './pages/PasswordForm';
import VerifyEmail from './pages/VerifyEmail';
import ResendLink from './pages/ResendLink';

// General Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import P404 from './pages/P404';

// Product Pages
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import AllProducts from './pages/AllProducts';

// E-commerce Features
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import BillingWrapper from './pages/BillingWrapper';
import OrderSuccessModal from './components/modals/OrderSuccessModal';
import MergeModal from './components/modals/MergeModal';

// Account Pages
import ManageMyAccount from './pages/ManageMyAccount';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AddressBook from './pages/AddressBook';
import EditAddress from './pages/AddressForm';
import PaymentOption from './pages/PaymentOption';
import Order from './pages/Order';
import OrderDetail from './pages/OrderDetail';
import Return from './pages/Return';
import Cancellation from './pages/Cancellation';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Category from './pages/admin/Category';
import CategoryForm from './pages/admin/CategoryForm';
import ProductForm from './pages/admin/ProductForm';
import Customers from './pages/admin/Customers';
import Reports from './pages/admin/Reports';
import FlashSale from './pages/admin/FlashSale';
import FlashSaleForm from './pages/admin/FlashSaleForm';
import OrderForm from './pages/admin/OrderForm';
import CustomerForm from './pages/admin/CustomerForm';

// Layouts
import AccountLayout from './layouts/AccountLayout';

// Redux Actions
import { getHirearcialDropDownCategories, getMainCategories, getSubCategories } from './slices/CategorySlice';
import { fetchAllProducts, fetchBestSellingProducts, fetchProducts } from './slices/productSlice';
import { fetchWishlist } from './slices/wishlistSlice';
import { fetchCart, getAppliedCoupon } from './slices/cartSlice';
import { refreshUser } from './slices/authSlice';
import { getDefaultBillingAddress, getDefaultShippingAddress, getSavedAddresses } from './slices/addressSlice';
import { getCancelledOrders, getPlacedOrders, getReturnedOrders } from './slices/orderSlice';
import { getDefaultCard, getSavedCards } from './slices/cardSlice';
import SearchResults from './pages/SearchResults';
import { fetchActiveFlashSales } from './slices/flashSaleSlice';

function App() {
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const LoadApp = async () => {
      try {
        dispatch(getMainCategories());
        dispatch(getSubCategories());
        dispatch(getHirearcialDropDownCategories());
        dispatch(fetchProducts());
        dispatch(fetchActiveFlashSales());
        dispatch(fetchBestSellingProducts());
        dispatch(fetchAllProducts());
        const res = await dispatch(refreshUser()).unwrap();
        dispatch(fetchWishlist());
        dispatch(fetchCart());
        dispatch(getAppliedCoupon())
        if (res.user) {
          dispatch(getSavedAddresses());
          dispatch(getDefaultShippingAddress());
          dispatch(getDefaultBillingAddress());
          dispatch(getPlacedOrders());
          dispatch(getReturnedOrders());
          dispatch(getCancelledOrders());
          dispatch(getSavedCards());
          dispatch(getDefaultCard());
        }

      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setInitializing(false);
      }
    };
    LoadApp();
  }, [dispatch]);

  if (initializing) {
    return <div className="flex justify-center h-screen"><Loader /></div>;
  }

  return (
    <GoogleOAuthProvider clientId="569261458803-fuq4p71omm3ma31uti79t1s90fv0akfj.apps.googleusercontent.com">
      {isAdminRoute ? (
        <>
          <AdminHeader />
          <main className="flex-grow">
            <Routes>
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
              <Route path="/admin/category" element={<AdminRoute><Category /></AdminRoute>} />
              <Route path="/admin/sub-category" element={<AdminRoute><Category /></AdminRoute>} />
              <Route path="/admin/customers" element={<AdminRoute><Customers /></AdminRoute>} />
              <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />
              <Route path="/admin/add-new-category" element={<AdminRoute><CategoryForm /></AdminRoute>} />
              <Route path="/admin/add-new-sub-category" element={<AdminRoute><CategoryForm /></AdminRoute>} />
              <Route path="/admin/category-form" element={<AdminRoute><CategoryForm /></AdminRoute>} />
              <Route path="/admin/product-form" element={<AdminRoute><ProductForm /></AdminRoute>} />
              <Route path="/admin/flash-sale" element={<AdminRoute><FlashSale /></AdminRoute>} />
              <Route path="/admin/flash-sale-form" element={<AdminRoute><FlashSaleForm /></AdminRoute>} />
              <Route path="/admin/customer-form" element={<AdminRoute><CustomerForm /></AdminRoute>} />
              <Route path="/admin/order-form" element={<AdminRoute><OrderForm /></AdminRoute>} />
            </Routes>
          </main>
        </>
      ) : (
        <>
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Account Layout */}
              <Route element={<AccountLayout />}>
                <Route path="/manage-my-account" element={<ManageMyAccount />} />
                <Route path="/my-profile" element={<Profile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/address-book" element={<AddressBook />} />
                <Route path="/address" element={<EditAddress />} />
                <Route path="/payment-options" element={<PaymentOption />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/returns" element={<Return />} />
                <Route path="/cancellation" element={<Cancellation />} />
              </Route>

              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/auth-callback" element={<AuthCallback />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/billing" element={<BillingWrapper />} />
              <Route path="/products/:slug/:productCode" element={<ProductDetail />} />
              <Route path="/order-detail" element={<OrderDetail />} />
              <Route path="/email/verify" element={<VerifyEmail />} />
              <Route path="/resend-link" element={<ResendLink />} />
              <Route path="/password-form" element={<PasswordForm />} />
              <Route path="/payment-complete" element={<OrderSuccessModal />} />
              <Route path="/merge-modal" element={<MergeModal />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/all-products" element={<AllProducts />} />
              <Route path="*" element={<P404 />} />
              <Route path="/search" element={<SearchResults />}/>
            </Routes>
          </main>
          <Footer />
        </>
      )}
      <ScrollToTop />
    </GoogleOAuthProvider>
  );
}

export default App;
