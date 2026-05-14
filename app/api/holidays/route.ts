import { db, assertDatabaseConfigured } from "@/lib/db";
import { holidays } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/api/auth";
import { asString, jsonError, readJson, toPublicHoliday } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: Request) {
  assertDatabaseConfigured();

  const user = await getCurrentUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const body = await readJson(request);
  const name = asString(body.name);
  const date = asString(body.date);
  const tag = asString(body.tag) || null;

  if (!name || !ISO_DATE.test(date)) {
    return jsonError("Valid name and date are required");
  }

  const [created] = await db
    .insert(holidays)
    .values({
      id: crypto.randomUUID(),
      name,
      date,
      tag,
      isNacional: false,
      userId: user.id,
    })
    .returning();

  return Response.json(toPublicHoliday(created), { status: 201 });
}
