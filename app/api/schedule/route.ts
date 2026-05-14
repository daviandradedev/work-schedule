import { asc, eq } from "drizzle-orm";
import { db, assertDatabaseConfigured } from "@/lib/db";
import { employees, groups, holidays } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/api/auth";
import { jsonError, toPublicEmployee, toPublicGroup, toPublicHoliday } from "@/lib/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  assertDatabaseConfigured();

  const user = await getCurrentUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const [groupRows, employeeRows, holidayRows] = await Promise.all([
    db.select().from(groups).where(eq(groups.userId, user.id)).orderBy(asc(groups.name)),
    db.select().from(employees).where(eq(employees.userId, user.id)).orderBy(asc(employees.name)),
    db.select().from(holidays).where(eq(holidays.userId, user.id)).orderBy(asc(holidays.date)),
  ]);

  return Response.json({
    groups: groupRows.map(toPublicGroup),
    employees: employeeRows.map(toPublicEmployee),
    holidays: holidayRows.map(toPublicHoliday),
  });
}
