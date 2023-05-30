import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log("Dentro post notification");
  return NextResponse.json({ message: "prueba" });
}

export async function GET() {
  console.log("Dentro GET notification");

  return NextResponse.json({ message: "Dentro GET" });
}
