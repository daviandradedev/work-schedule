# Work Schedule

Generate on-site team rotations, manage teams, and export print-ready PDFs — with optional save through the shared daviandrade.dev auth hub.

Live app: [work-schedule.daviandrade.dev](https://work-schedule.daviandrade.dev)

---

## English

### What it does

- Build on-site work schedules with regimes such as Mon–Fri, Mon–Sat, and 7x7
- Manage teams and people in a mobile-first dashboard
- Export schedules as PDF
- Browse and try the generator without an account
- Sign in through [auth.daviandrade.dev](https://auth.daviandrade.dev) to keep teams and schedules saved

### Architecture decisions

- **Auth hub, not local passwords.** Sessions come from the shared better-auth hub. The generator stays open for visitors; only persistence requires sign-in.
- **Schedule engine is domain logic.** Rotation rules live outside the UI so calendars stay testable and exportable.
- **PDF is a separate export path.** pdfmake builds print layouts without blocking the interactive calendar.
- **Language and theme are app-owned.** Cookies/context drive PT/EN and light/dark — not a third-party theme package.
- **Accessibility is checked.** Skip link and axe coverage guard the main flows.

### Stack

Next.js 16, React 19, Tailwind CSS 4, Drizzle ORM, Neon PostgreSQL, better-auth, pdfmake, Vitest.

### Setup

```bash
git clone https://github.com/daviandradedev/work-schedule.git
cd work-schedule
pnpm install
cp .env.example .env.local
```

Fill Neon `DATABASE_URL`, auth hub variables (`AUTH_DATABASE_URL`, `BETTER_AUTH_SECRET`, public URLs), then:

```bash
pnpm run db:migrate
pnpm run dev
```

### Useful scripts

| Command | What it does |
| --- | --- |
| `pnpm run dev` | Start locally |
| `pnpm test` | Run tests |
| `pnpm run lint` | Run ESLint |
| `pnpm run db:migrate` | Apply Drizzle migrations |
| `pnpm run build` | Migrate then production build |

---

## Português

### O que faz

- Monta escalas presenciais (seg–sex, seg–sáb, 7x7 e afins)
- Gerencia equipes e pessoas num dashboard mobile-first
- Exporta a escala em PDF
- Permite ver o gerador sem conta
- Usa o [auth.daviandrade.dev](https://auth.daviandrade.dev) para gravar equipes e escalas

### Decisões de arquitetura

- **Auth hub, sem senha local.** A sessão vem do hub better-auth. Visitantes usam o gerador; só a persistência pede login.
- **O motor da escala é domínio.** As regras de revezamento ficam fora da UI para testar e exportar com segurança.
- **PDF é caminho separado.** O pdfmake monta a impressão sem travar o calendário.
- **Idioma e tema são do app.** Cookies/context controlam PT/EN e claro/escuro.
- **Acessibilidade verificada.** Skip link e axe cobrem os fluxos principais.

### Stack

Next.js 16, React 19, Tailwind CSS 4, Drizzle ORM, Neon PostgreSQL, better-auth, pdfmake, Vitest.

### Setup

```bash
git clone https://github.com/daviandradedev/work-schedule.git
cd work-schedule
pnpm install
cp .env.example .env.local
```

Preencha `DATABASE_URL` do Neon e as variáveis do auth hub; depois:

```bash
pnpm run db:migrate
pnpm run dev
```

### Scripts úteis

| Comando | O que faz |
| --- | --- |
| `pnpm run dev` | Sobe o app local |
| `pnpm test` | Roda os testes |
| `pnpm run lint` | Roda o ESLint |
| `pnpm run db:migrate` | Aplica as migrations |
| `pnpm run build` | Migra e gera o build |
