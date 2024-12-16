import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  if (currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    userId,
    invoiceNumber,
    price,
    quantity,
    totalAmount,
    product,
    createdAt,
    updatedAt,
  } = body;

  const invoice = await prisma?.invoice.update({
    data: {
      userId,
      invoiceNumber,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      totalAmount: parseFloat(totalAmount),
      product,
      createdAt,
      updatedAt,
    },
    where: {
      id: params.id,
    },
  });

  return NextResponse.json(invoice);
}

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser) return NextResponse.error();

//   if (currentUser.role !== "ADMIN") {
//     return NextResponse.error();
//   }

//   // Check if prisma is defined
//   if (!prisma) {
//     return NextResponse.error();
//   }

//   const invoice = await prisma.invoice.findUnique({ where: { id: params.id } });
//   return NextResponse.json(invoice);
// }

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  if (currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  // Check if prisma is defined
  if (!prisma) {
    return NextResponse.error();
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      product: { select: { name: true } }, // Include product data (name)
      user: { select: { name: true } },
    },
  });

  return NextResponse.json(invoice);
}
