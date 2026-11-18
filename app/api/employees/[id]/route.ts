import { and, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { employees, groups } from "@/lib/db/schema";
import { isUnauthorizedError, requireUserId } from "@/lib/session-user";
import { asString, jsonError, readJson, toPublicEmployee } from "@/lib/api/http";

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
  const groupId = asString(body.groupId);

  if (!name || !groupId) {
    return jsonError("Name and team are required");
  }

  const [targetGroup] = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(eq(groups.id, groupId), eq(groups.userId, userId)))
    .limit(1);

  if (!targetGroup) return jsonError("Team not found", 404);

  const [updated] = await db
    .update(employees)
    .set({ name, groupId, updatedAt: new Date() })
    .where(and(eq(employees.id, id), eq(employees.userId, userId)))
    .returning();

  if (!updated) return jsonError("Employee not found", 404);

  return Response.json(toPublicEmployee(updated));
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
    .delete(employees)
    .where(and(eq(employees.id, id), eq(employees.userId, userId)))
    .returning({ id: employees.id });

  if (!deleted) return jsonError("Employee not found", 404);

  return new Response(null, { status: 204 });
}
