import prisma from "@/libs/prismadb";

export default async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        product: {
          // Assuming you have a `product` relation in your model
          select: { name: true },
        },
        user: {
          select: { name: true },
        },
      },
    });

    // Add a unique `id` field to each invoice
    const formattedInvoices = invoices.map((invoice) => ({
      ...invoice,
      id: invoice.invoiceNumber, // Use `invoiceNumber` as the unique `id`
    }));

    return formattedInvoices;
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    throw new Error("Failed to fetch invoices");
  }
}
