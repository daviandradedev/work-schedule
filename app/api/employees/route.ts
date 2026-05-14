import { and, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { employees, groups } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/api/auth";
import { asString, jsonError, readJson, toPublicEmployee } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  assertDatabaseConfigured();

  const user = await getCurrentUser(request);
  if (!user) return jsonError("Unauthorized", 401);

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

  const [created] = await db
    .insert(employees)
    .values({
      id: crypto.randomUUID(),
      name,
      groupId,
      userId: user.id,
    })
    .returning();

  return Response.json(toPublicEmployee(created), { status: 201 });
}
