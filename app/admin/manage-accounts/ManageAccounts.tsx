"use client";

import { User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import { MdAdminPanelSettings, MdCached, MdPerson } from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import Status from "@/app/components/Status";

interface ManageAccountsProps {
  users: User[];
}

const ManageAccounts: React.FC<ManageAccountsProps> = ({ users }) => {
  const router = useRouter();

  const rows = users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
    };
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 1, hideable: true },
    { field: "name", headerName: "Account Name", width: 300 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "createdAt",
      headerName: "Create Date",
      width: 205,
    },

    {
      field: "role",
      headerName: "State",
      width: 150,
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
        );
      },
    },
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
                handleAccountRoleChange(params.row.id, params.row.role);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleAccountRoleChange = useCallback(
    (id: string, currentRole: string) => {
      // Determine the new role based on the current role
      const newRole = currentRole === "USER" ? "ADMIN" : "USER";

      // Ask for confirmation before changing the role
      const confirmationMessage =
        currentRole === "USER"
          ? "Are you sure you want to change the account role to ADMIN?"
          : "Are you sure you want to change the account role to USER?";

      if (confirm(confirmationMessage)) {
        axios
          .put("/api/user", {
            id,
            role: newRole,
          })
          .then((res) => {
            toast.success(`Account role changed to ${newRole}`);
            router.refresh();
          })
          .catch((err) => {
            toast.error("Failed to change the account role");
            console.error(err);
          });
      } else {
        toast.success(`Account role remains ${currentRole}`);
      }
    },
    []
  );

  const pathname = usePathname();

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Accounts" center />
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

export default ManageAccounts;
