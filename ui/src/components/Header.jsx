import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { getCartItems, resetCart } from "../slices/cartSlice";
// import { getWishlistItems, resetWishlist } from "../slices/wishlistSlice";
// import { logout } from "../slices/userSlice";

const Header = () => {
  const dispatch = useDispatch()
  const { items } = useSelector(state => state.wishlist)
  const { items:cartItems } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.user)
  const location = useLocation();
  const [isAccountDropdownVisible, setAccountDropdownVisible] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveLink("home")
    } else if (location.pathname === "/contact") {
      setActiveLink("contact")
    } else if (location.pathname === "/about") {
      setActiveLink("about")
    } else if (location.pathname === "/signup") {
      setActiveLink("signup")
    } else {
      setActiveLink("")
    }
  }, [location]);
  const toggleAccountDropdownStatus = () => {
    if (!user) {
      navigate("/login")
    } else {
      setAccountDropdownVisible(!isAccountDropdownVisible);
    }
  };

  const hideAccountDropdown = () => {
    setAccountDropdownVisible(false);
  };

  const navigateToPage = async (pageName) => {
    let redirectURL = "";
    if (pageName == "manage-my-account") {
      redirectURL = "/manage-my-account";
    } else if (pageName == "my-orders") {
      redirectURL = "/orders";
    } else if (pageName == "my-cancellations") {
      redirectURL = "/cancellation";
    } else if (pageName == "logout") {
      // await dispatch(logout()).unwrap()
      // dispatch(resetCart())
      // dispatch(resetWishlist())
      redirectURL = "/";
    } else if(pageName="admin-dashboard"){
      if(user.role=="admin"){
        redirectURL="/admin/dashboard"
      }
    }else {
      redirectURL = "/404";
    }

    hideAccountDropdown();
    navigate(redirectURL);
  };

  return (
    <header>
      {/* Top Header */}
      <div className="top-header bg-black py-3 flex">
        <div className="inner-div flex items-center mx-auto gap-60">
          <p className="text-white text-sm">
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
            <Link to="/" className="underline font-bold select-none">Shop Now</Link>
          </p>
          <select name="language" id="language" className="bg-black text-white border-0 focus:outline-none focus:border-0">
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-header flex items-center justify-around my-4">
        <div className="logo">
          <Link to="/" className="text-2xl font-bold">Exclusive</Link>
        </div>
        <nav>
          <ul className="flex gap-10 items-center">
            <li><Link to="/" className={`link  ${activeLink == "home" ? " underline" : "hover:underline"}`}>Home</Link></li>
            <li><Link to="/contact" className={`link ${activeLink == "contact" ? " underline" : "hover:underline"}`}>Contact</Link></li>
            <li><Link to="/about" className={`link ${activeLink == "about" ? " underline" : "hover:underline"}`}>About</Link></li>
            <li><Link to="/signup" className={`link ${activeLink == "signup" ? " underline" : "hover:underline"}`}>Sign Up</Link></li>
          </ul>
        </nav>
        {/* Icons */}
        <div className="icons flex items-center gap-3">
          {/* Search */}
          <div className="search px-4 py-2 bg-[#F5F5F5] flex w-64 justify-between">
            <input type="text" placeholder="What are you looking for?" className="bg-[#F5F5F5]  border-0 focus:outline-none focus:border-0 " />
            <img src="/images/search.svg" alt="search" className="cursor-pointer" />
          </div>
          {/* Wishlist */}
          <div className="wishlist group">
            <Link to="/wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" className="wishlist-icon hover:fill-[#DB4444] hover:stroke-[#DB4444] relative top-[8px]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="1.75" />
              </svg>
              <div className={`bg-[#DB4444] w-4 h-4  rounded-full relative bottom-[1.35rem] left-4  text-white ${(items?.length == 0) ? "invisible" : "flex"} justify-center items-center text-[10px]`}>{items?.length}</div>
            </Link>
          </div>

          {/* Cart */}
          <div className="cart group w-8 h-8  hover:bg-[#DB4444] rounded-full flex items-center justify-center">
            <Link to="/cart">
              <svg fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-7 h-7 max-3xl:w-6 max-3xl:h-6 max-2xl:w-5 max-2xl:h-5 relative top-[8px] stroke-black group-hover:stroke-white" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" strokeWidth="2" d="M5,5 L22,5 L20,14 L7,14 L4,2 L0,2 M7,14 L8,18 L21,18 M19,23 C18.4475,23 18,22.5525 18,22 C18,21.4475 18.4475,21 19,21 C19.5525,21 20,21.4475 20,22 C20,22.5525 19.5525,23 19,23 Z M9,23 C8.4475,23 8,22.5525 8,22 C8,21.4475 8.4475,21 9,21 C9.5525,21 10,21.4475 10,22 C10,22.5525 9.5525,23 9,23 Z"></path>
              </svg>
              <div className={`bg-[#DB4444] w-4 h-4 rounded-full relative bottom-5 left-3  text-white ${(cartItems?.length == 0) ? "invisible" : "flex"} justify-center items-center text-[10px]`}>{cartItems?.length}</div>
            </Link>
          </div>
          {/* Profile Icon */}
          <div className="relative">
            <div
              className={`profile flex justify-center items-center rounded-full group hover:bg-[#DB4444] ${isAccountDropdownVisible ? "bg-red-500" : ""}`}
              onClick={toggleAccountDropdownStatus}
            >
              <button className="h-8 w-8 flex items-center justify-center">
                <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={`w-7 h-7 max-3xl:w-6 max-3xl:h-6 max-2xl:w-5 max-2xl:h-5 stroke-black group-hover:stroke-white ${isAccountDropdownVisible ? "stroke-white" : "stroke-black"}`} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            </div>

            {/* Account Dropdown */}
            {isAccountDropdownVisible && (
              <div className="account-dropdown w-[225px] py-[20px] bg-[#9b979b] flex items-center justify-center absolute right-0 top-full z-[10]">
                <div className="contents-inner w-[192px]  flex flex-col gap-[15px] justify-evenly">
                  <button onClick={() => navigateToPage("manage-my-account")}>
                    <div className="manage-my-account w-[192px] h-[32px] flex items-center group">
                      <div className="image">
                        <img src="/images/user.svg" alt="user" className="w-[32px] h-[32px]" />
                      </div>
                      <span className="ml-[5px] text-[14px] text-white group-hover:text-[#BFBBBB]">Manage My Account</span>
                    </div>
                  </button>
                  <button onClick={() => navigateToPage("my-orders")}>
                    <div className="my-orders w-[192px] h-[32px] flex items-center group">
                      <div className="image">
                        <img src="/images/icon-mallbag.svg" alt="orders" className="w-[32px] h-[32px]" />
                      </div>
                      <span className="ml-[5px] text-[14px] text-white group-hover:text-[#BFBBBB]">My Orders</span>
                    </div>
                  </button>
                  <button onClick={() => navigateToPage("my-cancellations")}>
                    <div className="my-cancellations w-[192px] h-[32px] flex items-center group">
                      <div className="image">
                        <img src="/images/icon-cancel.svg" alt="cancel" className="w-[32px] h-[32px]" />
                      </div>
                      <span className="ml-[5px] text-[14px] text-white group-hover:text-[#BFBBBB]">My Cancellations</span>
                    </div>
                  </button>
                  <button onClick={() => navigateToPage("logout")}>
                    <div className="logout w-[192px] h-[32px] flex items-center group">
                      <div className="image">
                        <img src="/images/Icon-logout.svg" alt="logout" className="w-[32px] h-[32px]" />
                      </div>
                      <span className="ml-[5px] text-[14px] text-white group-hover:text-[#BFBBBB]">Logout</span>
                    </div>
                  </button>
                  <button className={`${user?.role=="admin"?"flex":"hidden"}`} onClick={() => navigateToPage("admin-dashboard")}>
                    <div className={`admin-dashboard w-[192px] h-[32px] ${user?.role=="admin"?"flex":"hidden"} items-center group`}>
                      <div className="image">
                        <img src="/images/dashboard-icon.svg" alt="dashboard" className="w-[32px] h-[32px] invert" />
                      </div>
                      <span className="ml-[5px] text-[14px] text-white group-hover:text-[#BFBBBB]">Admin Dashboard</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <div className="border-t border-gray-300 mt-4 " />
    </header>
  );
};

export default Header;
