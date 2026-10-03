// ==============================================================================
// Legal Documents Content Registry
// Versioned plain-English documents aligned with India DPDP Act 2023 / Rules 2025
// ==============================================================================

export interface LegalDocumentMetadata {
  id: string;
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  targetReadingLevel: string;
  summary: string;
  sections: Array<{
    heading: string;
    content: string[];
    callout?: {
      type: 'info' | 'warning' | 'alert';
      text: string;
    };
  }>;
}

export const PRIVACY_POLICY: LegalDocumentMetadata = {
  id: 'privacy',
  title: 'Privacy Notice & Data Protection Policy',
  version: '1.0.0',
  effectiveDate: 'November 14, 2025',
  lastUpdated: 'November 14, 2025',
  targetReadingLevel: 'Grade 8 (Plain English)',
  summary:
    'Explains what personal data the Virtual DSD Lab collects, why we need it, who can see it, and how you can exercise your statutory rights under the Digital Personal Data Protection Act, 2023.',
  sections: [
    {
      heading: '1. Who We Are and Who Is Responsible',
      content: [
        'This course portal is provided by [COLLEGE LEGAL NAME] ("the College", "we", "us"), affiliated with [COLLEGE AFFILIATION].',
        'Under India\'s Digital Personal Data Protection Act, 2023 (DPDP Act) and the DPDP Rules, 2025, the College acts as the Data Fiduciary. This means we determine why and how your personal data is processed for your engineering laboratory coursework.',
        'If you have any questions or wish to exercise your legal rights, you can reach out directly to our designated Grievance Redressal Officer: [GRIEVANCE OFFICER NAME], Email: [GRIEVANCE OFFICER EMAIL], Postal Address: [POSTAL ADDRESS].',
      ],
    },
    {
      heading: '2. What Data We Collect and Why (Purpose Specification)',
      content: [
        'We follow strict data minimisation principles and only collect data required for your coursework:',
        '• Your College Email & Full Name: Used to create your secure login account, send password reset emails, and show your name on laboratory completion records and faculty rosters. Legal basis: Explicit consent given at signup.',
        '• Your Coursework Progress: Tracks which of the 12 laboratory practicals and 6 theory modules you have completed, ensuring you receive academic credit. Legal basis: Performance of academic obligations and consent.',
        '• Your Quiz Attempts & Scores: Records continuous evaluation test scores and Bloom taxonomy mastery to assist course faculty in identifying learning gaps. Legal basis: Academic evaluation and consent.',
        '• Your Saved Circuits: Keeps your virtual breadboard IC wirings and project schematics safely stored so you can resume work from any computer. Legal basis: Functional necessity and consent.',
        '• AI Tutor Conversations (Optional): If you choose to ask questions to the "Ask the DSD Tutor" assistant, your questions are processed to provide personalized step-by-step guidance. Legal basis: Specific opt-in consent before first use.',
        '• Support & Help Messages: Used solely to troubleshoot technical bugs and reply to your course inquiries.',
      ],
      callout: {
        type: 'info',
        text: 'What we NEVER collect: We do not collect your phone number, date of birth, home address, religion, caste, biometrics, precise GPS coordinates, or device fingerprints. Profile photos (avatars) are never stored; initials are used instead.',
      },
    },
    {
      heading: '3. Who Else Receives Your Information (Service Providers)',
      content: [
        'We never sell, rent, or monetize student information. We only use reputable infrastructure providers under strict contractual confidentiality:',
        '• Supabase Inc.: Hosts our PostgreSQL database and user authentication. Encrypted in transit (TLS 1.3) and at rest (AES-256).',
        '• Anthropic PBC: Powers the DSD Tutor AI assistant via secure backend Edge Functions. Personal names, emails, and student passwords are strictly stripped before messages are sent.',
        '• Google LLC: Provides optional Single Sign-On. Only basic OAuth identity data (email and name) is exchanged.',
        '• Hosting Provider (Vercel / Cloudflare): Serves portal pages over HTTPS with zero advertising trackers or session replay scripts.',
      ],
    },
    {
      heading: '4. Faculty and Administrator Access',
      content: [
        'Authorized course faculty and departmental administrators can view your name, college email, experiment completion records, quiz scores, and saved circuits. This visibility is necessary for semester continuous assessment and academic grading.',
        'Instructors cannot view your passwords or unshared personal notes. Every time an educator or administrator views student details, exports a report, or changes a role, an immutable record is saved to our audit_log table.',
      ],
    },
    {
      heading: '5. Retention and Storage Periods',
      content: [
        '• Active Student Accounts: Retained for the duration of your course enrollment plus 1 academic year for accreditation reviews.',
        '• AI Tutor Chat History: Automatically deleted after 90 days. You can also delete your chat history at any moment.',
        '• Resolved Support Messages: Anonymised after 12 months.',
        '• Unverified Account Signups: Purged automatically after 7 days.',
        '• Account Deletion: If you delete your account via the /my-data page, all personal rows are permanently expunged within 30 days.',
      ],
    },
    {
      heading: '6. Your Rights Under the DPDP Act',
      content: [
        'Under Section 11–14 of the DPDP Act, 2023, you have the following enforceable rights:',
        '1. Right to Access: View all personal data held about you or download a portable JSON copy at /my-data.',
        '2. Right to Correction: Update or correct your profile display name at any time.',
        '3. Right to Erasure: Request permanent deletion of your account and coursework history.',
        '4. Right to Withdraw Consent: Withdrawing consent is as easy as giving consent. You can withdraw your consent from /my-data at any time.',
        '5. Right of Grievance Redressal: Lodge a data grievance directly with our Grievance Officer at [GRIEVANCE OFFICER EMAIL].',
        '6. Right to Nominate: Designate an authorized representative in the event of death or incapacity.',
      ],
    },
    {
      heading: '7. Minimum Age Requirement (18+)',
      content: [
        'This course platform is intended for university engineering students aged 18 years and above. During signup, you must explicitly confirm that you are at least 18 years old.',
        'If a student is below 18 years of age, verifiable parental or legal guardian consent must be provided to the department prior to account activation in compliance with Section 9 of the DPDP Act.',
      ],
    },
    {
      heading: '8. Breach Notification and Security Safeguards',
      content: [
        'We enforce Row Level Security (RLS) on every database table, rate limit all public endpoints, and maintain regular automated backups.',
        'In the event of a security incident involving personal data, we will promptly notify the Data Protection Board of India (DPBI) and affected individuals without delay, in compliance with statutory breach reporting guidelines.',
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDocumentMetadata = {
  id: 'terms',
  title: 'Terms and Conditions of Use',
  version: '1.0.0',
  effectiveDate: 'November 14, 2025',
  lastUpdated: 'November 14, 2025',
  targetReadingLevel: 'Grade 8 (Plain English)',
  summary:
    'Defines the rules for using the Virtual DSD Lab, account responsibilities, academic honesty expectations, simulator approximations, and legal jurisdiction.',
  sections: [
    {
      heading: '1. Eligibility & User Accounts',
      content: [
        'The Virtual DSD Lab is operated by [COLLEGE LEGAL NAME] ("the Institution") for enrolled engineering students and faculty.',
        'You must keep your login credentials secure and confidential. Sharing accounts or attempting to impersonate another student is strictly prohibited.',
      ],
    },
    {
      heading: '2. Academic Honesty & Acceptable Use',
      content: [
        'You agree to use this platform in accordance with the Institution\'s academic code of conduct.',
        '• Quizzes and assessments must represent your own individual effort.',
        '• You must not reverse engineer backend APIs, exploit software bugs, circumvent Row Level Security rules, or overload system servers.',
        'Academic dishonesty will be escalated to the Departmental Academic Disciplinary Committee.',
      ],
    },
    {
      heading: '3. Educational Simulator & Breadboard Disclaimer',
      content: [
        'The virtual breadboard, digital logic IC simulation models (7400, 7402, 7404, 7408, 7432, 7486, 7474, 74138, 555 timers), and microcontroller sketch runners are simplified educational tools.',
        'They are designed for learning digital electronic theory and do NOT simulate real-world thermal breakdown, electromagnetic interference, component manufacturing tolerances, or physical safety limits.',
        'Simulations must NEVER be used to design or validate safety-critical, medical, industrial, or life-support hardware.',
      ],
      callout: {
        type: 'warning',
        text: 'Educational Use Only: Always verify physical hardware circuit wirings with a qualified instructor before applying high-voltage or industrial bench power.',
      },
    },
    {
      heading: '4. AI Tutor Disclaimer',
      content: [
        'The "Ask the DSD Tutor" feature uses generative artificial intelligence to provide helpful hints and conceptual explanations.',
        'AI responses can occasionally be inaccurate, incomplete, or out of date. The AI Tutor is an auxiliary study guide and does NOT replace the authoritative syllabus, prescribed textbooks, or the instructions of your course professors.',
      ],
    },
    {
      heading: '5. User Content & Intellectual Property',
      content: [
        'You retain intellectual rights to the original circuit designs and Verilog testbenches you create.',
        'You grant the Institution a non-exclusive license to simulate, display, and evaluate your coursework for grading, accreditation, and educational reviews.',
        'Course lecture materials, lab manuals, interactive diagrams, and visual illustrations remain the intellectual property of [COLLEGE LEGAL NAME].',
      ],
    },
    {
      heading: '6. Limitation of Liability',
      content: [
        'To the maximum extent permitted by Indian law, the Institution, its trustees, and developers shall not be liable for any indirect or incidental losses, including lost drafts resulting from browser closures or device crashes. Please export important lab work periodically.',
      ],
    },
    {
      heading: '7. Governing Law and Legal Jurisdiction',
      content: [
        'These Terms are governed by the laws of India. Any legal dispute or claim arising out of your use of the Platform shall be resolved exclusively in the competent courts located in [COURT/CITY].',
      ],
    },
  ],
};

export const COOKIE_POLICY: LegalDocumentMetadata = {
  id: 'cookies',
  title: 'Cookie & Browser Storage Policy',
  version: '1.0.0',
  effectiveDate: 'November 14, 2025',
  lastUpdated: 'November 14, 2025',
  targetReadingLevel: 'Grade 8 (Plain English)',
  summary:
    'Details all browser storage keys used by the platform and affirms our zero advertising cookie commitment.',
  sections: [
    {
      heading: '1. Zero Advertising or Tracking Cookies',
      content: [
        'We believe in respect for student privacy. The Virtual DSD Lab uses ZERO advertising cookies, ZERO cross-site tracking pixels, and ZERO third-party marketing analytics scripts.',
        'We do not sell advertising space or share your browsing habits with third-party advertisers.',
      ],
    },
    {
      heading: '2. Strictly Necessary Browser Storage',
      content: [
        'We use standard browser localStorage solely for functionality you directly request:',
        '• sb-*-auth-token: Keeps you securely logged in to your account.',
        '• dsd_course_storage_v1: Saves your dark/light theme, high-contrast mode, sound toggle, and font scaling choices.',
        '• dsd_active_breadboard_circuit: Saves a temporary draft of your wiring so you do not lose your circuit if you refresh the browser.',
        '• dsd_saved_circuits_local: Local circuit library backup for offline use.',
        '• dsd_storage_notice_dismissed: Remembers when you acknowledged this storage notice.',
        '• dsd_tutor_consent: Remembers when you reviewed the AI Tutor privacy notice.',
      ],
    },
    {
      heading: '3. Managing Your Browser Storage',
      content: [
        'Because all items in local storage are strictly necessary for core functionality (security, accessibility, and circuit saving), they do not require an intrusive blocking cookie barrier.',
        'You can clear your local storage at any time through your browser settings (Settings -> Clear Browsing Data -> Cookies and site data). Note that clearing this will sign you out and reset your accessibility theme preferences.',
      ],
    },
  ],
};

export const ACCESSIBILITY_STATEMENT: LegalDocumentMetadata = {
  id: 'accessibility',
  title: 'Accessibility Statement (WCAG 2.2 AA)',
  version: '1.0.0',
  effectiveDate: 'November 14, 2025',
  lastUpdated: 'November 14, 2025',
  targetReadingLevel: 'Grade 8 (Plain English)',
  summary:
    'Documents our conformance target (WCAG 2.2 AA), accessible interface features, and non-dragging keyboard alternatives for the breadboard canvas.',
  sections: [
    {
      heading: '1. Institutional Accessibility Commitment',
      content: [
        '[COLLEGE LEGAL NAME] is committed to making engineering education accessible to all learners, including students with visual, auditory, motor, or cognitive disabilities.',
        'Our target is full conformance with Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.',
      ],
    },
    {
      heading: '2. Accessible Design Features',
      content: [
        '• Skip to Main Content: Press Tab upon page load to reveal the skip link and jump straight to primary content.',
        '• Landmarks & Semantics: All pages use proper semantic landmarks (<header>, <nav>, <main>, <footer>) and structured headings.',
        '• Visible Focus Rings: High-contrast, 2px focus-visible rings highlight the currently focused interactive control.',
        '• Full Keyboard Navigation: Dropdowns, dialogs, quiz questions, and station switches can all be operated with Tab, Enter, Space, and Escape.',
        '• High Contrast & Theme Modes: An instant high-contrast toggle is always available in the top bar.',
        '• Sensory & Motion Preferences: Respects operating system prefers-reduced-motion settings and provides persistent sound toggles.',
        '• Screen Reader Support: All 200+ icon-only buttons include descriptive aria-label attributes, and dynamic updates are announced via polite aria-live regions.',
      ],
    },
    {
      heading: '3. Non-Dragging Breadboard Keyboard Alternatives',
      content: [
        'Interactive breadboards often rely on mouse drag-and-drop, which can create barriers for keyboard users. To meet WCAG 2.2 Success Criterion 2.5.7 (Dragging Movements), we provide 4 non-dragging alternatives:',
        '1. Click-to-Place: Select a component in the palette and click "Place at Selected Hole" to insert it without dragging.',
        '2. Accessible Parts & Connections Panel: A dedicated drawer listing placed ICs, resistors, and wires as focusable list items with keyboard Move, Rotate, and Delete actions.',
        '3. Keyboard "Add Wire" Modal: A form allowing you to select From-Pin and To-Hole from labelled dropdown menus.',
        '4. Arrow-Key Hole Navigation: Navigate breadboard tie-strips using keyboard arrow keys, with coordinates announced via screen reader (e.g. "Row 14, Column c").',
      ],
    },
    {
      heading: '4. Feedback and Grievance',
      content: [
        'If you encounter an accessibility barrier or need course materials in an alternative format, please email [CONTACT EMAIL] with the subject "Accessibility Feedback - DSD Lab". We strive to respond within 5 working days.',
      ],
    },
  ],
};
