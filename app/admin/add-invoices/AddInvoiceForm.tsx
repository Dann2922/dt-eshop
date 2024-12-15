"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import TextArea from "@/app/components/inputs/TextArea";
import Button from "@/app/components/Button";
import SelectProduct from "@/app/components/inputs/SelectProduct";


interface AddInvoiceFormProps {
  currentUser: any;
}

const AddInvoiceForm = ({ currentUser }: { currentUser: any }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isInvoiceCreated, setIsInvoiceCreated] = useState(false);
  // const [productOptions, setProductOptions] = useState([]);
  const productOptions = [
    { value: "1", label: "iPhone 16" },
    { value: "2", label: "Airpods 2" },
    { value: "3", label: "Macbook air M2" },
    { value: "4", label: "Product 4" },
  ];
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      userId: "",
      invoiceNumber: "",
      totalAmount: "",
      products: [],
      createdAt: "",
      updatedAt: "",
    },
  });

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await axios.get("/api/product");
  //       const products = response.data.map((product: any) => ({
  //         value: product.id,
  //         label: product.name,
  //       }));
  //       setProductOptions(products);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //       toast.error("Failed to load products.");
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  useEffect(() => {
    if (isInvoiceCreated) {
      reset();
      setIsInvoiceCreated(false);
    }
  }, [isInvoiceCreated]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Invoice Data", data);

    const invoiceData = { ...data, price: Number(data.price) };

    try {
      await axios.post("/api/invoice", invoiceData);
      toast.success("Invoice created");
      setIsInvoiceCreated(true);
      router.push("/admin/manage-invoices");
    } catch (error: any) {
      console.error("Error saving invoice:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }

  };

  const Horizontal = () => {
    return <hr className="w-[30%] my-2" />;
  };


  return (
    <>
      <Heading title="Add Invoice" center />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="userId"
          label=""
          value={currentUser?.id}
          disabled
          type="hidden"
          register={register}
          errors={errors}
        />
        <br />
        <Input
          id="invoiceNumber"
          label="Invoice Number"
          disabled
          type="text"
          register={register}
          errors={errors}

        />
        <br />
        <SelectProduct
          id="productId"
          label="Product"
          options={productOptions}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        /> 
        <br />
        <Input
          id="price"
          label="Price"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="number"
          required
        />
        <br />

        <Input
          id="quantity"
          label="Quantity"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="number"
          required
        />
        <br />

        <Input
          id="totalAmount"
          label="Total Disbursement"
          type="text"
          disabled
          value={0}
          register={register} errors={errors}
        />
        <br />
        <Button
          label={isLoading ? "Loading..." : "Add Invoice"}
          onClick={handleSubmit(onSubmit)}
        />
      </form>
    </>
  );
};

export default AddInvoiceForm;
