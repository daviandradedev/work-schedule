import { boolean, date, index, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const workScheduleSchema = pgSchema("work_schedule");

export const groups = workScheduleSchema.table(
  "groups",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    color: text("color").notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("groups_user_id_idx").on(table.userId)],
);

export const employees = workScheduleSchema.table(
  "employees",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("employees_group_id_idx").on(table.groupId),
    index("employees_user_id_idx").on(table.userId),
  ],
);

export const holidays = workScheduleSchema.table(
  "holidays",
  {
    id: text("id").primaryKey(),
    date: date("date", { mode: "string" }).notNull(),
    name: text("name").notNull(),
    isNacional: boolean("is_nacional").default(false).notNull(),
    tag: text("tag"),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("holidays_user_id_idx").on(table.userId)],
);

export type GroupRow = typeof groups.$inferSelect;
export type EmployeeRow = typeof employees.$inferSelect;
export type HolidayRow = typeof holidays.$inferSelect;
