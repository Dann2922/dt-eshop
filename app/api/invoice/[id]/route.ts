import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  if (currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const invoice = await prisma?.invoice.delete({
    
    where: { id: params.id },
  });

  return NextResponse.json(invoice);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  if (currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const { userId, invoiceNumber,
    dueDate, totalAmount, products, createdAt,
    updatedAt } = body;

  const invoice = await prisma?.invoice.update({
    data: {userId, invoiceNumber,
        dueDate, totalAmount, products, createdAt,
        updatedAt,
    },
    where: {
      id: params.id
    }
  });

  return NextResponse.json(invoice);
}