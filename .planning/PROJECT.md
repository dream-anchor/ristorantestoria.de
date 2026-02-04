# Ristorante Storia - Project Specification

## Project Overview
- **Name:** Ristorante Storia
- **Type:** Restaurant Website
- **Domain:** ristorantestoria.de
- **Status:** Production

## Tech Stack
- **Build:** Vite 5.4 + SWC
- **Framework:** React 18.3 + TypeScript 5.8
- **Styling:** Tailwind CSS 3.4 + shadcn-ui
- **Database:** Supabase (PostgreSQL)
- **State:** React Query 5.x
- **Forms:** React Hook Form + Zod
- **Routing:** React Router 6.x
- **Deployment:** GitHub Actions → Strato Hosting

## Supported Languages
- German (de) - Primary
- English (en)
- Italian (it)
- French (fr)

## Core Features
- [x] Multilingual support (i18n)
- [x] Responsive design
- [x] WCAG accessibility compliance
- [x] SSR/SSG for SEO optimization
- [x] Menu presentation
- [x] Contact information
- [x] Reservation system integration

## Architecture Decisions

### Component Strategy
- Use shadcn-ui components as base
- Custom components extend shadcn patterns
- Strict TypeScript (no `any`)

### Styling Strategy
- Tailwind CSS exclusively
- CSS variables for theming (HSL color system)
- Custom fonts: Playfair Display, Cormorant Garamond, Great Vibes

### Performance Strategy
- Static site generation (prerender.js)
- Optimized images
- Code splitting via React Router

## Quality Standards
- ESLint for code quality
- TypeScript strict mode
- WCAG 2.1 AA compliance
- Mobile-first responsive design
