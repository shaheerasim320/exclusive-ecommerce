import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader'
import AdminSidebar from '../../components/AdminSidebar'
import axios from 'axios';
// import { refreshAccessToken } from '../../slices/userSlice';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const FlashSaleForm = () => {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [flashProducts, setFlashProducts] = useState([])
    const [products, setProducts] = useState(null)
    const [showProducts, setShowProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("default");
    const [discount, setDiscount] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const edit = searchParams.get("edit");
    const view = searchParams.get("view");
    const [flashSaleID, setFlashSaleID] = useState(null);
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:8080/api/v1/products/get-all-products")
                setProducts(res.data)
            } catch (error) {

            } finally {
                setLoading(false);
            }
        }
        fetchProducts()
    }, [])

    const formatForDatetimeLocal = (isoString) => {
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    };

    useEffect(() => {
        async function fetchFlashSaleByID(flashSaleID) {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8080/api/v1/flashSale/fetch-flash-sale-by-id/${flashSaleID}`, { withCredentials: true })
                setTitle(res.data.title)
                setStartTime(formatForDatetimeLocal(res.data.startTime));
                setEndTime(formatForDatetimeLocal(res.data.endTime));
                setFlashProducts(res.data.products)
                setFlashSaleID(res.data)
            } catch (error) {
                if (error.response?.status === 401) {
                    try {
                        // // // // await dispatch(refreshAccessToken()).unwrap();
                        const retryRes = await axios.get(`http://localhost:8080/api/v1/flashSale/fetch-flash-sale-by-id/${flashSaleID}`, { withCredentials: true })
                        setTitle(res.data.title)
                        setStartTime(formatForDatetimeLocal(res.data.startTime));
                        setEndTime(formatForDatetimeLocal(res.data.endTime));
                        setFlashProducts(res.data.products)
                        setFlashSaleID(res.data)
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        navigate("/login");
                    }
                }
            } finally {
                setLoading(false);
            }

        }
        if (edit || view) {
            if (location?.state?.flashSaleID) {
                fetchFlashSaleByID(location.state.flashSaleID)
            } else {
                navigate("/admin/flash-sale")
            }
        }
    }, [edit, view])

    const handleTitleChange = (e) => {
        const value = e.target.value
        if (/^[A-Za-z0-9\s&@']*$/.test(value)) {
            setTitle(value);
            if (value != "" && error == "Please set the title of flash sale") {
                setError("")
            }
        }
    }
    const handleStartTimeChange = (e) => {
        const value = e.target.value;
        if (endTime !== "" && value < endTime) {
            setStartTime(value);
            if (error === "Please set the start time of flash sale") {
                setError("");
            }
        } else if (endTime === "") {
            setStartTime(value);
            if (error === "Please set the start time of flash sale") {
                setError("");
            }
        }
    }

    const handleEndTimeChange = (e) => {
        const value = e.target.value;
        if (startTime !== "" && value > startTime) {
            setEndTime(value);
            if (error === "Please set the end time of flash sale") {
                setError("");
            }
        } else if (startTime === "") {
            setEndTime(value);
            if (error === "Please set the end time of flash sale") {
                setError("");
            }
        }
    }
    const handleDiscountChange = (e) => {
        const value = e.target.value
        if (/^[0-9.[0-9]*$/.test(value)) {
            if (value > 0 && value < 100 || value == "") {
                setDiscount(value)
                if (value != "" && error == "Please choose discount percentage") {
                    setError("")
                } else if (value == "" && selectedProduct != "default" && error == "") {
                    setError("Please choose discount percentage")
                }
            }
        }
    }
    const addProduct = () => {
        const relatedFieldsFilled = selectedProduct != "default" && discount != ""
        !(relatedFieldsFilled) ? setError(selectedProduct == "default" ? "Please select product from dropdown" : "Please choose discount percentage") : ""
        if (relatedFieldsFilled) {
            const alreadyExists = flashProducts.some((item) => item.product === selectedProduct)
            if (!alreadyExists) {
                setFlashProducts((prev) => [...prev, { product: selectedProduct, discount: discount }])
                if (error === "Please set the products of flash sale") {
                    setError("");
                }
            }
            setSelectedProduct("default")
            setDiscount("")
            setShowProducts(false)
        }
    }

    const removeProduct = (productId) => {
        setFlashProducts((prev) =>
            prev.filter((item) => item.product !== productId)
        );
    };

    const handleButtonClick = async () => {
        if (view) {
            navigate(`/admin/flash-sale-form?edit=true&title=${encodeURIComponent(title)}`, { state: { flashSaleID: flashSaleID } });
        }
        const allFieldsFilled = title != "" && startTime != "" && endTime != "" && flashProducts.length != 0;
        !allFieldsFilled ? setError(title == "" ? "Please set the title of flash sale" : startTime == "" ? "Please set the start time of flash sale" : endTime == "" ? "Please set the end time of flash sale" : "Please set the products of flash sale") : ""
        if (allFieldsFilled && (edit || !view)) {
            try {
                setLoading(true);

                const flashSalePayload = {
                    title,
                    startTime,
                    endTime,
                    products: flashProducts,
                    isActive: new Date(startTime) <= (new Date) && (new Date) <= new Date(endTime)
                };
                const res = edit ? axios.put("http://localhost:8080/api/v1/flashSale/update-flash-sale", { flashSaleID: flashSaleID, updatedData: flashSalePayload }, { withCredentials: true }) : axios.post("http://localhost:8080/api/v1/flashSale/add-flash-sale", flashSalePayload, { withCredentials: true })

                navigate("/admin/flash-sale");

            } catch (error) {
                if (error.response?.status === 401) {
                    try {
                        // await dispatch(refreshAccessToken()).unwrap();

                        const retryRes = edit ? axios.put("http://localhost:8080/api/v1/flashSale/update-flash-sale", { flashSaleID: flashSaleID, updatedData: flashSalePayload }, { withCredentials: true }) : axios.post("http://localhost:8080/api/v1/flashSale/add-flash-sale", flashSalePayload, { withCredentials: true })

                        navigate("/admin/flash-sale");

                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        navigate("/login");
                    }
                }
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div>
            {loading && <Loader />}
            <div className={`${loading ? "hidden" : "flex"}`}>
                <AdminSidebar pageName={"flash-sale-form"} />
                <div className="flex-1 p-4">
                    <h1 className="text-[36px] font-bold">{edit ? "Edit" : view ? "View" : "Add New"} Flash Sale {view ? "Details" : ""}</h1>
                    <p className={`${error != "" ? "" : "invisible"} text-[#DB4444] my-[5px]`}>{error}</p>
                    <div className="form flex flex-col gap-[1rem]">
                        <div className="title flex flex-col w-[36.5rem]">
                            <label className="text-[#A6A6A6] font-[500]" htmlFor="title">Title<span className={`${view?"hidden":""} text-[#DB4444] ml-[2px]`}>*</span></label>
                            <input id="title" type="text" value={title} onChange={handleTitleChange} readOnly={view ? true : false} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                        </div>
                        <div className="time flex gap-[6.35rem]">
                            <div className="start-time flex flex-col">
                                <label className="text-[#A6A6A6] font-[500]" htmlFor="startTime">Start Time<span className={`${view?"hidden":""} text-[#DB4444] ml-[2px]`}>*</span></label>
                                <input id="startTime" type="datetime-local" value={startTime} onChange={handleStartTimeChange} readOnly={view ? true : false} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                            </div>
                            <div className="end-time flex flex-col">
                                <label className="text-[#A6A6A6] font-[500]" htmlFor="endTime">End Time<span className={`${view?"hidden":""} text-[#DB4444] ml-[2px]`}>*</span></label>
                                <input id="endTime" type="datetime-local" value={endTime} onChange={handleEndTimeChange} readOnly={view ? true : false} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                            </div>
                        </div>
                        <div className="products flex flex-col gap-[0.3rem] ">
                            <label className="text-[#A6A6A6] font-[500]" htmlFor="products">Products<span className={`${view?"hidden":""} text-[#DB4444] ml-[2px]`}>*</span></label>
                            <table className={`w-[36.5rem] border shadow-lg rounded-md ${flashProducts.length > 0 ? "" : "hidden"}`}>
                                <thead className='border'>
                                    <tr>

                                        <th>Product Name</th>
                                        <th>Discount %</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flashProducts.length > 0 && flashProducts.map((item, index) => (
                                        <tr className="border" key={index}>
                                            <td className="text-center py-[0.6rem]">{products && products.find((it) => it._id === item.product).title || "Unknown Product"}</td>
                                            <td className="text-center">{item.discount}</td>
                                            <td className="text-center p-2">{<button className={`bg-[#DB4444] text-white rounded-md h-max w-max cursor-pointer hover:bg-[#E07575] py-2 px-4 ${view ? "hidden" : ""}`} onClick={() => view ? "" : removeProduct(item.product)}>Cancel</button>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex items-center mt-2">
                                <button className={`${view ? "hidden" : ""} border px-3 py-1 rounded text-sm w-max h-max hover:border-black hover:border-opacity-45 ease-in-out transition duration-500`} onClick={() => setShowProducts(!showProducts)}>
                                    {showProducts ? "Cancel" : "Add Product"}
                                </button>
                                {showProducts &&
                                    <div className="ml-4 flex gap-5 items-center">
                                        <div className="flex flex-col">
                                            <label className="text-[#A6A6A6] font-[500]" htmlFor="product">Product<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                            <select id="product" value={selectedProduct} onChange={(e) => { setSelectedProduct(e.target.value); error == "Please select product from dropdown" ? setError("") : "" }} className="rounded-lg border border-[#CCC] py-[8px] px-[7px]">
                                                <option id="default" value="default" disabled hidden>Select your product</option>
                                                {products && products.map((product, index) => (
                                                    <option id={product._id} value={product._id} key={index}>{product.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[#A6A6A6] font-[500]" htmlFor="discount">Discount<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                            <input type="text" value={discount} onChange={handleDiscountChange} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                                        </div>
                                        <button className="mt-5 bg-blue-500 text-white px-3 py-2 rounded h-max w-max hover:bg-blue-400" onClick={addProduct}>
                                            Add This Product
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                        <button className="bg-[#47b2ca] text-white p-[10px] rounded-full hover:bg-[#85bcca] w-[6.5rem] " onClick={handleButtonClick}>
                            {edit ? "Save" : view ? "Edit" : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FlashSaleForm
