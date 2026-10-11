import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDatabase();
    const entries = await sql`
      SELECT id, name, message, created_at
      FROM guestbook_entries
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Guestbook read failed:", error);
    return NextResponse.json(
      { error: "Guestbook is unavailable. Configure the database and try again." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("name" in body) ||
    !("message" in body) ||
    typeof body.name !== "string" ||
    typeof body.message !== "string"
  ) {
    return NextResponse.json({ error: "A name and message are required." }, { status: 400 });
  }

  const name = body.name.trim();
  const message = body.message.trim();

  if (!name || name.length > 60 || !message || message.length > 500) {
    return NextResponse.json(
      { error: "Name must be 1-60 characters and message 1-500 characters." },
      { status: 400 },
    );
  }

  try {
    const sql = getDatabase();
    const [entry] = await sql`
      INSERT INTO guestbook_entries (name, message)
      VALUES (${name}, ${message})
      RETURNING id, name, message, created_at
    `;

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Guestbook write failed:", error);
    return NextResponse.json(
      { error: "Could not save your message. Check the database setup and try again." },
      { status: 503 },
    );
  }
}
