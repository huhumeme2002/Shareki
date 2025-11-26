import { db } from "@/db";
import { keys } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET - Lấy key theo type
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  
  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }

  const result = await db.select().from(keys).where(eq(keys.type, type)).limit(1);
  
  if (result.length === 0) {
    return NextResponse.json({ key: null });
  }

  return NextResponse.json({ key: result[0] });
}

// POST - Tạo hoặc cập nhật key
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, keyValue } = body;

  if (!type || !keyValue) {
    return NextResponse.json({ error: "Type and keyValue are required" }, { status: 400 });
  }

  // Xóa key cũ nếu có
  await db.delete(keys).where(eq(keys.type, type));

  // Tạo key mới
  const result = await db.insert(keys).values({
    type,
    keyValue,
    usesRemaining: 3,
  }).returning();

  return NextResponse.json({ key: result[0] });
}

// PATCH - Giảm số lượt sử dụng
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { type } = body;

  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }

  const existing = await db.select().from(keys).where(eq(keys.type, type)).limit(1);
  
  if (existing.length === 0) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  const newUses = existing[0].usesRemaining - 1;

  const result = await db.update(keys)
    .set({ usesRemaining: newUses, updatedAt: new Date() })
    .where(eq(keys.type, type))
    .returning();

  return NextResponse.json({ key: result[0] });
}

// DELETE - Xóa key
export async function DELETE(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");

  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }

  await db.delete(keys).where(eq(keys.type, type));

  return NextResponse.json({ success: true });
}
