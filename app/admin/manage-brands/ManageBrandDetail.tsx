"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import Link from "next/link";
import AdminNavItem from "@/app/components/admin/AdminNavItem";
import { MdAdd, MdCached, MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import ActionBtn from "@/app/components/ActionBtn";
import axios from "axios";
import toast from "react-hot-toast";
import { Brand } from "@prisma/client";

interface ManageBrandsProps {
  brands: Brand[]; // Only include name in the brands prop
}

const ManageBrandDetail: React.FC<ManageBrandsProps> = ({ brands }) => {
  const router = useRouter();
  // Map rows with temporary IDs
  const rows = brands.map((brand, index) => ({
    id: brand.id, // Generate a unique ID using the index
    name: brand.name,
  }));

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Brand Name", width: 180 },
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
                handleDelete(params.row.id);
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

  const handleDelete = async (id: string) => {
    toast("Deleting brand, please wait!");

    try {
      await axios.delete(`/api/brand/${id}`);
      toast.success("Brand deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete brand");
      console.error("Deleting brand error:", error);
    }
  };

  const handleAddBrand = () => {
    console.log("Add Brand button clicked");
  };

  const pathname = usePathname();

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Brands" center />
        <Link href="/admin/add-brands">
          <AdminNavItem
            label=""
            icon={MdAdd}
            selected={pathname === "/admin/add-brands"}
          />
        </Link>
      </div>
      <div style={{ height: 600, width: "100%" }}>
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

export default ManageBrandDetail;
