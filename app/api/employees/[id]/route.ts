import { and, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { employees, groups } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/api/auth";
import { asString, jsonError, readJson, toPublicEmployee } from "@/lib/api/http";

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
  const groupId = asString(body.groupId);

  if (!name || !groupId) {
    return jsonError("Name and team are required");
  }

  const [targetGroup] = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(eq(groups.id, groupId), eq(groups.userId, user.id)))
    .limit(1);

  if (!targetGroup) return jsonError("Team not found", 404);

  const [updated] = await db
    .update(employees)
    .set({ name, groupId, updatedAt: new Date() })
    .where(and(eq(employees.id, id), eq(employees.userId, user.id)))
    .returning();

  if (!updated) return jsonError("Employee not found", 404);

  return Response.json(toPublicEmployee(updated));
}

export async function DELETE(request: Request, context: RouteContext) {
  assertDatabaseConfigured();

  const user = await getCurrentUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const { id } = await context.params;

  const [deleted] = await db
    .delete(employees)
    .where(and(eq(employees.id, id), eq(employees.userId, user.id)))
    .returning({ id: employees.id });

  if (!deleted) return jsonError("Employee not found", 404);

  return new Response(null, { status: 204 });
}
