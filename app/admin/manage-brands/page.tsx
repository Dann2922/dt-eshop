import Container from "@/app/components/Container";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import ManageBrandDetail from "./ManageBrandDetail";
import getBrands from "@/actions/getBrands";

const ManageBrands = async () => {
  const brands = await getBrands(); 
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageBrandDetail brands={brands} />
      </Container>
    </div>
  );
};

export default ManageBrands;
