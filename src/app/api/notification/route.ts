import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams);
  return NextResponse.json({ message: "prueba" });
}

export async function GET() {
  return NextResponse.json({ message: "Dentro GET" });
}
