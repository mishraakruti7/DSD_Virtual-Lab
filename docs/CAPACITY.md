# Infrastructure Capacity, Scaling & Cost Analysis

**Course:** Digital System Design (ECCOR2PC203) — Virtual Laboratory  
**Target Audience:** SAKEC & Mumbai University Affiliated Colleges (1,000+ Students)  
**Document Version:** `v1.0.0`  
**Effective Date:** November 14, 2025  

---

## 1. Executive Summary

The Virtual DSD Laboratory is architected around a **Zero-Server-Compute Simulation Model**: all logic simulation engines (truth tables, gate propagation delays, breadboard catenary physics, 4-channel oscilloscope sampling, and Arduino C++ sketch interpretation) run entirely client-side in the student's browser. The backend database is strictly utilized for student identity, progress persistence, debounced circuit autosaving, and continuous assessment gradebooks.

As a result, a 1,000-student departmental deployment generates less than **35 MB of database storage** and negligible compute overhead, easily running within Supabase's **Free Tier ($0/month)**.

---

## 2. Official Supabase Free vs. Pro Tier Comparison

The table below contrasts official Supabase platform resource limits against the requirements of a 1,000-student engineering college:

| Resource Metric | Supabase Free Tier | Supabase Pro Tier ($25/mo) | Virtual DSD Lab 1,000 Student Batch Requirement | Status on Free Tier |
| :--- | :--- | :--- | :--- | :--- |
| **Database Storage** | 500 MB | 8 GB included (auto-scale $0.125/GB) | **~35 MB** total per 1,000 students/year | ✅ **7% of limit** |
| **Bandwidth (Egress)** | 5 GB / month | 250 GB / month included | **~2.8 GB / month** (JSON API only; assets self-hosted) | ✅ **56% of limit** |
| **Direct Connections** | 60 max | 500 max | **0** (All client queries use PostgREST or Pooler) | ✅ **Zero direct** |
| **Connection Pooler (Supavisor)** | 200 concurrent | Thousands | **20–60 peak concurrent** during practical lab slots | ✅ **30% of limit** |
| **Monthly Active Users (MAU)** | 50,000 MAU | 100,000 MAU included | **1,000 MAU** | ✅ **2% of limit** |
| **Edge Function Invocations** | 500,000 / month | 2,000,000 / month | **~15,000 / month** (AI Tutor rate-limited) | ✅ **3% of limit** |
| **Realtime Connections** | 200 concurrent | 500 concurrent | **0** (Simulations run client-side; no live sync needed) | ✅ **0% of limit** |
| **File Storage** | 1 GB total | 100 GB included | **0 MB** (Circuits saved as JSON; no binary uploads) | ✅ **0% of limit** |
| **Point-in-Time Recovery (PITR)** | Not included (Daily 7-day backup) | Included (7 days PITR) | Daily automated `pg_dump` via GitHub Actions | ✅ **Adequate** |
| **Platform SLA** | Community support | 99.9% uptime SLA + Support | High educational availability via CDN fallback | ✅ **Adequate** |

---

## 3. Concurrency & Traffic Modeling (1,000 Students)

### 3.1 Batch Division & Peak Concurrency

Students in the Second Year (SE) Electronics & Computer Science, EXTC, and Computer Engineering are divided into laboratory batches:

- **Total Enrollment:** 1,000 students across 3 divisions.
- **Off-Peak Self-Study (Daily):** 15–40 concurrent students reading theory modules, trying quizzes, or exploring mini-projects.
- **Scheduled Lab Practicals (Weekly):** 2 divisions * 30 students = **60 concurrent lab stations** actively wiring breadboards and verifying truth tables.
- **Semester Practical Examination Peak:** 4 parallel lab rooms = **120 concurrent students** executing 2-hour assessment circuits simultaneously.

### 3.2 Client Connection Strategy & Pooling

Browser clients connect to Supabase through **PostgREST** over HTTP/2 and **Supavisor Transaction Pooling**:

1. **Stateless HTTP REST:** PostgREST does not keep database connections open between student requests. A student testing a circuit spends 99.8% of their time interacting with the client-side canvas without touching the network.
2. **Supavisor Transaction Mode (Port 6543):**
   - Each SQL query obtains a connection only for the millisecond duration of the transaction, immediately returning it to the pool.
   - 20 underlying database connections comfortably serve **2,000+ concurrent web clients**.
3. **Optimized RLS Policies:**
   - All Row Level Security policies use `(SELECT auth.uid())` subqueries rather than bare `auth.uid()`.
   - This enables PostgreSQL to evaluate the user identity once per query plan instead of re-evaluating the function on every single row scan, reducing query CPU time by up to **94%**.

---

## 4. Storage Footprint Projections

The following sizing calculations reflect typical semester usage per student:

```
Per Student Footprint:
├── Profile Record:                 ~250 bytes
├── 12 Lab Experiment Progress:     ~1.8 KB (12 rows × 150 bytes)
├── 6 Module Theory Topics:         ~0.9 KB (6 rows × 150 bytes)
├── 10 Quiz Attempts with Bloom:    ~3.2 KB (10 rows × 320 bytes)
├── 8 Saved Breadboard Circuits:    ~20.0 KB (8 circuits × 2.5 KB JSON)
├── Consent & Audit Records:        ~1.2 KB
└── Rate Limiting & Usage:          ~0.5 KB
────────────────────────────────────────────
Total per Student / Year:           ~27.85 KB
With Index Overhead (+30%):         ~36.2 KB

Batch Scaling:
├── 1,000 Students:                 ~36.2 MB
├── 5,000 Students (5 Batches):     ~181.0 MB
└── 10,000 Students (10 Batches):   ~362.0 MB (Still under 500 MB Free Tier!)
```

---

## 5. Network Egress Budgeting

- **Application Assets:** Self-hosted JavaScript, CSS, SVGs, and WOFF2 font files are served from the static hosting provider (Vercel / Netlify / Cloudflare Pages) using Edge CDN caching.
- **Supabase Egress:** Only small JSON payloads (average response size ~1.4 KB) cross the Supabase egress boundary.
- **Monthly Egress Calculation:**
  $$\text{Monthly API Calls} = 1000 \text{ students} \times 20 \text{ sessions/month} \times 8 \text{ saves/session} = 160,000 \text{ requests}$$
  $$\text{Total Monthly Egress} = 160,000 \times 1.4 \text{ KB} \approx 224 \text{ MB} \ll 5 \text{ GB Free Allowance}$$

---

## 6. Financial Recommendation & Institutional Triggers

### 6.1 Recommendation for Current Academic Year: Free Tier ($0/month)
For a single engineering college with up to 2,000 registered students, the **Supabase Free Tier is completely sufficient** and leaves 90%+ buffer on storage, egress, and compute.

### 6.2 Recommended Triggers for Upgrading to Pro Tier ($25/month)
The institution should upgrade to Supabase Pro only when:
1. **Institutional Compliance Mandate:** The college IQAC / NBA committee mandates 7-day continuous Point-in-Time Recovery (PITR) for all internal examination marks.
2. **Multi-College Deployment:** The platform is adopted by 5+ affiliated engineering colleges across Mumbai University (>10,000 active students).
3. **Database Branching:** The department deploys a dedicated Staging database environment for faculty curriculum edits prior to semester launch.
