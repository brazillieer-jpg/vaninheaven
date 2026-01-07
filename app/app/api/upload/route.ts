import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const text = await file.text();

  return NextResponse.json({
    content: text.slice(0, 12000),
  });
}
