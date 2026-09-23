/**
 * Global Academic Site Configuration
 * Aligned with Shah & Anchor Kutchhi Engineering College (SAKEC) / Mumbai University
 * Course: Digital System Design (ECCOR2PC203)
 */

export interface SiteConfig {
  institution: {
    collegeName: string;
    collegeAbbr: string;
    affiliation: string;
    accreditation: string;
    department: string;
    websiteUrl: string;
    academicYear: string;
  };
  course: {
    code: string;
    title: string;
    semester: string;
    year: string;
    scheme: string;
    theoryCredits: number;
    labCredits: number;
    totalCredits: number;
    hoursPerWeek: {
      lectures: number;
      practicals: number;
      tutorials: number;
    };
    totalTheoryHours: number;
    totalLabHours: number;
    description: string;
  };
  facultyCoordinator: {
    namePlaceholder: string;
    designationPlaceholder: string;
    emailPlaceholder: string;
    cabinLocationPlaceholder: string;
    officeHoursPlaceholder: string;
  };
  labInCharge: {
    namePlaceholder: string;
    technicalStaffPlaceholder: string;
    labRoomPlaceholder: string;
  };
  links: {
    mumbaiUniversitySyllabusUrl: string;
    collegePortalUrl: string;
    nptelDsdUrl: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  institution: {
    collegeName: 'Shah & Anchor Kutchhi Engineering College',
    collegeAbbr: 'SAKEC',
    affiliation: 'Affiliated to University of Mumbai',
    accreditation: 'Approved by AICTE, Accredited by NAAC & NBA',
    department: 'Department of Electronics & Computer Science / Computer Engineering',
    websiteUrl: 'https://www.shahandanchor.com',
    academicYear: '2024–2025 / 2025–2026',
  },
  course: {
    code: 'ECCOR2PC203',
    title: 'Digital System Design',
    semester: 'Semester III / IV',
    year: 'Second Year Engineering (SE)',
    scheme: 'Autonomous / NEP Alignment / R-2019 C-Scheme',
    theoryCredits: 3,
    labCredits: 1,
    totalCredits: 4,
    hoursPerWeek: {
      lectures: 3,
      practicals: 2,
      tutorials: 0,
    },
    totalTheoryHours: 30,
    totalLabHours: 24,
    description:
      'Digital System Design covers the foundational concepts and methodologies for designing, analyzing, and verifying complex digital computing systems. The curriculum spans sequential circuits, digital logic families (TTL, CMOS), Finite State Machines (FSMs), Algorithmic State Machine (ASM) charts, Programmable Logic Devices (PLDs), and Hardware Description Language (Verilog HDL) with structural and behavioral verification.',
  },
  facultyCoordinator: {
    namePlaceholder: '[Course Coordinator / Faculty Name, Ph.D. / M.Tech]',
    designationPlaceholder: 'Associate Professor / Assistant Professor, Dept. of Electronics & Computer Science',
    emailPlaceholder: 'dsd.coordinator@sakec.ac.in',
    cabinLocationPlaceholder: 'Academic Block 4, Floor 4, Staff Room 402',
    officeHoursPlaceholder: 'Tuesdays & Thursdays: 3:00 PM – 5:00 PM',
  },
  labInCharge: {
    namePlaceholder: '[Lab In-Charge Faculty Name]',
    technicalStaffPlaceholder: '[Lab Assistant / Technical Instructor Name]',
    labRoomPlaceholder: 'Digital Electronics & Hardware Design Lab (Lab 405)',
  },
  links: {
    mumbaiUniversitySyllabusUrl: 'https://mu.ac.in/syllabus',
    collegePortalUrl: 'https://www.shahandanchor.com',
    nptelDsdUrl: 'https://nptel.ac.in/courses/117106086',
  },
};
