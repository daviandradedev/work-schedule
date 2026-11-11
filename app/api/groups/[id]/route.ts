import { and, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { groups } from "@/lib/db/schema";
import { isUnauthorizedError, requireUserId } from "@/lib/session-user";
import { asString, jsonError, readJson, toPublicGroup } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  assertDatabaseConfigured();

  let userId: string;
  try {
    userId = await requireUserId();
  } catch (error) {
    if (isUnauthorizedError(error)) return jsonError("Sign in to save changes", 401);
    throw error;
  }

  const { id } = await context.params;
  const body = await readJson(request);
  const name = asString(body.name);
  const color = asString(body.color);

  if (!name || !color) {
    return jsonError("Name and color are required");
  }

  const [updated] = await db
    .update(groups)
    .set({ name, color, updatedAt: new Date() })
    .where(and(eq(groups.id, id), eq(groups.userId, userId)))
    .returning();

  if (!updated) return jsonError("Group not found", 404);

  return Response.json(toPublicGroup(updated));
}

export async function DELETE(_request: Request, context: RouteContext) {
  assertDatabaseConfigured();

  let userId: string;
  try {
    userId = await requireUserId();
  } catch (error) {
    if (isUnauthorizedError(error)) return jsonError("Sign in to save changes", 401);
    throw error;
  }

  const { id } = await context.params;

  const [deleted] = await db
    .delete(groups)
    .where(and(eq(groups.id, id), eq(groups.userId, userId)))
    .returning({ id: groups.id });

  if (!deleted) return jsonError("Group not found", 404);

  return new Response(null, { status: 204 });
}
