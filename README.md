# AI Placement Mentor

AI Placement Mentor is a premium placement-preparation platform built with Next.js, TypeScript, Tailwind CSS, Prisma, and NextAuth.

## Features
- Premium landing experience
- Authentication pages
- Protected dashboard shell
- Sidebar, navbar, profile, and theme-ready layout
- Placeholder pages for upcoming modules

## Tech Stack
- Next.js 16
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth
- Framer Motion
- Recharts
- React Hook Form + Zod

## Getting Started
1. Install dependencies: npm install
2. Create a PostgreSQL database and set DATABASE_URL in .env
3. Run Prisma migrations: npx prisma migrate dev
4. Start the app: npm run dev

## Folder Structure
- src/app - routes and pages
- src/components - reusable UI components
- src/features - feature-based modules
- src/hooks - custom hooks
- src/lib - shared helpers and auth/prisma setup
- src/services - API service layer
- src/types - shared types
- src/constants - navigation and app constants
- src/providers - context providers

## Git Commit Message
feat: initialize AI Placement Mentor foundation
