# Deploy: banco e back-end

O Work Schedule usa:

- **Banco online:** Neon PostgreSQL
- **Back-end:** rotas server-side do Next.js hospedadas na Vercel
- **Auth:** Better Auth, com usuarios e sessoes salvos no mesmo Postgres

Nao existe mais um back-end externo separado. Quando o app sobe na Vercel, as rotas em `/api/*` sobem junto com o front-end.

## 1. Criar o banco no Neon

1. Crie um projeto no Neon.
2. Copie a connection string com pooling ativado. Ela normalmente tem `-pooler` no host.
3. Use essa string como `DATABASE_URL`.

Exemplo:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.neon.tech/DB?sslmode=require"
```

## 2. Configurar localmente

Crie/atualize `.env.local`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.neon.tech/DB?sslmode=require"
BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_TRUSTED_ORIGINS="http://localhost:3000"
```

Gere o secret:

```bash
openssl rand -base64 32
```

Depois rode as migrations e o app:

```bash
pnpm db:migrate
pnpm dev
```

## 3. Configurar producao na Vercel

Na Vercel, em **Project Settings > Environment Variables**, adicione para Production:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.neon.tech/DB?sslmode=require"
BETTER_AUTH_SECRET="o-mesmo-secret-estavel-de-producao"
BETTER_AUTH_URL="https://seu-dominio.vercel.app"
BETTER_AUTH_TRUSTED_ORIGINS="https://seu-dominio.vercel.app"
```

O codigo tambem confia automaticamente nas URLs internas que a Vercel informa no deploy (`VERCEL_URL`, `VERCEL_BRANCH_URL` e `VERCEL_PROJECT_PRODUCTION_URL`). Mesmo assim, mantenha `BETTER_AUTH_URL` apontando para a URL publica principal.

Se usar dominio customizado, troque `BETTER_AUTH_URL` pelo dominio final, por exemplo:

```bash
BETTER_AUTH_URL="https://workschedule.seudominio.com"
BETTER_AUTH_TRUSTED_ORIGINS="https://workschedule.seudominio.com"
```

Para login compartilhado entre varios projetos no mesmo dominio raiz, use subdominios e adicione:

```bash
BETTER_AUTH_COOKIE_DOMAIN="seudominio.com"
BETTER_AUTH_TRUSTED_ORIGINS="https://portfolio.seudominio.com,https://work-schedule.seudominio.com"
```

Exemplo recomendado:

- `portfolio.seudominio.com`
- `work-schedule.seudominio.com`
- `outro-projeto.seudominio.com`

Isso nao funciona entre dominios totalmente diferentes, nem entre varios dominios `*.vercel.app`, porque browsers nao permitem cookie compartilhado no dominio publico `vercel.app`.

## 4. Rodar migration no banco de producao

Rode uma vez apontando para o banco Neon de producao:

```bash
pnpm db:migrate
```

Isso cria as tabelas de auth no schema `public` e as tabelas do app no schema `work_schedule`.

## 5. Publicar

Opcoes:

```bash
git push
```

Se o projeto estiver conectado ao GitHub na Vercel, o deploy acontece automaticamente.

Ou, usando Vercel CLI:

```bash
pnpm dlx vercel --prod
```

## Como isso fica online

- O front-end fica online na Vercel.
- O back-end fica online na mesma URL, em `/api/*`.
- O banco fica online no Neon.
- Quando ninguem usa, Vercel/Neon ficam frios ou ociosos; quando alguem clica no link, as funcoes e o banco acordam automaticamente.
