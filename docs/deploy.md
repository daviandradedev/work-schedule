# Deploy

Production URL: https://work-schedule.daviandrade.dev

Use the same Neon database for this app’s library tables. Auth sessions live on the shared auth hub database (`AUTH_DATABASE_URL`), not mixed into app tables.

Set `NEXT_PUBLIC_APP_URL` to the production host and leave `BETTER_AUTH_COOKIE_DOMAIN=.daviandrade.dev` for shared cookies on `*.daviandrade.dev`.

Build command: `pnpm run build` (runs migrations, then `next build`).
