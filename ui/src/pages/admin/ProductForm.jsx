import React, { useEffect, useRef, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { getHirearcialDropDownCategories } from '../../slices/CategorySlice'
import { ChromePicker } from "react-color";
import SizeComponent from '../../components/SizeComponent';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { addProduct, fetchProductByID, updateProduct } from '../../slices/productSlice';
import { deleteImage, uploadImage } from '../../slices/imageSlice';
import Loader from '../../components/Loader';
import { toast, ToastContainer } from 'react-toastify';

const ProductForm = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const edit = searchParams.has("edit")
    const location = useLocation()
    const { hirearcialDropDownCategories } = useSelector(state => state.category)
    useEffect(() => {
        dispatch(getHirearcialDropDownCategories())
    }, [dispatch])
    const [productName, setProductName] = useState("")
    const navigate = useNavigate()
    const { product } = useSelector(state => state.products)
    const [selectedCategory, setSelectedCategory] = useState("default")
    const [description, setDescription] = useState("")
    const [fieldsFilled, setFieldsFilled] = useState(true)
    const [colors, setColors] = useState([])
    const [currentColor, setCurrentColor] = useState("#000000");
    const [showPicker, setShowPicker] = useState(false)
    const [productID, setProductID] = useState(null)
    const { loading: picLoading, error: picError } = useSelector(state => state.image)
    const { loading: productLoading, error: productError } = useSelector(state => state.products)
    const sizesArray = ["XS", "S", "M", "L", "XL"];
    const [sizes, setSizes] = useState([])
    const [price, setPrice] = useState("")
    const [discount, setDiscount] = useState("")
    const [quantity, setQuantity] = useState("")
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [images, setImages] = useState([
        "/images/400.png",
        "/images/120.png",
        "/images/120.png",
        "/images/120.png",
        "/images/120.png"
    ])
    const [uploadedImages, setUploadedImages] = useState([])
    const fileInputs = useRef([]);
    const handleImageChange = async (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newImages = [...images];
            const { imageUrl, publicId } = await dispatch(uploadImage({ file })).unwrap()
            setUploadedImages(prev => [...prev, publicId])
            newImages[index] = imageUrl;
            setImages(newImages);
        }
    };
    const triggerFileInput = (index) => {
        if (fileInputs.current[index]) {
            fileInputs.current[index].click();
        }
    };
    const handleProductNameChange = (e) => {
        const value = e.target.value
        if (/^[A-Za-z0-9\s&']*$/.test(value)) {
            setProductName(value);
        }
    }
    const addColor = () => {
        if (!colors.includes(currentColor)) {
            setColors([...colors, currentColor]);
        }
        setShowPicker(false);
    }

    const addSize = (size) => {
        if (!sizes.includes(size)) {
            setSizes([...sizes, size])
        }
    }

    const removeSize = (sizeToRemove) => {
        setSizes(sizes.filter((size) => size !== sizeToRemove))
    }

    const removeColor = (colorToRemove) => {
        setColors(colors.filter((color) => color !== colorToRemove));
    }

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value)) {
            if (value === "" || parseInt(value) > 0) {
                setPrice(value);
            }
        }
    }
    const handleDiscountChange = (e) => {
        const value = e.target.value
        if (/^[0-9.[0-9]*$/.test(value)) {
            if (value > 0 && value < 100 || value == "") {
                setDiscount(value)
            }
        }
    }
    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value)) {
            if (value === "" || parseInt(value) > 0) {
                setQuantity(value);
            }
        }
    }
    useEffect(() => {
        if (edit && location?.state?.productID) {
            const productID = location.state.productID
            setProductID(productID)
            dispatch(fetchProductByID(productID))
        } else if (edit) {
            navigate("/admin/products")
        }
    }, [edit])
    useEffect(() => {
        if (product) {
            setProductName(product.title)
            setDescription(product.description)
            product.colors != null ? setColors(product.colors) : ""
            setDiscount(product.discount)
            setQuantity(product.stock)
            setPrice(product.price)
            product.sizes != null ? setSizes(product.sizes) : ""
            setImages([
                product.mainImage,
                product.image1,
                product.image2,
                product.image3,
                product.image4
            ])
            product?.category ? setSelectedCategory(product.category) : ""
        }
    }, [product])

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (uploadedImages.length > 0 && !formSubmitted) {
                e.preventDefault();
                e.returnValue = "";

                uploadedImages.forEach((id) => {
                    navigator.sendBeacon(
                        "http://localhost:8080/api/v1/image/delete",
                        new Blob([JSON.stringify({ publicId: id })], {
                            type: "application/json",
                        })
                    );
                });
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [uploadedImages, formSubmitted]);
    useEffect(() => {
        if (picError) {
            toast.error(picError)
        }
        if (productError) {
            toast.error(productError)
        }
    }, [picError, productError])

    const handleButtonClick = async () => {
        const allFieldsFilled = productName != "" && selectedCategory != "default" && description != "" && quantity != "" && price != ""
        setFieldsFilled(allFieldsFilled)
        if (allFieldsFilled) {
            const data = {
                storeName: "Baby Mart 1",
                title: productName,
                category: selectedCategory,
                price: price,
                description: description,
                stock: quantity,
                discount: discount,
                colors: colors.length == 0 ? null : colors,
                sizes: sizes.length == 0 ? null : sizes,
                mainImage: images[0],
                image1: images[1],
                image2: images[2],
                image3: images[3],
                image4: images[4],
                onSale: edit ? product.onSale : discount != "" ? true : false
            }
            if (edit) {
                await dispatch(updateProduct({ productID: productID, updatedData: data })).unwrap()
                navigate("/admin/products", { state: { message: "Product updated successfully" } })
            } else {
                await dispatch(addProduct({ productData: data })).unwrap()
                navigate("/admin/products", { state: { message: "Product added successfully" } })
            }
        }
    }
    return (
        <div>
            {picLoading && <Loader />}
            <div className={`${picLoading ? "hidden" : "flex"}`}>
                <AdminSidebar />
                <div className="flex-1 p-4">
                    <h1 className="text-[36px] font-bold">{edit ? "Edit" : "Add New"} Product</h1>
                    <p className={`text-[#DB4444] my-[5px] ${!fieldsFilled ? "" : "hidden"}`}>Please fill out fields</p>
                    <div className="form flex justify-between">
                        <div className="col-1 flex flex-col w-[60%] gap-[2%]">
                            <div className="wrapper flex justify-between">
                                <div className="name flex flex-col w-[54%]">
                                    <label className="text-[#A6A6A6] font-[500]">Product name<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                    <input type="text" value={productName} onChange={handleProductNameChange} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                                </div>
                                <div className="category flex flex-col">
                                    <label className="text-[#A6A6A6] font-[500]">Select Category<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="rounded-lg border border-[#CCC] py-[8px] px-[7px] min-w-[247px]" >
                                        <option key="default" id="default" value="default" disabled hidden>Select your category</option>
                                        {hirearcialDropDownCategories && hirearcialDropDownCategories.map(category => (
                                            <optgroup key={category.id} label={category.name}>
                                                {category.subCategories.map(sub => (
                                                    <option key={sub.id} value={sub.id}>
                                                        {sub.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="desc flex flex-col">
                                <label className="text-[#A6A6A6] font-[500]">Product Description<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] h-[80px] "></textarea>
                            </div>
                            <div className="colors flex flex-col">
                                <label className="text-[#A6A6A6] font-[500]">Colors</label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map((color) => (
                                        <div key={color} className="flex items-center gap-1 px-2 py-1 border rounded-full h-[2rem]">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-xs">{color}</span>
                                            <button onClick={() => removeColor(color)} className="text-xs text-red-500">
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <div>
                                        <button onClick={() => setShowPicker(!showPicker)} className="border px-3 py-1 rounded text-sm">
                                            {showPicker ? "Cancel" : "Add Color"}
                                        </button>
                                    </div>
                                    {showPicker && (
                                        <div className="mt-2">
                                            <ChromePicker color={currentColor} onChangeComplete={(color) => setCurrentColor(color.hex)} />
                                            <button onClick={addColor} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
                                                Add This Color
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="wrapper flex justify-between">
                                <div className="sizes flex flex-col">
                                    <label className="text-[#A6A6A6] font-[500]">Sizes</label>
                                    <div className="flex gap-[1rem]">
                                        {sizesArray.map((size, index) => (
                                            <SizeComponent size={size} key={index} onClick={() => sizes.includes(size) ? removeSize(size) : addSize(size)} isSelected={sizes.includes(size)} />
                                        ))}
                                    </div>
                                </div>
                                <div className="qty flex flex-col">
                                    <label className="text-[#A6A6A6] font-[500]">Quantity<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                    <input type="number" value={quantity} onChange={handleQuantityChange} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                                </div>
                            </div>
                            <div className="wrapper flex justify-between">
                                <div className="price flex flex-col">
                                    <label className="text-[#A6A6A6] font-[500]">Price<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                    <input type="number" value={price} onChange={handlePriceChange} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                                </div>
                                <div className="disocunt flex flex-col">
                                    <label className="text-[#A6A6A6] font-[500]">Discount</label>
                                    <input type="text" value={discount} onChange={handleDiscountChange} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                                </div>
                            </div>
                            <button className="bg-[#47b2ca] text-white p-[10px] rounded-full hover:bg-[#85bcca] w-[6.5rem] mt-[1rem]" onClick={handleButtonClick}>
                                {edit ? "Save" : "Submit"}
                            </button>
                        </div>
                        <div className="col-2 w-[35%] p-2 flex flex-col gap-[10px]">
                            {/* Main Image */}
                            <div className="main-image flex">
                                <div className="image relative w-[220px] h-[220px]">
                                    <img src={images[0]} alt="Main" className="w-full h-full object-contain rounded" />
                                    <img
                                        src="/images/Pencil_edit_icon.svg.png"
                                        alt="edit"
                                        className="w-8 h-8 absolute right-2 top-2 cursor-pointer"
                                        onClick={() => triggerFileInput(0)}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={(el) => (fileInputs.current[0] = el)}
                                        onChange={(e) => handleImageChange(0, e)}
                                    />
                                </div>
                            </div>
                            {[1, 3].map((rowStart) => (
                                <div key={rowStart} className="row flex gap-[1.1rem]">
                                    {[0, 1].map((i) => {
                                        const index = rowStart + i;
                                        return (
                                            <div key={index} className="image relative w-[100px] h-[100px]">
                                                <img
                                                    src={images[index]}
                                                    alt={`Image ${index}`}
                                                    className="w-full h-full object-contain rounded"
                                                />
                                                <img
                                                    src="/images/Pencil_edit_icon.svg.png"
                                                    alt="edit"
                                                    className="w-4 h-4 absolute right-1 top-1 cursor-pointer"
                                                    onClick={() => triggerFileInput(index)}
                                                />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    ref={(el) => (fileInputs.current[index] = el)}
                                                    onChange={(e) => handleImageChange(index, e)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover
            />
        </div>
    )
}

export default ProductForm
