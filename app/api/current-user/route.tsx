import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ userId: currentUser.id });
}
