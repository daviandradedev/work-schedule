<div align="center">
  <img src="https://img.icons8.com/fluency/256/calendar.png" alt="Project Logo" width="100" />

  <h1>Work Schedule Generator</h1>

  [![Vercel](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://workschedule-dd.vercel.app/)
  
  <p>
    A modern web app for generating and managing workforce schedules with automated rotation logic.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css" />
    <img src="https://img.shields.io/badge/Neon-Postgres-00E599?style=flat-square&logo=postgresql" />
    <img src="https://img.shields.io/badge/Better_Auth-Auth-black?style=flat-square" />
    <img src="https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square" />
    <img src="https://img.shields.io/badge/Framer_Motion-Animations-e00095?style=flat-square&logo=framer" />
    <img src="https://img.shields.io/badge/PDF-Export-red?style=flat-square&logo=adobe-acrobat-reader" />
  </p>
</div>

---

## 🚀 Overview

Work Schedule Generator is a full-stack application designed to handle complex shift rotations and team allocation.

It focuses on **performance, accessibility, and real-world usability**, providing managers with a fast and intuitive interface to generate schedules and export them as PDFs.

---

## ✨ Features

- **Automated rotation logic**  
  Supports multiple work regimes (`Mon–Fri`, `Mon–Sat`, `7x7`) with automatic handling of weekends and holidays.

- **PDF export**  
  Generates print-ready schedules using `pdfMake`.

- **Mobile-first UX**  
  Optimized for mobile with bottom sheets, drawers, and safe viewport handling (`100dvh`).

- **Built-in i18n**  
  Lightweight internationalization (EN/PT) using Context API.

- **Smooth UI interactions**  
  Animations and transitions powered by Framer Motion.

- **Dark mode support**  
  Seamless theme switching using `next-themes` and Tailwind CSS variables.

- **Portable cloud persistence**  
  PostgreSQL-backed storage with app-owned authentication and export-friendly data.

---

## 🧠 Engineering Highlights

- **Performance-first approach**  
  Heavy calendar computations are memoized (`useMemo`) to avoid unnecessary re-renders.

- **Accessibility (a11y)**  
  Keyboard navigation support with custom hooks like `useEscapeKey`.

- **Separation of concerns**  
  Clear boundaries between:
  - UI components  
  - Business logic (`schedule-generator.ts`)  
  - Data hooks (`use-schedule`, `use-teams`)

---

## 🧱 Tech Stack

- **Framework:** Next.js 16 (App Router), React 19  
- **Styling:** Tailwind CSS v4  
- **State Management:** Context API + custom hooks  
- **Backend:** Next.js Route Handlers, Better Auth, Drizzle ORM, PostgreSQL/Neon  
- **Animations:** Framer Motion  
- **Utilities:** date-fns, pdfMake  

---

## 🛠️ Getting Started

```bash
git clone https://github.com/dandrade/work-schedule.git
cd work-schedule

pnpm install

# .env.local
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_TRUSTED_ORIGINS="https://your-vercel-domain.vercel.app"

pnpm db:migrate

pnpm dev
```

## 🧭 Production Architecture

This app uses app-owned authentication and server-side APIs backed by PostgreSQL.

- **Database:** Neon PostgreSQL. Work Schedule data lives in a dedicated `work_schedule` schema and can be exported with `pg_dump`.
- **Auth:** Better Auth runs inside this Next.js app and stores users/sessions in the same PostgreSQL database.
- **API boundary:** All writes go through Next.js server route handlers, protected by HTTP-only session cookies.
- **Deploy target:** Vercel is the simplest fit for the current Next.js app. A separate Hono/Cloudflare API can be extracted later if mobile/native clients become the priority.

---

## 🇧🇷 Versão em Português

### 🚀 Visão Geral

O Work Schedule Generator é uma aplicação full-stack para geração e gerenciamento de escalas de trabalho com lógica automatizada de revezamento.

O projeto foca em **performance, acessibilidade e usabilidade real**, oferecendo uma interface rápida e intuitiva para criação e exportação de escalas.

---

### ✨ Funcionalidades

- **Lógica de rotação automatizada**  
  Suporte a regimes (`Seg–Sex`, `Seg–Sáb`, `7x7`) com tratamento automático de finais de semana e feriados.

- **Exportação em PDF**  
  Geração de escalas prontas para impressão com `pdfMake`.

- **UX Mobile-first**  
  Interface otimizada para dispositivos móveis com drawers e controle de viewport (`100dvh`).

- **Internacionalização (i18n)**  
  Suporte a inglês e português via Context API.

- **Animações e interações**  
  Transições suaves com Framer Motion.

- **Modo escuro**  
  Alternância de tema com `next-themes` e Tailwind.

- **Persistência portável em nuvem**  
  Armazenamento em PostgreSQL com autenticação própria e dados fáceis de exportar.

---

### 🧠 Destaques Técnicos

- Otimização de performance com `useMemo`
- Suporte a acessibilidade (atalhos de teclado)
- Separação clara entre UI, lógica de negócio e hooks

---

### 🛠️ Como executar

```bash
git clone https://github.com/dandrade/work-schedule.git
cd work-schedule

pnpm install

# .env.local
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_TRUSTED_ORIGINS="https://your-vercel-domain.vercel.app"

pnpm db:migrate

pnpm dev
```
