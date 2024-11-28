import prisma from "@/libs/prismadb";
import { Brand } from "@prisma/client";

interface IParams {
  brandId?: string;
}

export default async function getBrandById(params: IParams) {
  try {
    const { brandId } = params;
    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId
      }
    })
    if (!brand) {
      return null;
    }
    return brand;
  } catch (error: any) {
    throw new Error(error);
  }
}
