import { and, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { holidays } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/api/auth";
import { asString, jsonError, readJson, toPublicHoliday } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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
  const date = asString(body.date);
  const tag = asString(body.tag) || null;

  if (!name || !ISO_DATE.test(date)) {
    return jsonError("Valid name and date are required");
  }

  const [updated] = await db
    .update(holidays)
    .set({ name, date, tag, updatedAt: new Date() })
    .where(and(eq(holidays.id, id), eq(holidays.userId, user.id)))
    .returning();

  if (!updated) return jsonError("Holiday not found", 404);

  return Response.json(toPublicHoliday(updated));
}

export async function DELETE(request: Request, context: RouteContext) {
  assertDatabaseConfigured();

  const user = await getCurrentUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const { id } = await context.params;

  const [deleted] = await db
    .delete(holidays)
    .where(and(eq(holidays.id, id), eq(holidays.userId, user.id)))
    .returning({ id: holidays.id });

  if (!deleted) return jsonError("Holiday not found", 404);

  return new Response(null, { status: 204 });
}
