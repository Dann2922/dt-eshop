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

  const user = await prisma?.user.delete({
    where: { id: params.id },
  });

  return NextResponse.json(user);
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
  const {name, email, createdAt, role } = body;

  const user = await prisma?.user.update({
    data: {
      name,
      email,
      createdAt,
      role,
    },
    where: {
      id: params.id,
    },
  });

  return NextResponse.json(user);
}

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
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  return NextResponse.json(user);
}
