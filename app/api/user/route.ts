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
  const {name, email, createdAt, role } = body;

  const user = await prisma.user.create({
    data: body,
  });

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const { id, role } = body;

  const user = await prisma.user.update({
    where: { id: id },
    data: { role },
  });

  return NextResponse.json(user);
}
