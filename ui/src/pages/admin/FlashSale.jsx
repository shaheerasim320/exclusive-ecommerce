import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import Loader from '../../components/Loader'
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton, Chip, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box } from '@mui/material';

const FlashSale = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const res = await axios.get("http://localhost:8080/api/v1/flashSale/fetch-all-flash-sales", { withCredentials: true })
        setRow(res.data)
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            // await dispatch(refreshAccessToken()).unwrap();
            const retryRes = await axios.get("http://localhost:8080/api/v1/flashSale/fetch-all-flash-sales", { withCredentials: true })
            setRow(res.data)
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            navigate("/login");
          }
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])
  const formatDate = (dateStr) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(dateStr));


  const handleEdit = (row) => {
    navigate(`/admin/flash-sale-form?edit=true&title=${encodeURIComponent(row.title)}`, { state: { flashSaleID: row._id } });
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Delete "${row.title}"?`)) {
      console.log("Deleting", row);
      try {
        setLoading(true);
        const res = await axios.delete(`http://localhost:8080/api/v1/flashSale/delete-flash-sale/${row._id}`, { withCredentials: true })
        const nextRes = await axios.get("http://localhost:8080/api/v1/flashSale/fetch-all-flash-sales", { withCredentials: true })
        setRow(nextRes.data)
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            // await dispatch(refreshAccessToken()).unwrap();
            const retryRes = await axios.delete(`http://localhost:8080/api/v1/flashSale/delete-flash-sale/${row._id}`, { withCredentials: true })
            const nextRetryRes = await axios.get("http://localhost:8080/api/v1/flashSale/fetch-all-flash-sales", { withCredentials: true })
            setRow(nextRetryRes.data)
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            navigate("/login");
          }
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleView = (row) => {
    navigate(`/admin/flash-sale-form?view=true&title=${encodeURIComponent(row.title)}`, { state: { flashSaleID: row._id } });
  };
  const col = [
    { field: "title", headerName: "Title", flex: 1.8 },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1.3,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: "endTime",
      headerName: "End Time",
      flex: 1.3,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: "products",
      headerName: "Products",
      flex: 1,
      renderCell: (params) => `${params.value.length} product(s)`
    },
    {
      field: "isActive",
      headerName: "Is Active",
      flex: 0.8,
      renderCell: (params) =>
        params.value ? (
          <Chip label="Active" color="success" size="small" />
        ) : (
          <Chip label="Inactive" color="error" size="small" />
        )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View" enterTouchDelay={0} disableInteractive>
            <span>
              <IconButton color="info" onClick={() => handleView(params.row)}>
                <VisibilityIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Edit" enterTouchDelay={0} disableInteractive>
            <span>
              <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete" enterTouchDelay={0} disableInteractive>
            <span>
              <IconButton color="error" onClick={() => handleDelete(params.row)}>
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )
    }
  ];


  const handleAddNewFlashSaleClick = () => {
    navigate("/admin/flash-sale-form")
  }
  return (
    <div className="h-screen flex flex-col">
      {loading && <Loader />}
      {!loading && (
        <div className="flex flex-1 min-h-0">
          <AdminSidebar pageName={"flash-sale"} />
          <div className="flex-1 p-4 flex flex-col min-h-0">
            <div className="title-button flex items-center justify-between mb-4">
              <h1 className="text-[36px] font-bold">Flash Sale</h1>
              <div className="wrapper flex gap-[8px]">
                <div
                  className="btn flex gap-[10px] items-center bg-[#47b2ca] text-white p-[7px] cursor-pointer hover:bg-[#85bcca]"
                  onClick={handleAddNewFlashSaleClick}
                >
                  <img src="/images/plus.svg" alt="add-icon" className="invert" />
                  <span>Add New Flash Sale</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <DataGrid
                columns={col}
                rows={row}
                getRowId={(row) => row._id}
                loading={loading}
                autoPageSize
                pagination
                slotProps={{
                  noRowsOverlay: {
                    children: "No flash sales available",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default FlashSale
