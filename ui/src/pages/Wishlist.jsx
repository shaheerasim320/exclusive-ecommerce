import React, { useEffect, useState } from 'react'
import ProductsRow from '../components/ProductsRow'
import WishlistProductCard from '../components/WishlistProductCard';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { addToCart, deleteWishlistItem, getWishlistItems, moveAllItemsToCart, resetWishlistError } from '../slices/wishlistSlice';
import Loader from '../components/Loader';
import ErrorModal from '../components/modals/ErrorModal';
import { fetchWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import AddToCartModal from '../components/modals/AddToCartModal';
import { addToCart } from '../slices/cartSlice';
// import { getCartItems } from '../slices/cartSlice';



const Wishlist = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const { items, error } = useSelector(state => state.wishlist)
    const { loading: cartLoader } = useSelector(state => state.cart)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [modalProduct, setModalProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalWishlistItemID, setModalWishlistItemID] = useState(null);


    const handleDeleteFromWishlist = async (wishlistItemId) => {
        dispatch(removeFromWishlist({ wishlistItemId }));
    }

    const handleAddToCart = async (wishlistItemID, product) => {
        if ((product?.sizes?.length > 0) || (product?.colors?.length > 0)) {
            setModalProduct(product);
            setModalWishlistItemID(wishlistItemID);
            setModalVisible(true);
        } else {
            dispatch(addToCart({ product: product._id, quantity: 1, color: null, size: null })).unwrap()
            handleDeleteFromWishlist(wishlistItemID);
        }
    };

    const handleMoveAllToBag = async () => {
        // await dispatch(moveAllItemsToCart()).unwrap()
        // await dispatch(getWishlistItems()).unwrap()
        // await dispatch(getCartItems()).unwrap()
    }
    const handleClose = () => {
        setShowErrorModal(false)
        navigate("/wishlist")
    }
    const handleModalClose = () => {
        setModalVisible(false);
        setModalProduct(null);
        setModalWishlistItemID(null);
    };

    const handleModalConfirm = async (color, size) => {
        dispatch(addToCart({ product: modalProduct._id, quantity: 1, color, size })).unwrap();
        handleDeleteFromWishlist(modalWishlistItemID);
        handleModalClose();
    };
    const handleLoading = () => {
        setLoading(true);
    }
    const handleLoadingFinish = () => {
        setLoading(false);
    }
    useEffect(() => {
        if (error != null) {
            setShowErrorModal(true)
        }
    }, [error])
    return (
        <div className="min-h-[320px]">
            {cartLoader || loading ? <Loader /> : ""}
            {showErrorModal && <ErrorModal message={error} btnMessage={"Retry"} onClose={handleClose} />}
            {/* Wishlist Container */}
            {/* Breadcrumbs */}
            <div className="nav w-[1156px] h-[21px] my-[34px] mx-auto">
                <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="#" className="text-[14px]">Wishlist</Link>
            </div>
            {/* Breadcrumbs Ends Here*/}
            <section className="wishlist-container w-[1170px] mx-auto mb-[120px] flex flex-col gap-[80px]">
                {/* Wishlist */}
                <div className={`wishlist ${items?.length > 0 && !cartLoader ? 'flex' : 'hidden'} flex-col gap-[60px]`}>
                    {/* Header */}
                    <div className="header h-[56px] flex items-center justify-between">
                        {/* Title */}
                        <div className="title flex gap-[8px]">
                            <h6 className="text-[20px]">Wishlist</h6><span className="text-[20px]">({items?.length})</span>
                        </div>
                        {/* Title Ends Here */}
                        {/* Button */}
                        <div className="btn w-[223px] h-[56px] bg-slate-500">
                            <button className="bg-white w-[223px] h-[56px] rounded-sm border-[1.5px] border-black border-opacity-60 hover:border-opacity-30" onClick={handleMoveAllToBag}>Move All To Bag</button>
                        </div>
                        {/* Button Ends Here */}
                    </div>
                    {/* Header Ends Here */}
                    {/* Products */}
                    {modalVisible && (
                        <AddToCartModal
                            product={modalProduct}
                            onClose={handleModalClose}
                            onConfirm={handleModalConfirm}
                        />
                    )}
                    <div className="products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch ">
                        {items.map((item, index) => (
                            <WishlistProductCard product={item.product} productId={item.product._id} onDelete={handleDeleteFromWishlist} wishlistItemID={item._id} key={index} onAddToCart={handleAddToCart} color={item.color} size={item.size} loading={handleLoading} loadingFinish={handleLoadingFinish} />
                        ))}
                    </div>
                    {/* Products End Here */}
                </div>
                {/* Wishlist Ends Here */}
                <div className={`${items?.length > 0 && !cartLoader ? '' : 'hidden'}`}>
                    <ProductsRow title={"Just For You"} />
                </div>
                <div className={`${items?.length === 0 ? 'flex' : 'hidden'} flex-col mt-[28px`}>
                    <p className='text-center text-[#757575]'>There are no items in wishlist</p>
                    <Link to="/" className='text-center'>
                        <button className='btn-1 max-w-[211px] w-[211px] h-[56px] rounded-sm mt-[25px]'>Continue Shopping</button>
                    </Link>
                </div>
            </section>
            {/* Wishlist Container Ends Here*/}

        </div>
    )
}

export default Wishlist
