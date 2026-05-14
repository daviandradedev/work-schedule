import { and, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { groups } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/api/auth";
import { asString, jsonError, readJson, toPublicGroup } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  assertDatabaseConfigured();

  const user = await getCurrentUser(request);
  if (!user) return jsonError("Unauthorized", 401);

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
    .where(and(eq(groups.id, id), eq(groups.userId, user.id)))
    .returning();

  if (!updated) return jsonError("Group not found", 404);

  return Response.json(toPublicGroup(updated));
}

export async function DELETE(request: Request, context: RouteContext) {
  assertDatabaseConfigured();

  const user = await getCurrentUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const { id } = await context.params;

  const [deleted] = await db
    .delete(groups)
    .where(and(eq(groups.id, id), eq(groups.userId, user.id)))
    .returning({ id: groups.id });

  if (!deleted) return jsonError("Group not found", 404);

  return new Response(null, { status: 204 });
}
