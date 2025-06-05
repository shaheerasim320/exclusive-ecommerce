import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from './components/Footer';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import Contact from './pages/Contact';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import P404 from './pages/P404';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import BillingWrapper from './pages/BillingWrapper';
import ManageMyAccount from './pages/ManageMyAccount';
import ProductDetail from './pages/ProductDetail';
import Order from './pages/Order';
import OrderDetail from './pages/OrderDetail';
import Return from './pages/Return';
import Cancellation from './pages/Cancellation';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AddressBook from './pages/AddressBook';
import EditAddress from './pages/AddressForm';
import PaymentOption from './pages/PaymentOption';
import ScrollToTop from './components/ScrollToTop';
import VerifyEmail from './pages/VerifyEmail';
import { useEffect, useState } from 'react';
import Loader from './components/Loader';
// import { getAppliedCoupon, getCartItems } from './slices/cartSlice';
// import { getWishlistItems } from './slices/wishlistSlice';
import OrderSuccessModal from './components/modals/OrderSuccessModal';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Category from './pages/admin/Category';
import Customers from './pages/admin/Customers';
import Reports from './pages/admin/Reports';
import CategoryForm from './pages/admin/CategoryForm';
import ProductForm from './pages/admin/ProductForm';
import FlashSale from './pages/admin/FlashSale';
import CategoryPage from './pages/CategoryPage';
import AllProducts from './pages/AllProducts';
import FlashSaleForm from './pages/admin/FlashSaleForm';
import OrderForm from './pages/admin/OrderForm';
import CustomerForm from './pages/admin/CustomerForm';
import PasswordForm from './pages/PasswordForm';
import ResendLink from './pages/ResendLink';
import { getUserProfile } from './slices/authSlice';
import { getHirearcialDropDownCategories, getMainCategories, getSubCategories } from './slices/CategorySlice';
import { fetchAllProducts, fetchBestSellingProducts, fetchFlashSaleProducts, fetchProducts } from './slices/productSlice';
import { fetchWishlist } from './slices/wishlistSlice';
import { fetchCart } from './slices/cartSlice';
import AddToCartModal from './components/modals/AddToCartModal';

function App() {
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const location = useLocation();

  useEffect(() => {
    const LoadApp = async () => {
      try {
        dispatch(getMainCategories())
        dispatch(getSubCategories())
        dispatch(getHirearcialDropDownCategories())
        dispatch(fetchProducts());
        dispatch(fetchFlashSaleProducts());
        dispatch(fetchBestSellingProducts());
        dispatch(fetchAllProducts());
        dispatch(fetchWishlist());
        dispatch(fetchCart())
        const { payload } = dispatch(getUserProfile()).unwrap();
        if (payload?.user) {
          await Promise.all([

            // dispatch(getCartItems()),
            // dispatch(getWishlistItems()).
            // dispatch(getAppliedCoupon())

          ])

        }
      } catch (error) {
      } finally {
        setInitializing(false);
      }
    };
    LoadApp();
  }, [dispatch]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (initializing) {
    return <div className="flex justify-center h-screen"><Loader /></div>;
  }

  return (
    <>
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
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/billing" element={<BillingWrapper />} />
              <Route path="/manage-my-account" element={<ManageMyAccount />} />
              <Route path="/products/:slug/:productCode" element={<ProductDetail />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/order-detail" element={<OrderDetail />} />
              <Route path="/returns" element={<Return />} />
              <Route path="/cancellation" element={<Cancellation />} />
              <Route path="/my-profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/address-book" element={<AddressBook />} />
              <Route path="/address" element={<EditAddress />} />
              <Route path="/payment-options" element={<PaymentOption />} />
              <Route path="/email/verify" element={<VerifyEmail />} />
              <Route path="/resend-link" element={<ResendLink />} />
              <Route path="/password-form" element={<PasswordForm />} />
              <Route path="/payment-complete" element={<OrderSuccessModal />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/all-products" element={<AllProducts />} />
              <Route path="/modal" element={<AddToCartModal />} />
              <Route path="*" element={<P404 />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
      <ScrollToTop />
    </>
  );
}

export default App;
