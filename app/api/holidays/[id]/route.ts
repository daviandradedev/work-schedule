import { and, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { holidays } from "@/lib/db/schema";
import { isUnauthorizedError, requireUserId } from "@/lib/session-user";
import { asString, jsonError, readJson, toPublicHoliday } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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
  const date = asString(body.date);
  const tag = asString(body.tag) || null;

  if (!name || !ISO_DATE.test(date)) {
    return jsonError("Valid name and date are required");
  }

  const [updated] = await db
    .update(holidays)
    .set({ name, date, tag, updatedAt: new Date() })
    .where(and(eq(holidays.id, id), eq(holidays.userId, userId)))
    .returning();

  if (!updated) return jsonError("Holiday not found", 404);

  return Response.json(toPublicHoliday(updated));
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
    .delete(holidays)
    .where(and(eq(holidays.id, id), eq(holidays.userId, userId)))
    .returning({ id: holidays.id });

  if (!deleted) return jsonError("Holiday not found", 404);

  return new Response(null, { status: 204 });
}
