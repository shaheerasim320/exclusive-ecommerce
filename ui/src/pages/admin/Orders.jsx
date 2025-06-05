import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import Loader from '../../components/Loader'
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Orders = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd');
  };
  const statusMap = {
    "pending": { label: "Pending", color: "default" },
    "processing": { label: "Processing", color: "info" },
    "shipped": { label: "Shipped", color: "primary" },
    "delivered": { label: "Delivered", color: "success" },
    "cancelled": { label: "Cancelled", color: "error" },
    "completed": { label: "Completed", color: "success" },
    "returned": { label: "Returned", color: "warning" },
    "refunded": { label: "Refunded", color: "secondary" },
    "failed": { label: "Failed", color: "error" },
    "under-review": { label: "Under Review", color: "grey" },
  };
  const col = [
    { field: "orderId", headerName: "Order ID", flex: 1 },
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "orderStatus", headerName: "Order Status", flex: 1, renderCell: (params) => {
        const status = statusMap[params.value] || { label: "Unknown", color: "default" };

        return <Chip label={status.label} color={status.color} size="small" />;
      }
    },
    {
      field: "paymentStatus", headerName: "Payment Status", flex: 0.8, renderCell: (params) => {
        return (
          params.value === "pending" ? (
            <Chip label="Pending" color="default" size="small" />
          ) : params.value === "paid" ? (
            <Chip label="Paid" color="success" size="small" />
          ) : params.value === "failed" ? (
            <Chip label="Failed" color="error" size="small" />
          ) : params.value === "cancelled" ? (
            <Chip label="Cancelled" color="error" size="small" />
          ) : params.value === "refunded" ? (
            <Chip label="Refunded" color="secondary" size="small" />
          ) : params.value === "in-progress" ? (
            <Chip label="In Progress" color="info" size="small" />
          ) : params.value === "declined" ? (
            <Chip label="Declined" color="warning" size="small" />
          ) : params.value === "under-review" ? (
            <Chip label="Under Review" color="grey" size="small" />
          ) : (
            <Chip label="Unknown" color="default" size="small" />
          )
        );
      }
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      flex: 1,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 0.9,
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={0.3}>
          <Tooltip title="View" enterTouchDelay={0} disableInteractive>
            <span>
              <IconButton color="info">
                <VisibilityIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Edit" enterTouchDelay={0} disableInteractive>
            <span>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Cancel" enterTouchDelay={0} disableInteractive>
            <span>
              <IconButton color="error">
                <CancelIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ]
  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/v1/orders/get-all-orders", {
          withCredentials: true,
        });
        setRows(res.data);
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            // await dispatch(refreshAccessToken()).unwrap();
            const retryRes = await axios.get("http://localhost:8080/api/v1/orders/get-all-orders", { withCredentials: true });
            const preparedRows = res.data.map(order => ({
              ...order,
              totalAmount: calculateTotalAmount(order.products),
            }));
            console.log(preparedRows)
            setRows(preparedRows);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            navigate("/login");
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);
  return (
    <div>
      {loading && <Loader />}
      <div className={`${loading ? "hidden" : "flex"}`}>
        <AdminSidebar pageName={"orders"} />
        <div className="flex-1 p-4 min-h-0">
          <div className="title-button flex items-center justify-between">
            <h1 className="text-[36px] font-bold">Orders</h1>
            <div className="wrapper flex gap-[8px]">
              <div
                className="btn flex gap-[10px] items-center bg-[#47b2ca] text-white p-[7px] cursor-pointer hover:bg-[#85bcca]">
                <img src="/images/plus.svg" alt="add-icon" className="invert" />
                <span>Add New Order</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <DataGrid columns={col} rows={rows} pageSizeOptions={[10, 20, 50]} pagination getRowId={(row) => row._id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
