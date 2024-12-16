import Container from "@/app/components/Container";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import ManageAccounts from "./ManageAccounts";
import getUsers from "@/actions/getUsers";

const ManageOrders = async () => {
  const currentUser = await getCurrentUser();
  const users = await getUsers();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageAccounts users={users}></ManageAccounts>
      </Container>
    </div>
  );
};

export default ManageOrders;
