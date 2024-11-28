import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AddBrandForm from "./AddBrandForm";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";

const AddBrands = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <AddBrandForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default AddBrands;
