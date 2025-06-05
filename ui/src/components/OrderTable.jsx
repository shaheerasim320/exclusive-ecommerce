import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const OrderTable = () => {
    const columns = [
        { field: "customer", headerName: "Customer", flex: 1 },
        { field: "date", headerName: "Date", flex: 1 },
        { field: "price", headerName: "Price", flex: 1 },
        { field: "product", headerName: "Product", flex: 2 }
    ];

    const rows = [
        { id: 1, customer: "Alex", date: "4/2/2025", price: "$1476.00", product: "Microsoft Surface 7" },
        { id: 2, customer: "Bob", date: "4/1/2025", price: "$200.00", product: "Keyboard" }
    ];

    return (
        <div style={{ height: 250, width: "100%" }}>
            <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10, 20]} pagination />
        </div>
    );
};

export default OrderTable;
