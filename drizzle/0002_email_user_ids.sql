UPDATE "work_schedule"."groups" AS schedule_row
SET "user_id" = lower(account_user.email)
FROM "public"."user" AS account_user
WHERE schedule_row.user_id = account_user.id
  AND schedule_row.user_id IS DISTINCT FROM lower(account_user.email);
--> statement-breakpoint
UPDATE "work_schedule"."employees" AS schedule_row
SET "user_id" = lower(account_user.email)
FROM "public"."user" AS account_user
WHERE schedule_row.user_id = account_user.id
  AND schedule_row.user_id IS DISTINCT FROM lower(account_user.email);
--> statement-breakpoint
UPDATE "work_schedule"."holidays" AS schedule_row
SET "user_id" = lower(account_user.email)
FROM "public"."user" AS account_user
WHERE schedule_row.user_id = account_user.id
  AND schedule_row.user_id IS DISTINCT FROM lower(account_user.email);
