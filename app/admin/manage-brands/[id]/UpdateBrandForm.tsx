"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import TextArea from "@/app/components/inputs/TextArea";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UpdateBrandForm = ({ brand }: { brand: any }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Fetch the brand data to prefill the form
  useEffect(() => {
    const fetchBrandData = async (data: any) => {
      try {
        setValue("name", data?.name);
        setValue("description", data?.description);
      } catch (error) {
        toast.error("Failed to fetch brand data");
        console.log("Error fetching brand data:", error);
      }
    };

    fetchBrandData(brand);
  }, [brand, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Updating Brand Data", data);
    setIsLoading(true);

    axios
      .put(`/api/brand/${brand.id}`, data)
      .then(() => {
        toast.success("Brand updated successfully");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong when updating the brand");
        console.log("Error updating brand:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Heading title="Update Brand" center />
      <Input
        id="name"
        label="Brand Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isLoading ? "Loading..." : "Update Brand"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default UpdateBrandForm;
