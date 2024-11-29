import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {

  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  if (currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const { user, invoiceNumber, price, quantity, totalAmount, product, createdAt, updatedAt   } = body;

  const invoice = await prisma.invoice.create({
    data: body,
  });

  return NextResponse.json(invoice);
}


