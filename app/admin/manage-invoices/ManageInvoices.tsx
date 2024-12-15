"use client";

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import {
  MdAdd,
  MdDelete,
  MdDeliveryDining,
  MdDone,
  MdEdit,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import Link from "@mui/material/Link";
import AdminNavItem from "@/app/components/admin/AdminNavItem";

interface ManageInvoicesProps {
  invoices: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};


const ManageInvoices: React.FC<ManageInvoicesProps> = ({ invoices }) => {
  const router = useRouter();


  const rows = [
    {
      id: 1,
      customer: "INV001",
      Product: "Laptop X200",
      price: 1200.5,
      Quantity: 2,
      date: "2024-12-01",      Total: 24,

      Updatedate: "2024-12-02",
    },
    {
      id: 2,
      customer: "INV002",
      Product: "Wireless Mouse",
      price: 25.99,
      Quantity: 5,      Total: 129.5,

      date: "2024-11-30",
      Updatedate: "2024-12-01",
    },
    {
      id: 3,
      customer: "INV003",
      Product: "Smartphone Z5",
      price: 800,
      Quantity: 1,       Total: 800,

      date: "2024-11-28",
      Updatedate: "2024-12-01",
    },
    {
      id: 4,
      customer: "INV004",
      Product: "Noise Cancelling Headphones",
      price: 199.99,
      Quantity: 3,      Total: 599.97,

      date: "2024-11-27",
      Updatedate: "2024-11-30",
    },
    {
      id: 5,
      customer: "INV005",
      Product: "4K Monitor",
      price: 350,
      Quantity: 4,
      Total: 1400,
      date: "2024-11-25",
      Updatedate: "2024-11-29",
    },
  ];

  const columns: GridColDef[] = [
    { field: "customer", headerName: "Invoice Number", width: 100 },
    { field: "Product", headerName: "Product Name", width: 130 },
    {
      field: "price",
      headerName: "Price(USD)",
      width: 130,
    },
    { field: "Quantity", headerName: "Quantity", width: 100 },
    { field: "Total", headerName: "Total Amount (USD)", width: 150 },
    {
      field: "date",
      headerName: "Create Date",
      width: 130,
    },
    {
      field: "Updatedate",
      headerName: "Update Date",
      width: 100,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdDelete}
              onClick={() => {
                // handleDelete(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdEdit}
              onClick={() => {
                router.push(`manage-brands/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleDispatch = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "dispatched",
      })
      .then((res) => {
        toast.success("Order Dispatched");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Oops! Something went wrong");
        console.log(err);
      });
  }, []);

  const handleDeliver = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "delivered",
      })
      .then((res) => {
        toast.success("Order Delivered");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Oops! Something went wrong");
        console.log(err);
      });
  }, []);

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
      <div className="flex justify-center items-center w-full"
        style={{ height: 600, width: "100%" }}>
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
