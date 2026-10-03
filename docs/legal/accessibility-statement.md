# Accessibility Statement (WCAG 2.2 AA)
**Course: Digital System Design (ECCOR2PC203)**  
**Version:** 1.0.0  
**Effective Date:** November 14, 2025  

---

## 1. Our Commitment
**[COLLEGE LEGAL NAME]** is dedicated to ensuring that digital education is inclusive and accessible to everyone, including students with visual, auditory, motor, or cognitive disabilities. We aim to conform to the **Web Content Accessibility Guidelines (WCAG) 2.2 Level AA** standards.

---

## 2. Accessibility Measures Implemented
The Platform incorporates core accessibility features throughout all pages and learning stations:

1. **Clear Page Hierarchy and Landmarks:**
   - Every page features valid semantic HTML landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`).
   - A visible **"Skip to main content"** link appears as the very first focusable element when pressing `Tab`, allowing keyboard users to bypass navigation menus.
   - Each route contains a single, descriptive `<h1>` heading with logical descending subheadings.

2. **Full Keyboard Operability:**
   - All interactive controls (buttons, links, inputs, dropdown menus, modals) are operable via standard keyboard commands (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
   - Destructive CSS focus removal (`outline-none`) has been eliminated and replaced with prominent, high-contrast `:focus-visible` rings (at least 2px thick with $\ge 3:1$ contrast against adjacent surfaces).
   - Navigation dropdowns open on click and keyboard activation, can be navigated with arrow keys, and close cleanly when pressing `Escape`. Focus is trapped inside active modals and returned to the trigger button upon close.

3. **Accessible Form Inputs and Buttons:**
   - Every input field has an associated visible `<label>` element and explicit autocomplete hints.
   - Validation errors are linked to inputs via `aria-describedby` and announced to screen readers using polite `aria-live` containers.
   - Every icon-only button includes a descriptive, localized `aria-label` attribute (e.g. "Open AI tutor", "Zoom in", "Undo wire placement").

4. **Colour, Contrast, and Sensory Adaptations:**
   - Text and interactive elements meet or exceed WCAG 2.2 contrast ratios ($\ge 4.5:1$ for body copy, $\ge 3:1$ for large text and UI borders) in both standard light mode and dark mode.
   - A dedicated **High Contrast Mode** toggle is accessible at the top of every page.
   - Colour is never used as the sole conveyor of information: wire connections, logic levels (HIGH/LOW), and status badges are accompanied by explicit text labels or pattern indicators.
   - The platform strictly respects the user's operating system `prefers-reduced-motion` setting by disabling animations, transitions, and pulsing effects. Audio chimes can be muted with a persistent toggle.
   - Layouts scale cleanly up to 200% zoom without horizontal overflow or loss of functionality.

---

## 3. The Breadboard Canvas: Known Limitations & Non-Dragging Alternatives
Interactive electronic breadboards traditionally rely on complex mouse drag-and-drop interactions that pose severe barriers for keyboard-only and screen-reader users (WCAG 2.2 Success Criterion 2.5.7: Dragging Movements).

To ensure no student is excluded from laboratory work, we have implemented four **Non-Dragging Keyboard Alternatives**:
1. **Click-to-Place from Palette:** Select any IC, resistor, or sensor from the palette, and click **"Place at Selected Hole"** to position it at the currently active tie-strip.
2. **Accessible Parts & Connections Panel:** A dedicated drawer listing all placed breadboard components and wires as accessible, focusable list items, providing direct keyboard buttons to **Move**, **Rotate**, or **Delete** each component.
3. **Keyboard "Add Wire" Dialog:** An accessible modal dialog allowing students to create wire connections by choosing the start pin and target hole from labelled, keyboard-operable dropdowns.
4. **Arrow-Key Hole Navigation:** Students can navigate the breadboard grid hole-by-hole using arrow keys (`Up`, `Down`, `Left`, `Right`), with the active hole coordinate announced via an `aria-live` region (e.g., "Row 14, Column c").

---

## 4. Assessment and Testing
The portal is continuously evaluated using:
- Automated accessibility scanners (axe-core, eslint-plugin-jsx-a11y, Lighthouse Accessibility $\ge 95$).
- Manual keyboard-only navigation passes without a mouse.
- Screen reader testing with NVDA on Windows and VoiceOver on macOS/iOS.

---

## 5. Feedback and Contact
If you encounter an accessibility barrier or have suggestions for improving accessibility, please reach out to us:
- **Email:** [CONTACT EMAIL]
- **Subject:** "Accessibility Feedback - DSD Virtual Lab"
- **Postal Address:** [POSTAL ADDRESS]

We aim to acknowledge and address accessibility feedback within 5 business days.
