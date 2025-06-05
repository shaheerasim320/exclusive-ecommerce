import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import { DataGrid } from '@mui/x-data-grid'
import { toast, ToastContainer } from 'react-toastify'
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchAllProducts } from '../../slices/productSlice';
import Loader from '../../components/Loader';
import { useLocation, useNavigate } from 'react-router-dom';

const Products = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false);
  const { allProducts, loading } = useSelector(state => state.products)
  const [row, setRow] = useState([])

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  useEffect(() => {
    if (location?.state?.message && !showSuccess) {
      toast.success(location.state.message);
      setShowSuccess(true);
    }
  }, [location, showSuccess]);

  const handleEdit = (productID) => {
    navigate("/admin/product-form?edit=true", { state: { productID: productID } })
  }
  const handleDelete = async (productID) => {
    console.log(productID)
    await dispatch(deleteProduct({ productID: productID })).unwrap()
    await dispatch(fetchAllProducts()).unwrap()
  }

  const handleAddProductClick = () => {
    navigate("/admin/product-form?create=true")
  }

  useEffect(() => {
    if (allProducts) {
      let productsArr = []
      allProducts.map(product => {
        const productItem = {
          id: product._id,
          product: product.mainImage,
          storeName: product.storeName,
          name: product.title,
          price: product.price,
          discount: product.discount,
          purchased: product.salesVolume,
          stock: product.stock,
          onFlashSale: product.onFlashSale
        }
        productsArr.push(productItem)
      })
      setRow(productsArr)
    }
  }, [allProducts])
  const columns = [
    {
      field: "product", headerName: "Product", flex: 1, renderCell: (params) => (
        <img src={params.value} alt="product" style={{ objectFit: "contain", borderRadius: 8, height: 40, width: 35, padding: 4 }} />
      )
    },
    { field: "storeName", headerName: "Store Name", flex: 1.4 },
    { field: "name", headerName: "Name", flex: 2.25 },
    { field: "price", headerName: "Price", flex: 1 },
    {
      field: "discount", headerName: "Discount", flex: 1.25, renderCell: (param) => {
        const value = param.value
        return (
          value > 0 ? <span>{value + " % OFF"}</span> : <span>No Discount</span>
        )
      }
    },
    { field: "purchased", headerName: "Purchased", flex: 1 },
    {
      field: "stock", headerName: "Stock", flex: 0.75, renderCell: (params) => {
        const value = params.value;
        let color = "black";
        if (value <= 5) color = "red";
        else if (value <= 10) color = "orange";
        else color = "green";

        return (
          <span style={{ color, fontWeight: "bold", }}>{value}</span>
        );
      }
    },
    {
      field: "onFlashSale", headerName: "On Flash Sale", flex: 1.25, renderCell: (params) => (
        <span
          style={{
            color: params.value ? "green" : "gray",
            padding: "4px 8px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          {params.value ? "Yes" : "No"}
        </span>
      )
    },
    {
      field: "actions", headerName: "Actions", flex: 2, renderCell: (params) => (
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
  ]
  return (
    <div className="h-screen flex flex-col">
      {loading && <Loader />}
      {!loading && (
        <div className="flex flex-1 min-h-0">
          <AdminSidebar pageName={"products"} />
          <div className="flex-1 p-4 flex flex-col min-h-0">
            <div className="title-button flex items-center justify-between">
              <h1 className="text-[36px] font-bold">Product</h1>
              <div className="wrapper flex gap-[8px]">
                <div
                  className="btn flex gap-[10px] items-center bg-[#47b2ca] text-white p-[7px] cursor-pointer hover:bg-[#85bcca]"
                  onClick={handleAddProductClick}
                >
                  <img src="/images/plus.svg" alt="add-icon" className="invert" />
                  <span>Add New Product</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 mt-[1.5rem]">
              <DataGrid
                rows={row}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                pageSizeOptions={[10]}
                pagination
              />
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
      )}
    </div>
  );
}

export default Products
