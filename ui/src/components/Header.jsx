import React, { useState, useEffect } from "react";
import { Menu, X, Search, Heart, ShoppingCart, User, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { fetchWishlist } from "../slices/wishlistSlice";
import { fetchCart } from "../slices/cartSlice";

const Header = () => {
  const [isAccountDropdownVisible, setAccountDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.wishlist);
  const { items: cartItems } = useSelector(state => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMobileMenuOpen(false);
  };

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

  const handleLogout = async () => {
    await dispatch(logout()).unwrap()
    await dispatch(fetchWishlist()).unwrap()
    await dispatch(fetchCart()).unwrap()
    setAccountDropdownVisible(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.account-dropdown-container')) {
        setAccountDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="w-full">
      {/* Top Header */}
      <div className="top-header bg-black py-2 md:py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <p className="text-white text-xs sm:text-sm text-center sm:text-left">
              Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
              <span className="underline font-bold cursor-pointer hover:text-gray-300">Shop Now</span>
            </p>
            <div className="hidden sm:block">
              <select
                name="language"
                id="language"
                className="bg-black text-white border-0 focus:outline-none text-sm cursor-pointer"
              >
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-header border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="logo">
              <span className="text-xl md:text-2xl font-bold cursor-pointer">Exclusive</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex gap-6 xl:gap-10 items-center">
                <li>
                  <Link to="/"
                    className={`cursor-pointer ${activeLink === "home" ? "underline" : "hover:underline"}`}
                    onClick={() => handleLinkClick("home")}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/contact"
                    className={`cursor-pointer ${activeLink === "contact" ? "underline" : "hover:underline"}`}
                    onClick={() => handleLinkClick("contact")}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/about"
                    className={`cursor-pointer ${activeLink === "about" ? "underline" : "hover:underline"}`}
                    onClick={() => handleLinkClick("about")}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/signup"
                    className={`cursor-pointer ${activeLink === "signup" ? "underline" : "hover:underline"}`}
                    onClick={() => handleLinkClick("signup")}
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Icons Container */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search - Hidden on mobile, shown on tablet+ */}
              <div className="hidden md:flex search px-3 py-2 bg-gray-100 rounded w-48 lg:w-64 items-center justify-between">
                <form onSubmit={(e) => { e.preventDefault(); const q = searchQuery.trim(); if (q) navigate(`/search?q=${encodeURIComponent(q)}`); }} className="flex items-center w-full">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="bg-transparent border-0 focus:outline-none flex-1 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const q = searchQuery.trim();
                        if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="cursor-pointer"
                    aria-label="Search"
                  >
                    <Search size={20} className="text-gray-600" />
                  </button>
                </form>
              </div>

              {/* Wishlist */}
              <Link className="wishlist relative cursor-pointer group" to="/wishlist">
                <Heart
                  size={24}
                  className="hover:fill-red-500 hover:stroke-red-500 transition-colors"
                />
                {items?.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full flex justify-center items-center text-white text-xs">
                    {items.length}
                  </div>
                )}
              </Link>

              {/* Cart */}
              <Link className="cart relative cursor-pointer group" to="/cart">
                <div className="w-8 h-8 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors">
                  <ShoppingCart size={20} className="group-hover:stroke-white" />
                </div>
                {cartItems?.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full flex justify-center items-center text-white text-xs">
                    {cartItems.length}
                  </div>
                )}
              </Link>

              {/* Profile Icon */}
              <div className="relative account-dropdown-container">
                <div
                  className={`profile flex justify-center items-center rounded-full w-8 h-8 cursor-pointer transition-colors hover:bg-red-500 group ${isAccountDropdownVisible ? "bg-red-500" : ""}`}
                  onClick={toggleAccountDropdownStatus}
                >
                  <User
                    size={20}
                    className={`group-hover:stroke-white transition-colors ${isAccountDropdownVisible ? "stroke-white" : "stroke-black"}`}
                  />
                </div>

                {/* Account Dropdown */}
                {isAccountDropdownVisible && user && (
                  <div className="account-dropdown absolute right-0 top-full mt-2 w-56 py-4 bg-gray-600 rounded shadow-lg z-50">
                    <div className="px-4 space-y-3">
                      <Link to="/manage-my-account"
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-500 rounded transition-colors"
                      >
                        <User size={20} className="text-white" />
                        <span className="text-sm text-white">Manage My Account</span>
                      </Link>

                      <Link to="/orders"
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-500 rounded transition-colors"
                      >
                        <ShoppingCart size={20} className="text-white" />
                        <span className="text-sm text-white">My Orders</span>
                      </Link>

                      <Link to="/cancellation"
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-500 rounded transition-colors"
                      >
                        <X size={20} className="text-white" />
                        <span className="text-sm text-white">My Cancellations</span>
                      </Link>

                      {user?.role === "admin" && (
                        <Link to="/admin-dashboard"
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-500 rounded transition-colors"
                        >
                          <div className="w-5 h-5 bg-white rounded-sm"></div>
                          <span className="text-sm text-white">Admin Dashboard</span>
                        </Link>
                      )}

                      <hr className="border-gray-500" />

                      <a
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-500 rounded transition-colors cursor-pointer" onClick={handleLogout}
                      >
                        <div className="w-5 h-5 border-2 border-white rounded"></div>
                        <span className="text-sm text-white">Logout</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
              }}
              className="search px-3 py-2 bg-gray-100 rounded flex items-center"
            >
              <input
                type="text"
                placeholder="What are you looking for?"
                className="bg-transparent border-0 focus:outline-none flex-1 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Search"
              >
                <Search size={20} className="text-gray-600 cursor-pointer" />
              </button>
            </form>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav>
                <ul className="space-y-4">
                  <li>
                    <Link to={"/"}
                      className={`block cursor-pointer text-lg ${activeLink === "home" ? "underline font-semibold" : "hover:underline"}`}
                      onClick={() => handleLinkClick("home")}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to={"/contact"}
                      className={`block cursor-pointer text-lg ${activeLink === "contact" ? "underline font-semibold" : "hover:underline"}`}
                      onClick={() => handleLinkClick("contact")}
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to={"/about"}
                      className={`block cursor-pointer text-lg ${activeLink === "about" ? "underline font-semibold" : "hover:underline"}`}
                      onClick={() => handleLinkClick("about")}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to={"/signup"}
                      className={`block cursor-pointer text-lg ${activeLink === "signup" ? "underline font-semibold" : "hover:underline"}`}
                      onClick={() => handleLinkClick("signup")}
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;