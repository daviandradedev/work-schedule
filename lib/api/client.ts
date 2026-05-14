import { Employee, Group, Holiday } from "@/lib/types/types";

type JsonBody = Record<string, unknown>;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = typeof payload.error === "string" ? payload.error : "Request failed";
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getScheduleData() {
  return request<{ groups: Group[]; employees: Employee[]; holidays: Holiday[] }>("/api/schedule");
}

export function createGroup(body: Pick<Group, "name" | "color">) {
  return request<Group>("/api/groups", {
    method: "POST",
    body: JSON.stringify(body satisfies JsonBody),
  });
}

export function updateGroup(id: string, body: Pick<Group, "name" | "color">) {
  return request<Group>(`/api/groups/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body satisfies JsonBody),
  });
}

export function deleteGroup(id: string) {
  return request<void>(`/api/groups/${id}`, { method: "DELETE" });
}

export function createEmployee(body: Pick<Employee, "name" | "groupId">) {
  return request<Employee>("/api/employees", {
    method: "POST",
    body: JSON.stringify(body satisfies JsonBody),
  });
}

export function updateEmployee(id: string, body: Pick<Employee, "name" | "groupId">) {
  return request<Employee>(`/api/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body satisfies JsonBody),
  });
}

export function deleteEmployee(id: string) {
  return request<void>(`/api/employees/${id}`, { method: "DELETE" });
}

export function createHoliday(body: Pick<Holiday, "name" | "date" | "tag">) {
  return request<Holiday>("/api/holidays", {
    method: "POST",
    body: JSON.stringify(body satisfies JsonBody),
  });
}

export function updateHoliday(id: string, body: Pick<Holiday, "name" | "date" | "tag">) {
  return request<Holiday>(`/api/holidays/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body satisfies JsonBody),
  });
}

export function deleteHoliday(id: string) {
  return request<void>(`/api/holidays/${id}`, { method: "DELETE" });
}
