"use client";

import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import { useRouter } from "next/navigation";

const AddBrandForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await axios.post("/api/brand", data);
      toast.success("Brand added successfully");
      router.push("/admin/manage-brands"); //move the management page
    } catch (error) {
      console.error("Error adding brand:", error);
      toast.error("Something went wrong when adding the brand");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Heading title="Add a Brand" center />
      <Input
        id="name"
        label="Brand Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isLoading ? "Loading..." : "Add Brand"}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default AddBrandForm;
