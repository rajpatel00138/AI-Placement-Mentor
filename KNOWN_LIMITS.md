# Known System Limits & Architectural Notes

This document details known operational boundaries, storage strategies, and external integration requirements for the AI Placement Mentor platform.

---

## 1. DSA Tracker Revisions & Bookmarks Persistence
- **Implementation**: Problem solve states (`completed`, `not-started`) are synchronized with the Neon PostgreSQL database via the `/api/user/dsa` route and recorded in the user's activity stream for recruiter visibility.
- **Client-Side Persistence**: Multi-stage revision checkboxes (R1, R2, R3, R4) and problem favoriting/bookmarking are persisted in browser `localStorage` (`dsa_revisions` and `dsa_favorites`). This ensures student revision progress persists across page reloads without mutating legacy relational schemas.

---

## 2. Company-Wise Preparation Persistence
- **Implementation**: Company problem statuses (`SOLVED`, `BOOKMARKED`, `UNSOLVED`) are persisted directly to the relational database using the `StudentCompanyQuestionProgress` Prisma model with composite key `[studentId, questionId]`.
- **Guest / Fallback Mode**: When running in unauthenticated guest mode, progress is maintained in an in-memory session map.

---

## 3. Google OAuth Setup & Redirect Configuration
- **Access Control**: Google Sign-In is provisioned exclusively for students (recruiters authenticate via dedicated email/password credentials).
- **Required Google Cloud Console Configuration**:
  To enable Google Sign-In on development or production, the following Authorized Redirect URIs must be added in the Google Cloud Console under **APIs & Services > Credentials > OAuth 2.0 Client IDs**:
  - **Local Development**: `http://localhost:3000/api/auth/callback/google`
  - **Production Deployment**: `https://ai-placement-mentor0.vercel.app/api/auth/callback/google`
- **Error Behavior**: If the deployed domain URI is not listed in Google Cloud Console, Google redirects with a callback configuration error. Standard email/password registration and login remain 100% operational as the primary authentication pathway.

---

## 4. Cohort Analytics Access Restriction
- **Access Boundaries**: The cohort-wide analytics dashboard (`/recruiter/analytics`) and corresponding API endpoints (`/api/analytics/recruiter`, `/api/analytics/college/[collegeId]`) are strictly restricted to users with `role: "recruiter"` or `role: "admin"`.
- **Student Redirection**: Any authenticated student attempting to access `/recruiter/analytics`, `/analytics`, or `/dashboard/analytics` is automatically redirected to `/dashboard` with 401/403 API guards.

---

## 5. Upstream AI Rate Limits & High-Resilience Fallbacks
- **Models**: AI Mentoring Chat and Interview Question Generation leverage Gemini (`gemini-3.1-flash-lite` and `gemini-2.5-flash`).
- **Resilience**: If upstream API quota limits or network interruptions occur, the interview engine seamlessly switches to domain-specific algorithmic question pools with dynamic parameter entropy, guaranteeing continuous uptime during evaluations.

