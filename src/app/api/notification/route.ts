import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({ message: "prueba" });
}

export async function GET() {
  return NextResponse.json({ message: "Dentro GET" });
}
