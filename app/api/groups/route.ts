import { eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { groups } from "@/lib/db/schema";
import { isUnauthorizedError, requireUserId } from "@/lib/session-user";
import { asString, jsonError, readJson, toPublicGroup } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  assertDatabaseConfigured();

  let userId: string;
  try {
    userId = await requireUserId();
  } catch (error) {
    if (isUnauthorizedError(error)) return jsonError("Sign in to save changes", 401);
    throw error;
  }

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
      userId: userId,
    })
    .returning();

  return Response.json(toPublicGroup(created), { status: 201 });
}

export async function GET() {
  assertDatabaseConfigured();

  let userId: string;
  try {
    userId = await requireUserId();
  } catch (error) {
    if (isUnauthorizedError(error)) return jsonError("Sign in to save changes", 401);
    throw error;
  }

  const rows = await db.select().from(groups).where(eq(groups.userId, userId));
  return Response.json(rows.map(toPublicGroup));
}
