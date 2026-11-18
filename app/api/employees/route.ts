import { and, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { employees, groups } from "@/lib/db/schema";
import { isUnauthorizedError, requireUserId } from "@/lib/session-user";
import { asString, jsonError, readJson, toPublicEmployee } from "@/lib/api/http";

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

  const [created] = await db
    .insert(employees)
    .values({
      id: crypto.randomUUID(),
      name,
      groupId,
      userId: userId,
    })
    .returning();

  return Response.json(toPublicEmployee(created), { status: 201 });
}
