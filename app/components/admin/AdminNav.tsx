"use client";

import Link from "next/link";
import AdminNavItem from "./AdminNavItem";
import {
  MdAttachMoney,
  MdDashboard,
  MdDns,
  MdFormatListBulleted,
  MdLibraryAdd,
  MdReceipt,
} from "react-icons/md";
import { usePathname } from "next/navigation";
import Container from "../Container";

const AdminNav = () => {
  const pathname = usePathname();

  return (
    <div className="w-full shadow-sm top-20 border-b-[1px] pt-4">
      <Container>
        <div className="flex flex-row items-center justify-between md:justify-center gap-8 md:gap-12 overflow-x-auto flex-nowrap">
          <Link href="/admin">
            <AdminNavItem
              label="Summary"
              icon={MdDashboard}
              selected={pathname === "/admin"}
            />
          </Link>
          <Link href="/admin/add-brands">
            <AdminNavItem
              label="Add Invoice"
              icon={MdLibraryAdd}
              selected={pathname === "/admin/add-brands"}
            />
          </Link>
          <Link href="/admin/manage-orders">
            <AdminNavItem
              label="Manage Invoice"
              icon={MdReceipt}
              selected={pathname === "/admin/manage-orders"}
            />
          </Link>
          <Link href="/admin/manage-brands">
            <AdminNavItem
              label="Brands"
              icon={MdDns}
              selected={pathname === "/admin/manage-brands"}
            />
          </Link>
          {/* <Link href="/admin/add-products">
            <AdminNavItem
              label="Add Product"
              icon={MdLibraryAdd}
              selected={pathname === "/admin/add-products"}
            />
          </Link> */}
          <Link href="/admin/manage-products">
            <AdminNavItem
              label="Manage Products"
              icon={MdDns}
              selected={pathname === "/admin/manage-products"}
            />
          </Link>
          <Link href="/admin/manage-orders">
            <AdminNavItem
              label="Manage Orders"
              icon={MdFormatListBulleted}
              selected={pathname === "/admin/manage-orders"}
            />
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default AdminNav;
