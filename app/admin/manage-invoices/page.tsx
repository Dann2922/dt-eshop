import Container from "@/app/components/Container";
import ManageInvoices from "./ManageInvoices";
import getProducts from "@/actions/getProducts";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import getInvoices from "@/actions/getInvoices";

const ManageAllInvoices = async () => {
  const invoices = await getInvoices();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageInvoices invoices={invoices}></ManageInvoices>
      </Container>
    </div>
  );
};

export default ManageAllInvoices;