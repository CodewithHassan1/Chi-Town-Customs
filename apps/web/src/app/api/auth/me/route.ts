import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("chitown_session")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const session = verifyToken(token);
    return NextResponse.json({ user: session });
  } catch (error: any) {
    return NextResponse.json({ user: null, error: error.message }, { status: 200 });
  }
}
