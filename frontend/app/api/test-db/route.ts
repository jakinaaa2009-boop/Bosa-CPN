import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/test-db] DB connection failed", err);
    return NextResponse.json(
      { success: false, error: "DB connection failed" },
      { status: 500 }
    );
  }
}

