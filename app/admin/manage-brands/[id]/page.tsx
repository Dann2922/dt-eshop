import Container from "@/app/components/Container";
// import ProductDetails from "./ProductDetails";
// import ListRating from "./ListRating";
// import { products } from "@/utils/products";
import NullData from "@/app/components/NullData";
// import AddRating from "./AddRating";
import getCurrentUser from "@/actions/getCurrentUser";

import FormWrap from "@/app/components/FormWrap";
import getBrandById from "@/actions/getBrandById";
import UpdateBrandForm from "./UpdateBrandForm";

interface IPrams {
    brandId?: string;
}

const Product = async ({ params }: { params: IPrams }) => {
    console.log(params)
    const brand = await getBrandById(params)
    const user = await getCurrentUser()

    if (!brand) return <NullData title="Oops! Brand with the given id does not exist" />

    return (
        <div className="p-8">
            <Container>
                <FormWrap>
                    <UpdateBrandForm brand={brand} />
                </FormWrap>
            </Container >
        </div >
    );
};

export default Product;
