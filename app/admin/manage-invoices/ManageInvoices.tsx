"use client";

import { Invoice } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import { MdAdd, MdEdit } from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { usePathname, useRouter } from "next/navigation";
import Link from "@mui/material/Link";
import AdminNavItem from "@/app/components/admin/AdminNavItem";

interface ManageInvoicesProps {
  invoices: Invoice[];
}

const ManageInvoices: React.FC<ManageInvoicesProps> = ({ invoices }) => {
  const router = useRouter();

  const rows = invoices.map((invoice) => ({
    id: invoice.invoiceNumber, // Ensures `id` is present
    invoiceNumber: invoice.invoiceNumber,
    user: invoice.user?.name  || "Unknown",
    product: invoice.product?.name || "Unknown", // Display product name
    price: invoice.price,
    quantity: invoice.quantity,
    totalAmount: invoice.totalAmount,
    createdAt: invoice.createdAt,
    updatedAt: invoice.updatedAt,
  }));
  

  const columns: GridColDef[] = [
    { field: "invoiceNumber", headerName: "Invoice No", width: 200 },
    { field: "user", headerName: "Biller", width: 200 },
    { field: "product", headerName: "Product Name", width: 200 }, // Updated header
    { field: "price", headerName: "Price(USD)", width: 130 },
    { field: "quantity", headerName: "Quantity", width: 75},
    { field: "totalAmount", headerName: "Total Amount (USD)", width: 150 },
    { field: "createdAt", headerName: "Create Date", width: 205 },
    { field: "updatedAt", headerName: "Update Date", width: 205 },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-between gap-4 w-full">
          <ActionBtn
            icon={MdEdit}
            onClick={() => {
              router.push(`manage-invoices/${params.row.id}`);
            }}
          />
        </div>
      ),
    },
  ];

  const pathname = usePathname();

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Invoices" center />
        <Link href="/admin/add-invoices">
          <AdminNavItem
            label=""
            icon={MdAdd}
            selected={pathname === "/admin/add-invoices"}
          />
        </Link>
      </div>
      <div
        className="flex justify-center items-center w-full"
        style={{ height: 600, width: "100%" }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageInvoices;
