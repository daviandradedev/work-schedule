import { eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { groups } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/api/auth";
import { asString, jsonError, readJson, toPublicGroup } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  assertDatabaseConfigured();

  const user = await getCurrentUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const body = await readJson(request);
  const name = asString(body.name);
  const color = asString(body.color);

  if (!name || !color) {
    return jsonError("Name and color are required");
  }

  const [created] = await db
    .insert(groups)
    .values({
      id: crypto.randomUUID(),
      name,
      color,
      userId: user.id,
    })
    .returning();

  return Response.json(toPublicGroup(created), { status: 201 });
}

export async function GET(request: Request) {
  assertDatabaseConfigured();

  const user = await getCurrentUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const rows = await db.select().from(groups).where(eq(groups.userId, user.id));
  return Response.json(rows.map(toPublicGroup));
}
