"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import SelectProduct from "@/app/components/inputs/SelectProduct";
import { v4 as uuidv4 } from "uuid";
import { log } from "console";

const AddInvoiceForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [productsOptions, setProductOptions] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState<
    number | null
  >(null);

  // Fetch the current user's ID
  const getCurrentUserId = async () => {
    try {
      const response = await axios.get("/api/current-user");
      setUserId(response.data.userId); // Set userId in state
    } catch (error) {
      console.error("Error fetching user ID:", error);
      toast.error("Failed to fetch current user ID.");
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      userId: null,
      invoiceNumber: uuidv4(),
      price: 0,
      quantity: 0,
      totalAmount: 0,
      productId: "",
    },
  });

  const price = watch("price");
  const quantity = watch("quantity");
  const productId = watch("productId");

  useEffect(() => {
    setValue("totalAmount", price * quantity || 0); // Update totalAmount dynamically
  }, [price, quantity, setValue]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        const products = response.data.map((product: any) => ({
          value: product.id,
          label: product.name,
        }));
        setProductOptions(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products.");
      }
    };

    fetchProducts();
    getCurrentUserId(); // Fetch current user ID
  }, []);

  useEffect(() => {
    if (userId) {
      setValue("userId", userId); // Update userId in form once fetched
    }
  }, [userId, setValue]);

  useEffect(() => {
    if (productId) {
      // Fetch the product quantity when the product is selected
      const fetchProductQuantity = async () => {
        try {
          const response = await axios.get(`/api/product/${productId}`);
          setSelectedProductQuantity(response.data.quantity); // Update the quantity state
        } catch (error) {
          console.error("Error fetching product quantity:", error);
          toast.error("Failed to fetch product quantity.");
        }
      };

      fetchProductQuantity();
    }
  }, [productId]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      // Ensure price and quantity are numbers
      const formattedData = {
        ...data,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity, 10),
        totalAmount: parseFloat(data.totalAmount), // Optional: to ensure it's a number
      };

      // Create the invoice
      const response = await axios.post("/api/invoice", formattedData);

      // After the invoice is created, update the product quantity
      if (selectedProductQuantity !== null && productId) {
        const newQuantity = selectedProductQuantity + formattedData.quantity; // Add the quantity

        console.log("Selected Product Quantity:", selectedProductQuantity);
        console.log("Quantity from Invoice:", formattedData.quantity);
        console.log("New Quantity:", newQuantity);

        // Update the product quantity in the database
        await axios.put(`/api/product/update-quantity/${productId}`, { quantity: newQuantity });

        toast.success("Invoice created and product quantity updated");
      }
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

  return (
    <>
      <Heading title="Add an Invoice" center />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden userId field */}
        <input type="hidden" {...register("userId")} />

        {/* Invoice Number (disabled) */}
        <Input
          id="invoiceNumber"
          label="Invoice Number"
          disabled
          value={watch("invoiceNumber")}
          register={register}
          errors={errors}
        />
        <br />

        {/* Price */}
        <Input
          id="price"
          label="Price"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <br />

        {/* Quantity */}
        <Input
          id="quantity"
          label="Quantity"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <br />

        {/* Product Selection */}
        <SelectProduct
          id="productId"
          label="Product"
          options={productsOptions}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <br />

        {/* Total Amount (disabled) */}
        <Input
          id="totalAmount"
          label="Total Amount"
          disabled
          value={watch("totalAmount")}
          register={register}
          errors={errors}
        />
        <br />

        {/* Submit Button */}
        <Button
          label={isLoading ? "Loading..." : "Add Invoice"}
          onClick={handleSubmit(onSubmit)}
        />
      </form>
    </>
  );
};

export default AddInvoiceForm;
