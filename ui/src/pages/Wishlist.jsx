import React, { useEffect, useState } from 'react'
import ProductsRow from '../components/ProductsRow'
import WishlistProductCard from '../components/WishlistProductCard';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import ErrorModal from '../components/modals/ErrorModal';
import { fetchWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import AddToCartModal from '../components/modals/AddToCartModal';
import { addToCart } from '../slices/cartSlice';

const Wishlist = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { items, error } = useSelector(state => state.wishlist);
    const { loading: cartLoader } = useSelector(state => state.cart);
    const [showErrorModal, setShowErrorModal] = useState(false);
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
            dispatch(addToCart({ product: product._id, quantity: 1, color: null, size: null })).unwrap();
            handleDeleteFromWishlist(wishlistItemID);
        }
    };

    const handleMoveAllToBag = async () => {
        // Placeholder for moving all items to bag functionality
    }

    const handleClose = () => {
        setShowErrorModal(false);
        navigate("/wishlist");
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
            setShowErrorModal(true);
        }
    }, [error]);

    return (
        <div className="min-h-[320px] px-4 sm:px-6 lg:px-8">
            {cartLoader || loading ? <Loader /> : ""}
            {showErrorModal && <ErrorModal message={error} btnMessage={"Retry"} onClose={handleClose} />}
            {/* Breadcrumbs */}
            <div className="nav max-w-6xl h-[21px] my-[34px] mx-auto text-sm">
                <Link to="/" className="text-[#605f5f] hover:text-black">Home</Link>
                <span className="mx-2 text-[#605f5f]">/</span>
                <Link to="#">Wishlist</Link>
            </div>

            <section className="wishlist-container max-w-6xl mx-auto mb-[120px] flex flex-col gap-20">
                {/* Wishlist */}
                <div className={`wishlist ${items?.length > 0 && !cartLoader ? 'flex' : 'hidden'} flex-col gap-16`}>
                    <div className="header h-14 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="title flex gap-2 text-xl">
                            <h6>Wishlist</h6>
                            <span>({items?.length})</span>
                        </div>
                    </div>

                    {modalVisible && (
                        <AddToCartModal
                            product={modalProduct}
                            onClose={handleModalClose}
                            onConfirm={handleModalConfirm}
                        />
                    )}

                    <div className="products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((item, index) => (
                            <WishlistProductCard
                                key={index}
                                product={item.product}
                                productId={item.product._id}
                                onDelete={handleDeleteFromWishlist}
                                wishlistItemID={item._id}
                                onAddToCart={handleAddToCart}
                                color={item.color}
                                size={item.size}
                                loading={handleLoading}
                                loadingFinish={handleLoadingFinish}
                            />
                        ))}
                    </div>
                </div>

                <div className={`${items?.length > 0 && !cartLoader ? '' : 'hidden'}`}>
                    <ProductsRow title={"Just For You"} />
                </div>

                <div className={`${items?.length === 0 ? 'flex' : 'hidden'} flex-col mt-7 text-center`}>
                    <p className='text-[#757575]'>There are no items in wishlist</p>
                    <Link to="/">
                        <button className='btn-1 max-w-[211px] w-full sm:w-[211px] h-[56px] rounded-sm mt-[25px]'>Continue Shopping</button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Wishlist;
