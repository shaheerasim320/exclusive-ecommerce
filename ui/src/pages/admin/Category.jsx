import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import { DataGrid } from '@mui/x-data-grid'
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, getMainCategories, getSubCategories } from '../../slices/CategorySlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loader';

const Category = () => {
    const location = useLocation()
    const [subCategory, setSubCategory] = useState(location.pathname.includes("sub-category"))
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { mainCategories, subCategories } = useSelector(state => state.category)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setSubCategory(location.pathname.includes("sub-category"))
    }, [location.pathname.includes("sub-category")])
    useEffect(() => {
        setLoading(true)
        dispatch(getSubCategories())
        dispatch(getMainCategories())
        setLoading(false)
    }, [dispatch])

    const handleEdit = (id) => {
        navigate(`/admin/category-form?update=true${subCategory ? "&&subCategory=true" : ""}`, { state: { categoryID: id } })
    };

    const handleDelete = async (id) => {
        setLoading(true)
        await dispatch(deleteCategory({ categoryID: id })).unwrap()
        setLoading(false)
        subCategory ? await dispatch(getSubCategories()).unwrap() : await dispatch(getMainCategories()).unwrap()
        subCategory ? navigate("/admin/sub-category") : navigate("/admin/category")
    };

    const handleCategoryButtonClick = () => {
        navigate(subCategory ? "/admin/add-new-sub-category" : "/admin/add-new-category")
    }

    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        subCategory ? { field: "mainCategories", headerName: "Main Categories", flex: 1 } : {
            field: "subCategories", headerName: "Sub Categories", flex: 2.5, renderCell: (params) => {
                const value = params.value;
                return (
                    <div className="flex flex-wrap">
                        {value.map((val) => (
                            <div key={val.name} className="bg-[#979797] hover:bg-gray-700 w-fit rounded-full flex items-center justify-between px-4 text-white mr-2 mb-2 cursor-pointer">
                                <span>{val.name}</span>
                                <span className="ml-2">{val.products}</span>
                            </div>
                        ))}
                    </div>
                )
            }
        },
        { field: "products", headerName: "Products", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <div className="flex gap-2 py-[8px]">
                    <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(params.id)}>
                        Edit
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: "#DB4444", "&:hover": { backgroundColor: "#B83232" } }} size="small" onClick={() => handleDelete(params.id)}>
                        Delete
                    </Button>
                </div>
            )
        }
    ];

    useEffect(() => {
        if (location?.state?.message && !showSuccess) {
            toast.success(location.state.message);
            setShowSuccess(true);
        }
    }, [location, showSuccess]);

    return (
        <div >
            {loading && <Loader />}
            <div className={`${loading ? "hidden" : "flex"}`}>
                <AdminSidebar pageName={location.pathname.includes("sub-category") ? "sub-category" : "category"} />
                <div className="flex-1 p-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-[36px] font-bold">{subCategory ? "Sub " : ""}Category</h1>
                        <div className="wrapper flex gap-[8px]">
                            <div className="btn flex gap-[10px] items-center bg-[#47b2ca] text-white p-[7px] cursor-pointer hover:bg-[#85bcca]" onClick={handleCategoryButtonClick}>
                                <img src="/images/plus.svg" alt="add-icon" className="invert" />
                                <span>Add New {subCategory ? "Sub" : ""} Category</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid mt-[1.5rem] min-h-[150px]">
                        <DataGrid rows={subCategory ? subCategories : mainCategories} columns={columns} initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }} pageSizeOptions={[5]} pagination style={{ flexGrow: 1 }} />
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

        </div>
    )
}

export default Category
