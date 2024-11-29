import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AddInvoiceForm from "./AddInvoiceForm";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";

const AddInvoices = async () => {
  const currentUser = await getCurrentUser();
  console.log("currentUser", currentUser)

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <AddInvoiceForm currentUser={currentUser} />
        </FormWrap>
      </Container>
    </div>
  );
};

export default AddInvoices;