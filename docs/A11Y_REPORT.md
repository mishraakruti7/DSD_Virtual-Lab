# Accessibility Audit & Remediation Report (WCAG 2.2 AA Target)

**Course:** Digital System Design (ECCOR2PC203) — Virtual Laboratory  
**Standard:** Web Content Accessibility Guidelines (WCAG) 2.2 Level AA  
**Document Version:** `v1.0.0`  
**Audit Date:** November 14, 2025 / October 2026 Verification  

---

## 1. Conformance Statement & Target

The Virtual DSD Laboratory is engineered to conform with **WCAG 2.2 Level AA** standards across all public, curriculum, and workbench interfaces. The portal is specifically designed to provide an equitable, barrier-free learning experience for students with motor impairments, low vision, color vision deficiencies, or those relying on screen readers and keyboard-only navigation.

---

## 2. Key Remediation Areas & Solutions

### 2.1 WCAG 2.2 Criterion 2.5.7: Non-Dragging Alternatives (Level AA)
*Requirement:* Any action that can be performed using a dragging movement can also be achieved through a single pointer alternative, unless dragging is essential.

**Problem:** Traditional virtual breadboards (TinkerCAD, Fritzing) require dragging components and dragging wires across holes, excluding students using switch controls, eye-trackers, head wands, or keyboard navigation.

**Solution (`AccessibleWorkbenchPanel.tsx`):**
1. **Button-Operated Nudge Controls:** Each mounted component provides focusable `[Move Left 10px]`, `[Move Right 10px]`, `[Move Up 10px]`, and `[Move Down 10px]` buttons.
2. **Keyboard Add Wire Dialog:** An accessible modal dialog provides `<select>` dropdowns for "Start Terminal", "Destination Terminal", and wire color. Students can route complex circuits without touching a mouse.
3. **Quick Place by Coordinate:** Students select a component and target breadboard tie-point (e.g. `Hole A15`) to place it with a single click.
4. **Live Screen Reader Announcer (`aria-live="polite"`):** Audible feedback confirms all actions (e.g., *"Connected jumper wire between IC 7408 Pin 14 and +5V Rail Col 1"*).

---

### 2.2 Keyboard Navigation & Focus Management

| Accessibility Feature | Implementation | WCAG Criterion | Status |
| :--- | :--- | :--- | :--- |
| **Skip to Main Content** | `<SkipLink />` rendered as first element in DOM. Becomes visible on focus, jumping focus past header to `<main id="main-content">`. | 2.4.1 Bypass Blocks (Level A) | ✅ Conforms |
| **Navbar Dropdowns** | Dropdowns feature `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`. Open menus dismiss immediately upon pressing `Escape` or clicking outside. | 2.1.1 Keyboard (Level A), 2.4.3 Focus Order | ✅ Conforms |
| **Focus Rings** | All interactive elements (`<button>`, `<a>`, `<input>`) feature high-contrast visible focus rings (`focus-visible:ring-2 focus-visible:ring-indigo-500`). `outline-none` without replacement is strictly disallowed. | 2.4.7 Focus Visible (Level AA) | ✅ Conforms |
| **Quick Search Palette** | Accessible via global `Ctrl + K` or button. Focus traps inside dialog; `Escape` restores focus to triggering button. | 2.1.2 No Keyboard Trap (Level A) | ✅ Conforms |
| **Icon Buttons** | Every icon-only button contains an explicit `aria-label` or `<span className="sr-only">`. | 1.1.1 Non-text Content (Level A) | ✅ Conforms |

---

### 2.3 Color Contrast & Visual Accommodations

1. **Light & Dark Mode Conformance:**
   - Text elements against background meet or exceed the **4.5:1** contrast ratio for normal text and **3:1** for large text.
   - Code blocks and logic formulas use high-contrast foregrounds (`#10b981`, `#38bdf8`, `#fde047`) against dark surfaces (`#0f0f17`, `#181824`).
2. **High-Contrast Mode (`.high-contrast`):**
   - User-toggleable setting in `<AccessibilityBar />`.
   - Forces bold borders, pure black/white contrast ratios exceeding **12:1** (WCAG AAA level), and disables ambient background blurs.
3. **Font Scale Multipliers:**
   - Global scale switch allows instant resizing from Small (`text-sm`), Base (`text-base`), Large (`text-lg`), to Extra Large (`text-xl`) without layout clipping or text overlap.
4. **Color-Blind Friendly Wire Coding:**
   - Wires can be identified by both color swatches and text labels (e.g. `Red (+5V)`, `Black (GND)`, `Blue (Signal A)`). No information is conveyed solely by color.

---

## 3. Screen Reader Verification Matrix

The portal was evaluated against modern assistive software (NVDA on Windows, VoiceOver on macOS):

| Component / Flow | Screen Reader Behavior | Verification Status |
| :--- | :--- | :--- |
| **Home Hero & Navigation** | Landmarks (`banner`, `navigation`, `main`, `contentinfo`) announced correctly. Skip link operates seamlessly. | ✅ Verified |
| **Breadboard Workbench** | Hole buttons announce coordinate name (e.g. *"Hole A14, terminal strip row A column 14"*). Dynamic live announcements inform when wires connect. | ✅ Verified |
| **Truth Table Verifier** | Table headers announced with row and column headers (`scope="col"`, `scope="row"`). Logic 1 / 0 states clearly spoken. | ✅ Verified |
| **Consent Checkbox** | Unbundled consent checkboxes read explicit purpose notice and link to Privacy Policy. | ✅ Verified |
| **AI Tutor Chat** | Sliding drawer announces open/close state. Streaming messages announce upon completion without interrupting reading flow. | ✅ Verified |
