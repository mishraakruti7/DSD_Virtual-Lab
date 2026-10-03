# Statutory Personal Data Inventory Register
**Digital System Design (ECCOR2PC203) — Virtual Laboratory**  
**Data Fiduciary:** [COLLEGE LEGAL NAME]  
**Statutory Framework:** Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025  
**Version:** 1.0.0  
**Effective Date:** November 14, 2025  

---

## 1. Statutory Data Register

| Attribute Name | Data Classification | Purpose for Processing | Legal Basis | Table / Store | Access Roles | Retention Period | Disposal Method |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Email Address** | Personal Data (Identifier) | User authentication, password reset, account verification | Consent (DPDP §6) | `auth.users`, `public.profiles` | User, Faculty, Admin | Account lifetime + 30 days | Cryptographic purge (cascade delete) |
| **Display Name** | Personal Data (Identity) | Display on lab certificates, academic rosters, and viva sheets | Consent (DPDP §6) | `public.profiles` | User, Faculty, Admin | Account lifetime | Cryptographic purge |
| **User Role** | Operational Metadata | Access control authorization (`student`, `faculty`, `admin`) | Legitimate Use (§7) | `public.profiles` | User (own), Faculty, Admin | Account lifetime | Purged with profile |
| **Course Progress** | Educational Activity | Tracking completion of 12 labs and 6 theory chapters | Contract / Consent | `public.progress` | Student, Faculty, Admin | Duration of enrollment + 1 academic year | Purged after statutory period |
| **Quiz Attempts** | Evaluation Data | Continuous internal assessment marks and Bloom's taxonomy breakdown | Contract / Consent | `public.quiz_attempts` | Student, Faculty, Admin | 1 academic year | Automated archiving & purge |
| **Saved Circuits** | Student Coursework | Persisting solderless breadboard IC wirings and projects | Functional Consent | `public.saved_circuits` | Student, Faculty, Admin | Until explicitly erased by student | Hard delete on user request |
| **AI Tutor Messages** | Educational Query | Contextual digital logic explanations | Explicit Opt-in Consent | `public.chat_history` | Student (own only) | 90 days maximum | Scheduled `pg_cron` automated purge |
| **Support / Help Tickets** | Communications | Resolving bug reports, simulator discrepancies, inquiries | Consent | `public.support_messages` | Student, Admin | 12 months after resolution | Anonymisation of PII |
| **Faculty Reports** | Academic Summary | Official Mumbai University continuous assessment summaries | Legitimate Institutional Purpose | `public.faculty_reports` | Author Faculty, Admin | 2 academic years | Purged upon academic review |
| **Consent Records** | Legal Audit Evidence | Evidentiary logging of consent grants and withdrawals | Statutory Mandate (§6) | `public.consent_records` | Student (own), Admin | Account lifetime + 3 years | Statutory archive |
| **Audit Log** | Security Log | Tracking administrative access to student personal records | Legal Duty (§8) | `public.audit_log` | Administrators only | 2 years | Immutable append-only, rolling purge |

---

## 2. Excluded Data Categories (Data Minimisation Mandate)

The following personal data elements are **strictly excluded** from collection:
- **Financial & Payment Data:** The platform is free for enrolled students; zero payment credentials collected.
- **Biometric Data:** Zero biometric scans or facial recognition.
- **Physical Contact Details:** No phone numbers, home addresses, or postal codes.
- **Demographic Sensitive Data:** No caste, religion, marital status, or political affiliation.
- **Device Fingerprints & Precision Location:** No GPS latitude/longitude, hardware MAC addresses, canvas fingerprinting, or battery telemetry.
- **Profile Avatars:** Student photos are not stored; initials are deterministically generated in client UI.
