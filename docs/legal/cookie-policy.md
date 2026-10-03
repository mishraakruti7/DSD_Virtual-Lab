# Cookie & Browser Storage Policy
**Course: Digital System Design (ECCOR2PC203)**  
**Version:** 1.0.0  
**Effective Date:** November 14, 2025  

---

## 1. Our Approach to Cookies and Privacy
We believe an engineering educational portal should respect student privacy. 

> **Important Statement:** We use **ZERO advertising cookies**, **ZERO third-party tracking cookies**, and **ZERO cross-site analytics scripts**.

Instead of invasive cookies, our application relies exclusively on standard, first-party browser local storage (`localStorage`) strictly necessary to keep you securely signed in, preserve your accessibility settings, and prevent loss of your circuit wiring work.

---

## 2. Complete Browser Storage Inventory

The table below lists every storage item saved on your device by the Platform:

| Key Name | Storage Type | Purpose | Lifespan | Category |
| :--- | :--- | :--- | :--- | :--- |
| `sb-<id>-auth-token` | `localStorage` | Keeps you securely signed in to your student or faculty account using a JSON Web Token (JWT). | Until you sign out or token expires | **Strictly Necessary** |
| `dsd_course_storage_v1` | `localStorage` | Remembers your accessibility and appearance preferences: dark/light theme, high-contrast mode, font scale, sound effects, and local lab completions. | Persistent until manually cleared | **Strictly Necessary** |
| `dsd_active_breadboard_circuit` | `localStorage` | Auto-saves your in-progress breadboard circuit to avoid losing your wiring if you accidentally reload the tab. | Persistent until cleared or replaced | **Strictly Necessary** |
| `dsd_saved_circuits_local` | `localStorage` | Local copy of your custom circuit wirings for offline simulation when your internet connection drops. | Persistent until cleared | **Strictly Necessary** |
| `dsd_support_messages` | `localStorage` | Offline buffer for feedback and help tickets in case network drops during submission. | Persistent until cleared | **Strictly Necessary** |
| `dsd_storage_notice_dismissed` | `localStorage` | Remembers that you acknowledged our first-visit storage notice. | 1 Year | **Strictly Necessary** |
| `dsd_tutor_consent` | `localStorage` / DB | Remembers your acknowledgment of the AI Tutor privacy notice. | Persistent until cleared | **Strictly Necessary** |

---

## 3. Why Strictly Necessary Storage Does Not Need a Blocking Consent Wall
Under international data protection guidelines and India's DPDP framework, storage items that are strictly necessary to provide an explicit service requested by the user (such as maintaining a secure login session, respecting high-contrast visual choices, or preventing data loss while editing a circuit) do not require a disruptive blocking consent wall. Instead, we provide this clear, transparent information notice and give you complete control.

---

## 4. How You Can Clear or Block Storage
You can clear your local storage at any time directly through your web browser:
- **Chrome / Edge / Brave:** Settings &rarr; Privacy and security &rarr; Clear browsing data &rarr; Cookies and other site data.
- **Firefox:** Settings &rarr; Privacy & Security &rarr; Cookies and Site Data &rarr; Clear Data.
- **Safari:** Settings &rarr; Safari &rarr; Advanced &rarr; Website Data &rarr; Remove All Website Data.

Note that clearing local storage will sign you out and reset your high-contrast or theme preferences back to default.
