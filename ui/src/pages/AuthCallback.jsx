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
        // 1. Fetch guest cart/wishlist and get their values
        const guestWishlist = await api.get("/wishlist/get-guest-wishlist-items");
        const guestCart = await api.get("/cart/get-guest-cart-items");

        // 2. Store access token
        dispatch(setAccessToken(token));

        // 3. Fetch and set user (after guest data is fetched)
        const res = await api.get("/users/get-user");
        dispatch(setUser(res.data.user));
        console.log(guestWishlist, guestCart)

        // 4. Check if merge modal should be shown after the data is fetched
        const shouldShowModal = guestCart.data?.items?.length > 0 || guestWishlist.data?.items?.length > 0;

        if (shouldShowModal) {
          setShowMergeModal(true);
        } else {
          // Fetch cart/wishlist again if no modal
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
