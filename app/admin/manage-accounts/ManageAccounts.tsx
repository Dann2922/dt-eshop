"use client";

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import {
  MdAdd,
  MdAdminPanelSettings,
  MdCached,
  MdClose,
  MdDelete,
  MdDeliveryDining,
  MdDone,
  MdEdit,
  MdPerson,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import Link from "@mui/material/Link";
import AdminNavItem from "@/app/components/admin/AdminNavItem";
import Status from "@/app/components/Status";

interface ManageAccountProps {
  accounts: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};


const ManageAccounts: React.FC<ManageAccountProps> = ({ accounts }) => {
  const router = useRouter();


  const rows = [
    {
      id:1,
      name: "NTăng Trần",
      email: "tangtran74119@gmail.com",
      date: "2024-20-11",
      role: "USER",
    },
    {
      id: 2,
      name: "Tran Ngoc Tang (FGW CT)",
      email: "tangtngcc200110@fpt.edu.vn",
      date: "2024-11-24",
      role: "ADMIN",
    },
    {
      id: 3,
      name: "Dannie Tran",
      email: "Dannie123@gmail.com",
      date: "2024-25-11",
      role: "USER",
    },
  ];

  const columns: GridColDef[] = [
    { field: "name", headerName: "Account Name", width: 300 },
    { field: "email", headerName: "Email", width: 300},
    {
      field: "date",
      headerName: "Create Date",
      width: 170,
    },
    {
      field: "state",
      headerName: "State",
      width: 120,
    renderCell: (params) => {
      // Check if the state is "ADMIN" or "USER" and render the appropriate Status component
      return params.row.role === "ADMIN" ? (
        <Status
          icon={MdAdminPanelSettings}
          text="ADMIN"
          bg="bg-teal-200"
          color="text-teal-700"
        />
      ) : (
        <Status
          icon={MdPerson}
          text="USER"
          bg="bg-rose-200"
          color="text-rose-700"
        />
      );},},
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdCached}
              onClick={() => {
                // handleToggleStock(params.row.id, params.row.inStock);
                handleAccountStateChange(params.row.id, params.row.role)
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

  const handleAccountStateChange = useCallback((accountId: string, currentState: string) => {
    // Determine the new state based on the current state
    const newState = currentState === "USER" ? "ADMIN" : "USER";
  
    // Ask for confirmation before changing the state
    const confirmationMessage = currentState === "USER"
      ? "Are you sure you want to change the account state to ADMIN?"
      : "Are you sure you want to change the account state to USER?";
    
    if (confirm(confirmationMessage)) { // Built-in confirmation dialog
      axios
        .put("/api/account", {
          accountId,
          state: newState,
        })
        .then((res) => {
          toast.success(`Account state changed to ${newState}`);
          router.refresh(); // Refresh the page or update state to reflect changes
        })
        .catch((err) => {
          toast.error("Failed to update account state");
          console.error(err);
        });
    } else {
      toast.info(`Account state remains ${currentState}`);
    }
  }, []);
  

  const pathname = usePathname();

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Accounts" center />
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

export default ManageAccounts;
