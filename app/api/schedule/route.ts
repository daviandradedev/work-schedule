import { asc, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { employees, groups, holidays } from "@/lib/db/schema";
import { isUnauthorizedError, requireUserId } from "@/lib/session-user";
import { jsonError, toPublicEmployee, toPublicGroup, toPublicHoliday } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  assertDatabaseConfigured();

  let userId: string;
  try {
    userId = await requireUserId();
  } catch (error) {
    if (isUnauthorizedError(error)) return jsonError("Sign in to save changes", 401);
    throw error;
  }

  const [groupRows, employeeRows, holidayRows] = await Promise.all([
    db.select().from(groups).where(eq(groups.userId, userId)).orderBy(asc(groups.name)),
    db.select().from(employees).where(eq(employees.userId, userId)).orderBy(asc(employees.name)),
    db.select().from(holidays).where(eq(holidays.userId, userId)).orderBy(asc(holidays.date)),
  ]);

  return Response.json({
    groups: groupRows.map(toPublicGroup),
    employees: employeeRows.map(toPublicEmployee),
    holidays: holidayRows.map(toPublicHoliday),
  });
}
