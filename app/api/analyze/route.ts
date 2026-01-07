import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content } = await req.json();

  const prompt = `
Extract ONLY valid records.

A valid record must contain:
- name
- football_team
- phone (Myanmar or international)

Rules:
- Missing field → discard
- Normalize phone to digits only
- Output JSON ONLY

Format:
{
  "records": [
    { "name": "", "football_team": "", "phone": "" }
  ]
}

TEXT:
${content}
`;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();

  let parsed = { records: [] };
  try {
    parsed = JSON.parse(
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
    );
  } catch {}

  return NextResponse.json(parsed);
}
