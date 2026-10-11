import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;

  if (!/^[\w-]{6}$/.test(code)) {
    return NextResponse.json({ error: "Short link not found." }, { status: 404 });
  }

  try {
    const sql = getDatabase();
    const [link] = await sql`
      SELECT destination_url
      FROM short_links
      WHERE code = ${code}
      LIMIT 1
    `;

    if (!link || typeof link.destination_url !== "string") {
      return NextResponse.json({ error: "Short link not found." }, { status: 404 });
    }

    const destination = new URL(link.destination_url);
    if (destination.protocol !== "http:" && destination.protocol !== "https:") {
      console.error(`Short link ${code} has an invalid destination protocol.`);
      return NextResponse.json({ error: "Short link destination is invalid." }, { status: 500 });
    }

    return NextResponse.redirect(destination, 302);
  } catch (error) {
    console.error(`Short link lookup failed for ${code}:`, error);
    return NextResponse.json(
      { error: "Shortener is unavailable. Configure the database and try again." },
      { status: 503 },
    );
  }
}
