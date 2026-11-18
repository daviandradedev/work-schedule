import { Employee, Group, Holiday } from "@/lib/types/types";
import { EmployeeRow, GroupRow, HolidayRow } from "@/lib/db/schema";

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function readJson(request: Request) {
  try {
    const body = await request.json();
    return isRecord(body) ? body : {};
  } catch {
    return {};
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function toPublicGroup(row: GroupRow): Group {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    user_id: row.userId,
  };
}

export function toPublicEmployee(row: EmployeeRow): Employee {
  return {
    id: row.id,
    name: row.name,
    groupId: row.groupId,
    user_id: row.userId,
  };
}

export function toPublicHoliday(row: HolidayRow): Holiday {
  return {
    id: row.id,
    date: row.date,
    name: row.name,
    isNacional: row.isNacional,
    tag: row.tag ?? undefined,
    user_id: row.userId,
  };
}
