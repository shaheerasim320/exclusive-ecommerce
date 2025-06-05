import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Loader from '../../components/Loader';
import axios from "axios";
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import EditIcon from "@mui/icons-material/Edit";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from '@mui/x-data-grid';

const Customers = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : format(date, "MM/dd/yyyy");
  };

  const col = [
    { field: "custID", headerName: "Customer ID", flex: 1 },
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.4 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    {
      field: "status", headerName: "Status", flex: 0.7, renderCell: (params) => (
        params.value === "unverified" ? (
          <Chip label="Unverified" color="default" size="small" />
        ) : params.value === "verified" ? (
          <Chip label="Verified" color="success" size="small" />
        ) : (
          <Chip label="Blocked" color="error" size="small" />
        )
      )
    },
    {
      field: "createdAt", headerName: "Registration Date", flex: 0.7, renderCell: (params) => {
        return <span>{formatDate(params.value)}</span>;
      },
    },
    {
      field: "actions", headerName: "Actions", sortable: false, filterable: false, flex: 1.2, renderCell: (params) => (
        <Box display="flex" gap={1}>
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
          <Tooltip title="Block" enterTouchDelay={0} disableInteractive>
            <span>
              <IconButton color="error">
                <DoNotDisturbIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )
    }
  ];

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/v1/users/get-all-customers", { withCredentials: true });
        setRows(res.data);
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            // await dispatch(refreshAccessToken()).unwrap();
            const retryRes = await axios.get("http://localhost:8080/api/v1/users/get-all-customers", { withCredentials: true });
            setRows(retryRes.data);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            navigate("/login");
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div>
      {loading && <Loader />}
      <div className={`${loading ? "hidden" : "flex"}`}>
        <AdminSidebar pageName={"customers"} />
        <div className="flex-1 p-4 min-h-0">
          <div className="title-button flex items-center justify-between">
            <h1 className="text-[36px] font-bold">Customers</h1>
            <div className="wrapper flex gap-[8px]">
              <div
                className="btn flex gap-[10px] items-center bg-[#47b2ca] text-white p-[7px] cursor-pointer hover:bg-[#85bcca]">
                <img src="/images/plus.svg" alt="add-icon" className="invert" />
                <span>Add New Customer</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <DataGrid columns={col} rows={rows} pagination autoPageSize getRowId={(row) => row._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
