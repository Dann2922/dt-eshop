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
  const {
    name,
    description,
    price,
    quantity,
    brand,
    category,
    inStock,
    images,
  } = body;

  const product = await prisma.product.create({
    data: body,
  });

  return NextResponse.json(product);
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const { id, inStock } = body;

  const product = await prisma.product.update({
    where: { id: id },
    data: { inStock },
  });

  return NextResponse.json(product);
}

export async function GET() {
  try {
    // Fetch all records from the "product" table
    const products = await prisma.product.findMany();

    // Return the fetched data
    return NextResponse.json(products);
  } catch (error) {
    // Handle errors gracefully
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}