import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";

getCurrentUser

export async function POST(request: Request) {

  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  if (currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }


  const body = await request.json();
  const { userId, invoiceNumber,
    dueDate, totalAmount, products, createdAt,
    updatedAt } = body;

  const invoice = await prisma.invoice.create({
    data:{
      userId, invoiceNumber, dueDate, totalAmount,
      products, createdAt, updatedAt
    },
  });
  return NextResponse.json(invoice);
}


