import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import ProductCard from '../components/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice'
import api from '../api/axiosInstance'

const CategoryPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [parentCategory, setParentCategory] = useState(null)
  const [products, setProducts] = useState(null)
  const { categorySlug } = useParams();
  const { items, error: wishlistError } = useSelector(state => state.wishlist)
  const { cart, error: cartError, loading: cartLoading } = useSelector(state => state.cart)
  useEffect(() => {
    async function fetchAndSetCategoryPage() {
      try {
        setLoading(true);
        const res = await api.get(`/category/get-category-name-by-slug/${categorySlug}`);
        setCategoryName(res.data.name);
        setParentCategory(res.data.parent)
        const products = await api.get(`/category/get-category-products/${res.data.id}`)
        setProducts(products.data)
      } catch (err) {
        navigate("/p404")
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) {
      fetchAndSetCategoryPage();
    } else if (!categorySlug) {
      navigate("/p404")
    }
  }, [categorySlug]);

  const handleWishlistToggle = async (productID) => {
    setLoading(true);
    if (items.some(item => item.product == productID)) {
      dispatch(removeFromWishlist(productID)).then(() => {
        setLoading(false);
        toast.success("Product removed from wishlist")
      }).catch(() => setLoading(false));
    } else {
      dispatch(addToWishlist(productID)).then(() => {
        setLoading(false);
        toast.success("Product added to wishlist")
      }).catch(() => setLoading(false));
    }
  }

  return (
    <div>
      {(loading) && <div className="h-screen flex items-center justify-center"><Loader /></div>}
      <div className={`w-[1170px] ${(loading) ? "hidden" : "flex gap-[0.5rem]"} mx-auto flex-col py-4`}>
        <div className="bread-crumb">
          <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><span className={`text-[14px] text-[#605f5f] hover:text-black cursor-pointer ${parentCategory == null ? "hidden" : ""}`}>{parentCategory}</span><span className={`m-[11px] text-[14px] text-[#605f5f] ${parentCategory == null ? "hidden" : ""}`}>/</span><Link to={`/category/${categorySlug}`} className="text-[14px]">{categoryName}</Link>
        </div>
        <h1 className="text-[34px] font-semibold">{categoryName}</h1>
        <div className="my-[2rem]">
          {products && products?.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">{products.map((product, index) => (
            <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} isWishlistSelected={items.some(item => item.product == product._id)} isAddToCartSelected={cart != null && cart.find(item => item.productID == product._id)} />
          ))}</div> : (
            <div className="flex flex-col my-[2rem]">
              <p className='text-center text-[#757575]'>There are no products currently listed in this category</p>
              <Link to="/" className='text-center'>
                <button className='btn-1 max-w-[211px] w-[211px] h-[56px] rounded-sm mt-[25px]'>Continue Shopping</button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-right" // Position of the toast message
        autoClose={3000} // Duration in milliseconds before toast disappears
        hideProgressBar={false} // Hide progress bar for simplicity
        closeOnClick={true} // Allow closing the toast by clicking
        pauseOnHover
      />
    </div>
  )
}

export default CategoryPage
