import prisma from "@/libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  if (currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const { name } = body;

  const brand = await prisma.brand.create({
    data: {
      name,
    },
  });

  return NextResponse.json(brand);
}

export async function GET() {
  try {
    // Fetch all records from the "brand" table
    const brands = await prisma.brand.findMany();

    // Return the fetched data
    return NextResponse.json(brands);
  } catch (error) {
    // Handle errors gracefully
    return NextResponse.json(
      { error: "Error fetching brands" },
      { status: 500 }
    );
  }
}
