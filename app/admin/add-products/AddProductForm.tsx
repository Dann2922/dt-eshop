"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import Input from "@/app/components/inputs/Input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import firebaseApp from "@/libs/firebase";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import axios from "axios";
import { useRouter } from "next/navigation";
import SelectBrand from "@/app/components/inputs/SelectBrand";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const AddProductForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>(null);
  const [isProductCreated, setIsProductCreated] = useState(false);
  const [brandOptions, setBrandOptions] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brandId: "",
      category: "",
      inStock: false,
      images: [],
      price: 0,
      quantity: 0,
    },
  });

  useEffect(() => {
    setCustomValue("images", images);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("/api/brand");
        const brands = response.data.map((brand: any) => ({
          value: brand.id,
          label: brand.name,
        }));
        setBrandOptions(brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast.error("Failed to load brands.");
      }
    };
    fetchBrands();
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Product Data", data);
    // upload images to fb
    // save product to mongodb
    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error("Category is not selected!");
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error("No selected image!");
    }

    const handleImageUploads = async () => {
      toast("Creating product, please wait...");
      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + "-" + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                },
                (error) => {
                  console.log("Error uploading image", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                      });
                      resolve();
                    })
                    .catch((error) => {
                      console.log("Error getting the download URL", error);
                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error handling image uploads", error);
        return toast.error("Error handling image uploads");
      }
    };


    await handleImageUploads();
    // const response = await axios.get(`/api/brand/${data.brand}`);
    // data.brand = response.data;
    const productData = { ...data, price: Number(data.price), images: uploadedImages };

    // try {
    //   await axios.post("/api/product", productData);
    //   toast.success("Product created");
    //   setIsProductCreated(true);
    //   router.refresh();
    // } catch (error) {
    //   toast.error("Something went wrong when saving product");
    // } finally {
    //   setIsLoading(false);
    // }
    try {
      await axios.post("/api/product", productData);
      toast.success("Product created");
      setIsProductCreated(true);
      // router.refresh();//refresh the page
      router.push("/admin/manage-products");//move the management page
    } catch (error: any) {
      console.error("Error saving product:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }

  };

  const category = watch("category");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }

      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter(
          (item) => item.color !== value.color
        );
        return filteredImages;
      }

      return prev;
    });
  },
    []
  );

  return (
    <>
      <Heading title="Add a Product" center />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="name"
          label="Name"
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
        <SelectBrand
          id="brandId"
          label="Brand"
          options={brandOptions}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <br />

        <Input
          id="quantity"
          label="Quanity"
          type="number"
          disabled
          value={0} // This will set the quantity to 0
          register={register} errors={errors}
        />        <br />

        <TextArea
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />        <br />

        <CustomCheckBox
          id="inStock"
          register={register}
          label="This product is in stock"
        />        <br />

        <div className="w-full font-medium">
          <div className="mb-2 font-semibold">Select a Category</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
            {categories.map((item) => {
              if (item.label === "All") {
                return null;
              }

              return (
                <div key={item.label} className="col-span">
                  <CategoryInput
                    onClick={(category) => setCustomValue("category", category)}
                    selected={category === item.label}
                    label={item.label}
                    icon={item.icon}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full flex flex-col flex-wrap gap-4">
          <div>
            <div className="font-bold">
              Select the available product colors and upload their images.
            </div>
            <div className="text-sm">
              You must upload an image for each of the color selected otherwise
              your color selection will be ignored.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {colors.map((item, index) => {
              return (
                <SelectColor
                  key={index}
                  item={item}
                  addImageToState={addImageToState}
                  removeImageFromState={removeImageFromState}
                  isProductCreated={isProductCreated}
                />
              );
            })}
          </div>
        </div>
        <Button
          label={isLoading ? "Loading..." : "Add Product"}
          onClick={handleSubmit(onSubmit)}
        />
      </form>
    </>
  );
};

export default AddProductForm;
