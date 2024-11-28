import Container from "@/app/components/Container";
// import ProductDetails from "./ProductDetails";
// import ListRating from "./ListRating";
// import { products } from "@/utils/products";
import getProductById from "@/actions/getProductById";
import NullData from "@/app/components/NullData";
// import AddRating from "./AddRating";
import getCurrentUser from "@/actions/getCurrentUser";
import UpdateProductForm from "./UpdateProductForm";
import FormWrap from "@/app/components/FormWrap";

interface IPrams {
    productId?: string;
}

const Product = async ({ params }: { params: IPrams }) => {

    const product = await getProductById(params)
    const user = await getCurrentUser()

    if (!product) return <NullData title="Oops! Product with the given id does not exist" />

    return (
        <div className="p-8">
            <Container>
                <FormWrap>
                    <UpdateProductForm product={product} />
                </FormWrap>
            </Container >
        </div >
    );
};

export default Product;
