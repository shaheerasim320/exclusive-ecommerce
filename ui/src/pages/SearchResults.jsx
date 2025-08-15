import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../slices/wishlistSlice';
import { addToCart, fetchCart } from '../slices/cartSlice';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery().get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.get(`/products/search?q=${encodeURIComponent(query)}`)
        .then(res => setProducts(res.data.products))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [query]);

  const handleWishlistToggle = (productId) => {
    const isWishlisted = wishlistItems.some(item => item.product?._id === productId || item._id === productId);
    if (isWishlisted) {
      const wishlistItem = wishlistItems.find(item => item.product?._id === productId || item._id === productId);
      dispatch(removeFromWishlist({ wishlistItemId: wishlistItem._id })).then(() => dispatch(fetchWishlist()));
    } else {
      dispatch(addToWishlist({ product: productId })).then(() => dispatch(fetchWishlist()));
    }
  };

  const handleCartClick = (productId, quantity = 1, size = null, color = null) => {
    dispatch(addToCart({ product: productId, quantity, size, color })).then(() => dispatch(fetchCart()));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onWishlistToggle={handleWishlistToggle}
              onCartClick={handleCartClick}
              isWishlistSelected={wishlistItems.some(item => item.product?._id === product._id || item._id === product._id)}
              isAddToCartSelected={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 