# System Security, Privacy & Data Audit Report
**Virtual Laboratory & Course Workbench — Digital System Design (ECCOR2PC203)**
**Audit Date:** October 13, 2026  
**Scope:** Client frontend (`src/`, `public/`, `index.html`), Database schema (`supabase/schema.sql`, `supabase/migrations/`), Edge Functions (`supabase/functions/`), and browser storage.

---

## 1. Data Inventory

The following table itemises every personal and course-related data field currently stored, processed, or collected by the portal:

| Data Field | Purpose | Storage Location | Visibility / Access | Retention Period | Necessity Evaluation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Email Address** | User authentication, identity verification, password recovery | `auth.users`, `public.profiles` | User (own), Course Faculty, Administrators | Account lifetime + 30 days post-deletion grace period | **Essential**: Primary key for academic identification and access control. |
| **Full / Display Name** | Display on academic dashboard, generated lab reports, and faculty evaluation rosters | `public.profiles` | User (own), Course Faculty, Administrators | Account lifetime | **Essential**: Required for institutional academic grading and accreditation. |
| **User Role** | Role-based authorization (`student`, `faculty`, `admin`) | `public.profiles` | User (own), Course Faculty, Administrators | Account lifetime | **Essential**: Critical for preventing unauthorized student access to grading consoles. |
| **Avatar URL** | Visual profile indicator | `public.profiles` | User, Faculty | Prior schema | **Non-essential (Minimised)**: Removed from active collection; replaced with deterministic UI initials. |
| **Student Progress** | Tracking completed syllabus modules (Chapters 1–6) and practical experiments (Labs 1–12) | `public.progress` | Student (own), Course Faculty, Administrators | Duration of course enrollment + 1 academic year | **Essential**: Forms continuous assessment record (Course Outcomes CO1–CO6). |
| **Quiz Attempts** | Storing scores, timestamps, and Bloom's Taxonomy cognitive level performance | `public.quiz_attempts` | Student (own), Course Faculty, Administrators | 1 academic year | **Essential**: Used for continuous evaluation and institutional NBA accreditation metrics. |
| **Saved Circuits** | Persisting solderless breadboard wirings, IC placements, and student project schematics | `public.saved_circuits`, `localStorage` fallback | Student (own), Course Faculty, Administrators | Maintained until explicitly deleted by student | **Essential**: Student coursework and practical assignments. |
| **AI Tutor Messages** | Contextual course assistance and student questions | `public.chat_history` | Student (own only) | 90 days (configurable); opt-in only | **Optional**: Ephemeral learning aid; users may toggle off or purge history at will. |
| **Support / Feedback** | Resolving user feedback, platform bug reports, and academic inquiries | `public.support_messages` | Submitting User, Administrators | 12 months after resolution | **Essential**: Required for platform maintenance, auditability, and academic support. |
| **Faculty Reports** | Exported class rosters, performance summaries (PDF/CSV) | `public.faculty_reports` | Authoring Faculty member, Administrators | 2 academic years | **Essential**: Faculty administrative records. |
| **Consent Records** | Evidentiary log of privacy notice acceptance, age confirmation, and consent withdrawals | `public.consent_records` | User (own), Administrators | Account lifetime + statutory requirement | **Essential**: Mandatory under India DPDP Act 2023 / Rules 2025. |
| **Audit Log** | Tracking administrative and faculty access to student personal records | `public.audit_log` | System Administrators | 2 years | **Essential**: Accountability and compliance verification. |

---

## 2. Third-Party Inventory

The codebase was exhaustively scanned across all source files, configurations, HTML manifests, and build artifacts for external network requests and third-party dependencies:

| Service / Domain | Purpose | Data Transmitted | Privacy & Compliance Safeguard |
| :--- | :--- | :--- | :--- |
| **Supabase** (`*.supabase.co`) | Managed PostgreSQL database, JWT authentication, and Edge Functions | Auth tokens, encrypted database queries, RPC invocations | Managed infrastructure hosted in compliant cloud regions (Mumbai / ap-south-1 where configured). Encrypted in transit (TLS 1.3) and at rest (AES-256). |
| **Google OAuth** (`accounts.google.com`) | Optional student/faculty Single Sign-On | Email, display name, Google User ID | Only standard minimal OAuth scopes (`openid`, `email`, `profile`) requested. Zero Google advertising pixels or tracking tags embedded. |
| **Anthropic API** (`api.anthropic.com`) | LLM backend for "Ask the DSD Tutor" | User chat messages, active course topic context | **Zero direct client connections**. All queries routed through backend Edge Function (`dsd-tutor`). User names, emails, and credentials are strictly stripped before invocation. |
| **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) | Typography (`Inter`, `Bricolage Grotesque`, `JetBrains Mono`) | Browser IP, User-Agent during font download | **Remediated**: External links removed from `index.html`. All fonts are subset to Latin and self-hosted locally from `/fonts/*.woff2`. |
| **Curated Outbound Links** (`mu.ac.in`, `sakec.ac.in`, `nptel.ac.in`, `vlab.co.in`) | Verified course references and academic resources | None (Client-side anchor link navigation) | Tagged with `rel="noopener noreferrer"` and visual external link cues. |

---

## 3. Browser Storage Inventory

| Key | Storage Engine | Purpose | Lifecycle / Duration | Classification |
| :--- | :--- | :--- | :--- | :--- |
| `sb-<id>-auth-token` | `localStorage` | Supabase authenticated user JWT session token | Session / Refresh cycle | **Strictly Necessary** (User authentication) |
| `dsd_course_storage_v1` | `localStorage` | UI preferences: theme mode (light/dark), high-contrast toggle, font size scale, audio toggle | Persistent until cleared | **Strictly Necessary** (User accessibility and UX preferences) |
| `dsd_active_breadboard_circuit` | `localStorage` | Auto-saved scratchpad of currently active breadboard circuit to prevent data loss | Persistent until replaced | **Strictly Necessary** (Prevents student work loss on refresh) |
| `dsd_saved_circuits_local` | `localStorage` | Offline backup for saved breadboard circuits | Persistent | **Strictly Necessary** (Offline resilience) |
| `dsd_support_messages` | `localStorage` | Offline buffer for feedback and help tickets | Persistent | **Strictly Necessary** (Offline resilience) |
| `dsd_storage_notice_dismissed` | `localStorage` | Records user acknowledgment of local storage information banner | 1 Year | **Strictly Necessary** (Consent state) |
| `dsd_tutor_consent` | `localStorage` / DB | Records one-time acknowledgment of AI Tutor privacy notice | Persistent | **Strictly Necessary** (Consent state) |

*Cookies:* **Zero application cookies** are set by client code. Supabase Auth defaults to `localStorage` token persistence.

---

## 4. Analytics & Tracking Verification

- **External Trackers:** **Zero detected** (0 Google Analytics, 0 Meta/Facebook Pixel, 0 PostHog, 0 Mixpanel, 0 Hotjar, 0 Microsoft Clarity).
- **Session Replay / Screen Recording:** **Zero detected**.
- **Browser Fingerprinting:** **Zero detected**.
- **Internal Analytics:** Limited strictly to aggregate, first-party database metrics (e.g., total enrolled students, average quiz scores by chapter, syllabus completion percentages) visible only to authenticated course faculty and administrators.

---

## 5. Dangerous Code Patterns Scan

| Pattern Checked | Findings | Status & Remediation |
| :--- | :--- | :--- |
| `dangerouslySetInnerHTML` | **0 occurrences** across all source files | Pass |
| `eval()` | **0 occurrences** across all source files | Pass |
| `new Function()` | **1 occurrence** in `src/utils/sketchRunner.ts` | **Sandboxed**: Executes in-browser Arduino C++/Wiring simulation with restricted hardware stub bindings (`pinMode`, `digitalWrite`, `digitalRead`, `tone`) in a separate execution scope without DOM access. |
| Hardcoded API Secrets / Keys | **0 occurrences** in client code (`src/`) | Pass: Only `VITE_SUPABASE_ANON_KEY` is present in frontend, which is designed to be public and guarded by Row Level Security (RLS). |
| Service Role Key in Client | **0 occurrences** in `src/` | Pass: `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to backend Edge Functions (`supabase/functions/`). |
| Personal Data in Console Logs | **0 occurrences** of PII in logs | Pass: Only generic error messages (`err.message`) are emitted. |
