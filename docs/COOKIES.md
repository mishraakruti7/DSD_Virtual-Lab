# Cookie & Browser Storage Architecture Policy
**Platform: Digital System Design Virtual Lab (ECCOR2PC203)**  
**Version:** 1.0.0  
**Effective Date:** November 14, 2025  

---

## 1. Statutory Decision Rule

The Virtual DSD Lab enforces a clear statutory decision rule governing client-side browser storage and cookies:

1. **Strictly Necessary Storage (No Prior Consent Banner Required):**
   - Storage mechanisms that are strictly necessary to provide an explicit service requested by the student (maintaining an authenticated session, remembering accessibility contrast or font size preferences, or preventing data loss while editing an active breadboard circuit) do not require a disruptive blocking consent wall.
   - An informative, non-blocking first-visit banner is displayed with a link to `/cookies`.

2. **Non-Essential Storage & Scripts (Prior Opt-In Required):**
   - Any script, tracker, analytics pixel, or embed that is not strictly necessary for core lab functionality requires explicit, opt-in consent BEFORE it is loaded or executed.
   - **Production Baseline:** The portal ships with **ZERO non-essential scripts, ZERO advertising cookies, and ZERO third-party tracking pixels**.

---

## 2. Storage Inventory & Lifespan Table

| Key Name | Storage Driver | Purpose | Retention Lifespan | Regulatory Exemption |
| :--- | :--- | :--- | :--- | :--- |
| `sb-<project-id>-auth-token` | `localStorage` | Supabase authenticated session JWT | Active session / token expiry | Strictly Necessary (Authentication) |
| `dsd_course_storage_v1` | `localStorage` | Theme mode (light/dark), high-contrast toggle, font size scale, audio mute toggle | Persistent until cleared | Strictly Necessary (Accessibility) |
| `dsd_active_breadboard_circuit` | `localStorage` | In-progress breadboard draft to prevent work loss on accidental tab refresh | Persistent until overwritten | Strictly Necessary (User Coursework) |
| `dsd_saved_circuits_local` | `localStorage` | Offline circuit storage fallback for network drops | Persistent | Strictly Necessary (Offline Resilience) |
| `dsd_support_messages` | `localStorage` | Offline backup for feedback tickets | Persistent | Strictly Necessary (Offline Resilience) |
| `dsd_storage_notice_dismissed` | `localStorage` | Remembers that the user closed the first-visit storage information banner | 365 Days | Strictly Necessary (User Preference) |
| `dsd_tutor_consent_acknowledged` | `localStorage` | Records acknowledgment of the one-time AI Tutor privacy notice | Persistent | Strictly Necessary (Consent Record) |
| `dsd_tutor_save_history` | `localStorage` | User preference toggle for optional AI Tutor history (default `false`) | Persistent | Strictly Necessary (Consent Choice) |

---

## 3. Lightweight ConsentManager Architecture

To enforce this policy programmatically, the portal includes `src/utils/ConsentManager.ts`:
- Maintains user consent choices (`strictly_necessary: true`, `analytics: false`, `marketing: false`).
- Prevents injection or execution of any future dynamic tracking script unless explicitly consented to.
- Guarantees that "Reject Non-Essential" is as prominent and effortless as "Accept".
