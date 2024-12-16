import Container from "@/app/components/Container";
import ManageProducts from "./ManageProducts";
import getProducts from "@/actions/getProducts";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";

const ManageAllProducts = async () => {
  const products = await getProducts({ category: null });
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageProducts products={products}></ManageProducts>
      </Container>
    </div>
  );
};

export default ManageAllProducts;
