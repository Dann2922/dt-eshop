import prisma from "@/libs/prismadb";

interface IParams {
  invoiceId?: string;
}

export default async function getInvoiceById(params: IParams) {
  try {
    const { invoiceId } = params;
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
    });

    if (!invoice) return null;
    return invoice;
  } catch (error: any) {
    throw new Error(error);
  }
}