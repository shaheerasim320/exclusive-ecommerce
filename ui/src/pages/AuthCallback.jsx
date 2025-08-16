import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setUser } from "../slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { fetchWishlist } from "../slices/wishlistSlice";
import { fetchCart } from "../slices/cartSlice";
import MergeModal from "../components/modals/MergeModal";
import { getWithExpiry } from "../utils/expiringLocalStorage";
import Loader from "../components/Loader";
import { getDefaultBillingAddress, getDefaultShippingAddress, getSavedAddresses } from "../slices/addressSlice";
import { getCancelledOrders, getPlacedOrders, getRecentOrders, getReturnedOrders } from "../slices/orderSlice";
import { getDefaultCard, getSavedCards } from "../slices/cardSlice";

export default function AuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showMergeModal, setShowMergeModal] = useState(false);

  const wishlistItems = useSelector(state => state.wishlist.items);
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    const initialize = async () => {
      const query = new URLSearchParams(window.location.search);
      const token = query.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const guestWishlist = await api.get("/wishlist/get-guest-wishlist-items");
        const guestCart = await api.get("/cart/get-guest-cart-items");

        dispatch(setAccessToken(token));

        const res = await api.get("/users/get-user");
        dispatch(setUser(res.data.user));

        const shouldShowModal = guestCart.data?.items?.length > 0 || guestWishlist.data?.items?.length > 0;

        dispatch(getSavedAddresses());
        dispatch(getDefaultShippingAddress());
        dispatch(getDefaultBillingAddress());
        dispatch(getPlacedOrders());
        dispatch(getReturnedOrders());
        dispatch(getCancelledOrders());
        dispatch(getSavedCards());
        dispatch(getDefaultCard());
        dispatch(getRecentOrders())

        if (shouldShowModal) {
          setShowMergeModal(true);
        } else {
          dispatch(fetchCart());
          dispatch(fetchWishlist());
          performRedirect();
        }

      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    initialize();
  }, [dispatch, navigate, location.state]);

  const performRedirect = async () => {
    const redirectIntent = getWithExpiry("postAuthRedirect");

    if (redirectIntent && redirectIntent.type === "buyNow") {
      localStorage.removeItem("postAuthRedirect");
      const item = {
        product: redirectIntent.product,
        quantity: redirectIntent.quantity,
      };
      if (redirectIntent.color) {
        item.color = redirectIntent.color;
      }
      if (redirectIntent.size) {
        item.size = redirectIntent.size;
      }

      try {
        const res = await api.post("/billing/create-billing-record", {
          items: [item]
        });

        if (res.data && res.data.billingId) {
          const billingPublicId = res.data.billingId;
          console.log("Billing record created with public ID:", billingPublicId);

          navigate(`/billing?billingID=${billingPublicId}`);
        }

      } catch (error) {
        console.error("Error creating billing record:", error);
      }
      return;
    }

    const redirectURL = location.state?.from || "/";
    navigate(redirectURL);
  };

  const handleOnClose = () => {
    setShowMergeModal(false);
    performRedirect();
  };

  return (
    <>
      {showMergeModal && <MergeModal onClose={handleOnClose} />}
      <div className="h-screen flex justify-center"><Loader /></div>
    </>
  );
}
