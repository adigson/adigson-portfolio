import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !("url" in body) || typeof body.url !== "string") {
    return NextResponse.json({ error: "A URL is required." }, { status: 400 });
  }

  let destination: URL;
  try {
    destination = new URL(body.url.trim());
  } catch {
    return NextResponse.json({ error: "Enter a valid absolute URL." }, { status: 400 });
  }

  if (destination.protocol !== "http:" && destination.protocol !== "https:") {
    return NextResponse.json({ error: "Only HTTP and HTTPS URLs can be shortened." }, { status: 400 });
  }

  if (destination.href.length > 2048) {
    return NextResponse.json({ error: "The URL must be 2,048 characters or fewer." }, { status: 400 });
  }

  try {
    const sql = getDatabase();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const code = randomBytes(4).toString("base64url");
      const [link] = await sql`
        INSERT INTO short_links (code, destination_url)
        VALUES (${code}, ${destination.href})
        ON CONFLICT (code) DO NOTHING
        RETURNING code
      `;

      if (link) {
        return NextResponse.json(
          { code, shortUrl: new URL(`/s/${code}`, request.url).toString() },
          { status: 201 },
        );
      }
    }

    console.error("Short link creation failed: could not generate a unique code after three attempts.");
    return NextResponse.json({ error: "Could not create a short link. Please try again." }, { status: 503 });
  } catch (error) {
    console.error("Short link creation failed:", error);
    return NextResponse.json(
      { error: "Shortener is unavailable. Configure the database and try again." },
      { status: 503 },
    );
  }
}
