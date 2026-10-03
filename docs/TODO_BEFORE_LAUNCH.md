# Institutional Launch Checklist & Legal Placeholders Register
**Digital System Design (ECCOR2PC203) — Virtual Laboratory Portal**

Before deploying this platform to production for live student enrollment, the institutional administration must replace every placeholder listed below with authorized legal details.

---

## 1. Legal & Administrative Placeholders

The following placeholders are used throughout the Privacy Notice, Terms and Conditions, Cookie Policy, Accessibility Statement, and Contact Portal:

| Placeholder Key | Current Usage in Documents | Required Production Value | Department / Responsible Office |
| :--- | :--- | :--- | :--- |
| `[COLLEGE LEGAL NAME]` | Entity acting as Data Fiduciary under India DPDP Act 2023 | Mahavir Education Trust's Shah & Anchor Kutchhi Engineering College | Institutional Board of Trustees |
| `[COLLEGE AFFILIATION]` | University affiliation statement | University of Mumbai (Approved by AICTE, DTE Maharashtra) | Academic Council |
| `[DEPARTMENT NAME]` | Academic department administering the workbench | Department of Electronics & Computer Science | Head of Department |
| `[GRIEVANCE OFFICER NAME]` | Statutory Data Protection Grievance Redressal Officer | Designated Senior Faculty or Administrative Officer | Principal / Management |
| `[GRIEVANCE OFFICER EMAIL]` | Official grievance email endpoint | e.g. `grievance.dsd@sakec.ac.in` | IT & Administration |
| `[CONTACT EMAIL]` | General student and faculty support contact | e.g. `dsd-lab@sakec.ac.in` | Lab Coordinator |
| `[POSTAL ADDRESS]` | Physical campus address for legal correspondence | Mahavir Education Trust Chowk, W.T. Patil Marg, Next to Dukes Co., Chembur, Mumbai 400088, Maharashtra, India | College Registrar |
| `[COURT/CITY]` | Jurisdiction for dispute resolution and governing law | Courts of Competent Jurisdiction in Mumbai, Maharashtra, India | Legal Counsel |
| `[EFFECTIVE DATE]` | Policy promulgation date | November 14, 2025 (Reflecting Gazette notification of DPDP Rules 2025) | Administration |
| `[POLICY VERSION]` | Canonical semantic version | `v1.0.0` | IT / Compliance Lead |

---

## 2. Technical Pre-Launch Requirements

- [ ] **Custom SMTP Configuration**: In the production Supabase dashboard (`Settings -> Auth -> SMTP Settings`), configure a production transactional email provider (AWS SES, Resend, or SendGrid) with custom sender domain (`no-reply@sakec.ac.in`) and valid SPF, DKIM, and DMARC DNS records.
- [ ] **Google OAuth Production Publication**: In Google Cloud Console (`APIs & Services -> OAuth consent screen`), transition the OAuth app status from "Testing" to "In Production" to remove the 100-user cap for institutional Gmail/G-Suite accounts.
- [ ] **Environment Variables**: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in production hosting environment variables (e.g., Vercel / Cloudflare Pages).
- [ ] **Edge Function Secrets**: Set `ANTHROPIC_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` inside Supabase Edge Function secrets via CLI:
  ```bash
  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
  ```
- [ ] **Domain & Security Headers**: Verify that DNS points to the custom institutional domain (`dsdlab.sakec.ac.in` or similar) with active TLS 1.3 certificates and verified Content-Security-Policy headers.
- [ ] **Database Backup Validation**: Test a test restore of the automated Supabase backup in a staging database before enrolling 1000+ live students.
