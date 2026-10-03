// ==============================================================================
// FacultyDashboardPage: Class Analytics, Student Roster & Continuous Assessment
// Course: ECCOR2PC203 (DSD) & ECCOR2PC204 (DSA Module 4: MergeSort)
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Award,
  FlaskConical,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Sparkles,
  ShieldAlert,
  Layers,
  History,
  Info,
  Check,
  Zap,
  Inbox,
  MessageSquare,
  Send,
  Star,
  MessageCircle,
  BarChart3,
  LayoutDashboard,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sorting } from '../dsa';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient';
import { playConnectClick, playSuccessChime, playErrorClick } from '../utils/soundEffects';
import { LAB_EXPERIMENTS } from '../data/labs';
import { SupportMessageRecord, SupportMessageStatus } from '../types/database.types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  completedLabs: number[];
  quizAvg: number;
  quizAttemptsCount: number;
  savedCircuitsCount: number;
  lastActive: string;
  status: 'on_track' | 'in_progress' | 'needs_attention';
  breadboardFaults: string[];
  recentQuizzes: { topic: string; score: number; maxScore: number; date: string }[];
}

export interface FacultyReportItem {
  id: string;
  created_at: string;
  title: string;
  format: 'PDF' | 'CSV';
  totalStudents: number;
  classAvgQuiz: number;
  avgLabs: number;
}

// Initial demo roster for SAKEC Mumbai University students
const DEMO_STUDENT_ROSTER: StudentRecord[] = [
  {
    id: 's-101',
    rollNo: '22EC101',
    name: 'Priya Sharma',
    email: 'priya.sharma@sakec.ac.in',
    completedLabs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    quizAvg: 94,
    quizAttemptsCount: 14,
    savedCircuitsCount: 4,
    lastActive: '2026-09-24T18:40:00Z',
    status: 'on_track',
    breadboardFaults: [
      'Prevented floating input on IC 7408 Pin 1 (resolved)',
      'Prevented reverse polarity on Green LED (resolved)',
    ],
    recentQuizzes: [
      { topic: 'Module 3: Sequential Circuits', score: 10, maxScore: 10, date: '2026-09-24' },
      { topic: 'Module 4: Synchronous Counters', score: 9, maxScore: 10, date: '2026-09-23' },
      { topic: 'Module 2: Combinational Logic', score: 10, maxScore: 10, date: '2026-09-21' },
    ],
  },
  {
    id: 's-102',
    rollNo: '22EC102',
    name: 'Aarav Patel',
    email: 'aarav.patel@sakec.ac.in',
    completedLabs: [1, 2, 3, 4, 5, 6, 8, 9, 10],
    quizAvg: 88,
    quizAttemptsCount: 11,
    savedCircuitsCount: 3,
    lastActive: '2026-09-24T15:20:00Z',
    status: 'on_track',
    breadboardFaults: [
      'Prevented direct VCC-GND short circuit on breadboard power rails',
    ],
    recentQuizzes: [
      { topic: 'Module 4: Shift Registers', score: 9, maxScore: 10, date: '2026-09-22' },
      { topic: 'Module 1: Logic Families & VTC', score: 8, maxScore: 10, date: '2026-09-20' },
    ],
  },
  {
    id: 's-103',
    rollNo: '22EC103',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@sakec.ac.in',
    completedLabs: [1, 2, 3, 4, 5, 7, 8],
    quizAvg: 76,
    quizAttemptsCount: 8,
    savedCircuitsCount: 2,
    lastActive: '2026-09-23T11:15:00Z',
    status: 'in_progress',
    breadboardFaults: [
      'Prevented active output clash between Pin 3 and VCC rail',
      'Prevented unpowered input-to-input bridge',
    ],
    recentQuizzes: [
      { topic: 'Module 2: Adders & Subtractors', score: 8, maxScore: 10, date: '2026-09-20' },
      { topic: 'Module 3: Latches & Flip-Flops', score: 7, maxScore: 10, date: '2026-09-18' },
    ],
  },
  {
    id: 's-104',
    rollNo: '22EC104',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@sakec.ac.in',
    completedLabs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    quizAvg: 98,
    quizAttemptsCount: 18,
    savedCircuitsCount: 5,
    lastActive: '2026-09-24T20:10:00Z',
    status: 'on_track',
    breadboardFaults: [],
    recentQuizzes: [
      { topic: 'Module 5: FSM Mealy/Moore Design', score: 10, maxScore: 10, date: '2026-09-24' },
      { topic: 'Module 4: Counters & Registers', score: 10, maxScore: 10, date: '2026-09-22' },
      { topic: 'Full Syllabus Mock Exam', score: 20, maxScore: 20, date: '2026-09-20' },
    ],
  },
  {
    id: 's-105',
    rollNo: '22EC105',
    name: 'Tanvi Kulkarni',
    email: 'tanvi.kulkarni@sakec.ac.in',
    completedLabs: [1, 2, 3, 4, 6, 7],
    quizAvg: 72,
    quizAttemptsCount: 7,
    savedCircuitsCount: 1,
    lastActive: '2026-09-22T09:45:00Z',
    status: 'in_progress',
    breadboardFaults: [
      'Prevented self-loop wire on IC Pin 3',
    ],
    recentQuizzes: [
      { topic: 'Module 3: Flip-Flops', score: 7, maxScore: 10, date: '2026-09-19' },
    ],
  },
  {
    id: 's-106',
    rollNo: '22EC106',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@sakec.ac.in',
    completedLabs: [1, 2, 3],
    quizAvg: 48,
    quizAttemptsCount: 4,
    savedCircuitsCount: 1,
    lastActive: '2026-09-18T14:30:00Z',
    status: 'needs_attention',
    breadboardFaults: [
      'Prevented VCC-GND short circuit on breadboard top bus',
      'Prevented inverted polarity on LED cathode',
    ],
    recentQuizzes: [
      { topic: 'Module 1: Number Systems & Logic Gates', score: 5, maxScore: 10, date: '2026-09-17' },
      { topic: 'Module 2: Boolean Algebra', score: 4, maxScore: 10, date: '2026-09-15' },
    ],
  },
  {
    id: 's-107',
    rollNo: '22EC107',
    name: 'Sneha Joshi',
    email: 'sneha.joshi@sakec.ac.in',
    completedLabs: [1, 2, 3, 4, 5, 8, 9, 10],
    quizAvg: 82,
    quizAttemptsCount: 10,
    savedCircuitsCount: 2,
    lastActive: '2026-09-24T12:00:00Z',
    status: 'on_track',
    breadboardFaults: [],
    recentQuizzes: [
      { topic: 'Module 3: Masters-Slave JK', score: 8, maxScore: 10, date: '2026-09-21' },
      { topic: 'Module 4: Ripple Counters', score: 8, maxScore: 10, date: '2026-09-20' },
    ],
  },
  {
    id: 's-108',
    rollNo: '22EC108',
    name: 'Devansh Nair',
    email: 'devansh.nair@sakec.ac.in',
    completedLabs: [1, 2, 3, 4, 5],
    quizAvg: 65,
    quizAttemptsCount: 6,
    savedCircuitsCount: 1,
    lastActive: '2026-09-21T16:20:00Z',
    status: 'in_progress',
    breadboardFaults: [
      'Prevented floating inputs on 7408 AND gate',
    ],
    recentQuizzes: [
      { topic: 'Module 2: Multiplexers', score: 6, maxScore: 10, date: '2026-09-19' },
    ],
  },
  {
    id: 's-109',
    rollNo: '22EC109',
    name: 'Pooja Sawant',
    email: 'pooja.sawant@sakec.ac.in',
    completedLabs: [1, 2],
    quizAvg: 42,
    quizAttemptsCount: 3,
    savedCircuitsCount: 0,
    lastActive: '2026-09-15T10:15:00Z',
    status: 'needs_attention',
    breadboardFaults: [
      'Prevented short circuit between VCC rail and GND rail',
    ],
    recentQuizzes: [
      { topic: 'Module 1: Logic Gates', score: 4, maxScore: 10, date: '2026-09-14' },
    ],
  },
  {
    id: 's-110',
    rollNo: '22EC110',
    name: 'Sameer Khan',
    email: 'sameer.khan@sakec.ac.in',
    completedLabs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    quizAvg: 90,
    quizAttemptsCount: 13,
    savedCircuitsCount: 3,
    lastActive: '2026-09-24T17:50:00Z',
    status: 'on_track',
    breadboardFaults: [
      'Prevented duplicated wire on Pin 3',
    ],
    recentQuizzes: [
      { topic: 'Module 4: Ring & Johnson Counters', score: 9, maxScore: 10, date: '2026-09-23' },
      { topic: 'Module 3: T Flip-Flops', score: 9, maxScore: 10, date: '2026-09-21' },
    ],
  },
];

type SortKey = 'name' | 'rollNo' | 'labs' | 'quiz' | 'circuits' | 'lastActive';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'on_track' | 'in_progress' | 'needs_attention';

interface FacultyDashboardPageProps {
  onNavigateTab?: (tab: string, extraId?: string | number) => void;
}

export const FacultyDashboardPage: React.FC<FacultyDashboardPageProps> = ({ onNavigateTab }) => {
  const { user, role, isFacultyOrAdmin, switchDemoRole, openAuthModal } = useAuth();

  const [students, setStudents] = useState<StudentRecord[]>(DEMO_STUDENT_ROSTER);
  const [loading, setLoading] = useState(false);
  const [activeFacultyTab, setActiveFacultyTab] = useState<'overview' | 'students' | 'reports' | 'feedback_inbox'>('overview');
  const [batchFilter, setBatchFilter] = useState<'all' | 'A' | 'B' | 'C'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('labs');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [reportsList, setReportsList] = useState<FacultyReportItem[]>([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showReportSuccessModal, setShowReportSuccessModal] = useState(false);
  const [lastGeneratedReport, setLastGeneratedReport] = useState<string | null>(null);

  // Support messages for Feedback Inbox
  const [supportMessages, setSupportMessages] = useState<SupportMessageRecord[]>([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportTypeFilter, setSupportTypeFilter] = useState<string>('all');
  const [supportStatusFilter, setSupportStatusFilter] = useState<string>('all');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [submittingReply, setSubmittingReply] = useState(false);

  // Load support messages
  const loadSupportMessages = async () => {
    setSupportLoading(true);
    try {
      if (SUPABASE_CONFIGURED) {
        const { data, error } = await supabase
          .from('support_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          setSupportMessages(data as SupportMessageRecord[]);
          return;
        }
      }
      const saved = localStorage.getItem('dsd_support_messages');
      if (saved) {
        setSupportMessages(JSON.parse(saved));
      } else {
        const sample: SupportMessageRecord[] = [
          {
            id: 'fb-demo-1',
            user_id: 's-101',
            type: 'bug_report',
            category: 'breadboard',
            subject: 'IC 7408 AND gate pin 3 logic high anomaly',
            message: 'In Breadboard Sandbox, connecting high to pin 1 and low to pin 2 gave high on pin 3 before pressing power reset.',
            status: 'resolved',
            admin_reply: 'Reviewed and fixed in simulator gate solver v2.4.1.',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date().toISOString(),
            contact_email: 'priya.sharma@sakec.ac.in',
            rating: 4,
          },
          {
            id: 'fb-demo-2',
            user_id: 's-102',
            type: 'help_request',
            category: 'lab_manual',
            subject: 'Question regarding Lab 7 ripple counter propagation delay calculation',
            message: 'Are we expected to calculate the total worst-case ripple delay using 4 x tpd in our term-work writeup?',
            status: 'new',
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            contact_email: 'aarav.patel@sakec.ac.in',
            rating: 5,
          },
        ];
        setSupportMessages(sample);
        localStorage.setItem('dsd_support_messages', JSON.stringify(sample));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSupportLoading(false);
    }
  };

  useEffect(() => {
    loadSupportMessages();
  }, []);

  const handleSendReply = async (messageId: string) => {
    const text = replyTextMap[messageId]?.trim();
    if (!text) return;
    setSubmittingReply(true);
    playConnectClick();

    try {
      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase
          .from('support_messages')
          .update({
            admin_reply: text,
            status: 'resolved',
            updated_at: new Date().toISOString(),
          })
          .eq('id', messageId);
        if (error) throw error;
      }

      setSupportMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                admin_reply: text,
                status: 'resolved' as SupportMessageStatus,
                updated_at: new Date().toISOString(),
              }
            : m
        )
      );

      const saved = localStorage.getItem('dsd_support_messages');
      if (saved) {
        const parsed: SupportMessageRecord[] = JSON.parse(saved);
        const updated = parsed.map((m) =>
          m.id === messageId
            ? { ...m, admin_reply: text, status: 'resolved' as SupportMessageStatus, updated_at: new Date().toISOString() }
            : m
        );
        localStorage.setItem('dsd_support_messages', JSON.stringify(updated));
      }

      setReplyingId(null);
      playSuccessChime();
    } catch (err: any) {
      console.error('Error sending reply:', err);
      playErrorClick();
    } finally {
      setSubmittingReply(false);
    }
  };

  // Load past reports from localStorage and Supabase
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dsd_faculty_reports');
      if (stored) {
        setReportsList(JSON.parse(stored));
      } else {
        // Initial sample report
        const initialReport: FacultyReportItem = {
          id: 'rep-prev-1',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          title: 'ECCOR2PC203 Mid-Term Continuous Assessment Report',
          format: 'PDF',
          totalStudents: DEMO_STUDENT_ROSTER.length,
          classAvgQuiz: 76.5,
          avgLabs: 7.4,
        };
        setReportsList([initialReport]);
        localStorage.setItem('dsd_faculty_reports', JSON.stringify([initialReport]));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch real Supabase records if configured
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;

    async function fetchRosterFromCloud() {
      setLoading(true);
      try {
        const { data: profiles, error: pError } = await supabase
          .from('profiles')
          .select('id, email, display_name, role, updated_at')
          .order('display_name');

        if (pError || !profiles || profiles.length === 0) return;

        const { data: progressRows } = await supabase
          .from('progress')
          .select('user_id, completed_labs, quiz_scores, updated_at');

        const { data: circuits } = await supabase
          .from('saved_circuits')
          .select('user_id, id');

        const studentProfiles = profiles.filter((p) => p.role === 'student');
        if (studentProfiles.length > 0) {
          const cloudRoster: StudentRecord[] = studentProfiles.map((p, idx) => {
            const prog = progressRows?.find((r) => r.user_id === p.id);
            const userCircuits = circuits?.filter((c) => c.user_id === p.id) || [];
            const completed = (prog?.completed_labs as number[]) || [];
            const scoresObj = (prog?.quiz_scores as Record<string, number>) || {};
            const scores = Object.values(scoresObj);
            const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 75;

            let status: StudentRecord['status'] = 'in_progress';
            if (completed.length >= 8 && avg >= 70) status = 'on_track';
            else if (completed.length < 4 || avg < 50) status = 'needs_attention';

            return {
              id: p.id,
              rollNo: `22EC${101 + idx}`,
              name: p.display_name || p.email.split('@')[0],
              email: p.email,
              completedLabs: completed,
              quizAvg: avg,
              quizAttemptsCount: scores.length,
              savedCircuitsCount: userCircuits.length,
              lastActive: p.updated_at || new Date().toISOString(),
              status,
              breadboardFaults: [],
              recentQuizzes: [],
            };
          });
          setStudents(cloudRoster);
        }
      } catch (err) {
        console.warn('Could not fetch cloud roster, keeping demo roster', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRosterFromCloud();
  }, []);

  // Compute Class Overview Metrics
  const metrics = useMemo(() => {
    const total = students.length;
    if (total === 0) return { total: 0, avgQuiz: 0, avgLabs: 0, strugglingTopic: 'None', onTrackCount: 0, attentionCount: 0 };

    const totalQuiz = students.reduce((acc, s) => acc + s.quizAvg, 0);
    const totalLabs = students.reduce((acc, s) => acc + s.completedLabs.length, 0);
    const onTrack = students.filter((s) => s.status === 'on_track').length;
    const attention = students.filter((s) => s.status === 'needs_attention').length;

    // Determine lab with lowest completion rate
    const labCounts: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) labCounts[i] = 0;
    students.forEach((s) => {
      s.completedLabs.forEach((labId) => {
        if (labCounts[labId] !== undefined) labCounts[labId]++;
      });
    });

    let minLabId = 1;
    let minCount = total;
    Object.entries(labCounts).forEach(([labIdStr, count]) => {
      const idNum = parseInt(labIdStr, 10);
      if (count < minCount) {
        minCount = count;
        minLabId = idNum;
      }
    });

    const strugglingLab = LAB_EXPERIMENTS.find((l) => l.id === minLabId);
    const strugglingTopic = strugglingLab ? `Lab ${minLabId}: ${strugglingLab.shortTitle}` : 'Lab 7: Mod-16 Ripple Counter';

    return {
      total,
      avgQuiz: Math.round((totalQuiz / total) * 10) / 10,
      avgLabs: Math.round((totalLabs / total) * 10) / 10,
      strugglingTopic,
      onTrackCount: onTrack,
      attentionCount: attention,
    };
  }, [students]);

  // Filter students by search query, status filter, and batch division
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

      let matchesBatch = true;
      if (batchFilter !== 'all') {
        const num = parseInt(s.rollNo.replace(/\D/g, ''), 10) % 100;
        if (batchFilter === 'A') matchesBatch = num >= 1 && num <= 4;
        else if (batchFilter === 'B') matchesBatch = num >= 5 && num <= 7;
        else if (batchFilter === 'C') matchesBatch = num >= 8;
      }

      return matchesSearch && matchesStatus && matchesBatch;
    });
  }, [students, searchQuery, statusFilter, batchFilter]);

  // ==============================================================================
  // DSA MODULE 4: MERGESORT IMPLEMENTATION
  // Course ECCOR2PC204: Algorithm Analysis and Efficiency (CO4) - Section 4.2
  //
  // Why MergeSort here?
  // 1. Guaranteed O(N log N) runtime in worst, average, and best cases.
  // 2. STABILITY: Preserves original secondary ordering (e.g., students with the same
  //    quiz score or lab count retain their alphabetical/roll number order).
  // 3. Implemented via our official Sorting.mergeSort() class in src/dsa/Sorting.ts.
  // ==============================================================================
  const sortedStudents = useMemo(() => {
    const comparator = (a: StudentRecord, b: StudentRecord): number => {
      let result = 0;
      switch (sortKey) {
        case 'name':
          result = a.name.localeCompare(b.name);
          break;
        case 'rollNo':
          result = a.rollNo.localeCompare(b.rollNo);
          break;
        case 'labs':
          result = a.completedLabs.length - b.completedLabs.length;
          break;
        case 'quiz':
          result = a.quizAvg - b.quizAvg;
          break;
        case 'circuits':
          result = a.savedCircuitsCount - b.savedCircuitsCount;
          break;
        case 'lastActive':
          result = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
          break;
        default:
          result = 0;
      }
      return sortDirection === 'asc' ? result : -result;
    };

    // Official call to DSA class Sorting.mergeSort
    return Sorting.mergeSort(filteredStudents, comparator);
  }, [filteredStudents, sortKey, sortDirection]);

  const handleSortToggle = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection(key === 'name' || key === 'rollNo' ? 'asc' : 'desc');
    }
    playConnectClick();
  };

  // Generate CSV Report
  const handleExportCSV = () => {
    playConnectClick();
    const headers = ['Roll No', 'Full Name', 'College Email', 'Labs Completed (/12)', 'Quiz Average (%)', 'Saved Circuits', 'Status', 'Last Active'];
    const rows = sortedStudents.map((s) => [
      `"${s.rollNo}"`,
      `"${s.name}"`,
      `"${s.email}"`,
      `${s.completedLabs.length}`,
      `${s.quizAvg}%`,
      `${s.savedCircuitsCount}`,
      `"${s.status.replace('_', ' ').toUpperCase()}"`,
      `"${new Date(s.lastActive).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filename = `DSD_ECCOR2PC203_Class_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    recordGeneratedReport('CSV', filename);
  };

  // Generate Official PDF Report using jsPDF + autoTable
  const handleExportPDF = () => {
    setGeneratingReport(true);
    playConnectClick();

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // SAKEC Institutional Header
      doc.setFillColor(24, 32, 79); // Deep Navy SAKEC brand
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('MAHAVIR EDUCATION TRUST’S', 105, 10, { align: 'center' });
      doc.setFontSize(13);
      doc.text('SHAH & ANCHOR KUTCHHI ENGINEERING COLLEGE', 105, 17, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Department of Electronics & Computer Science • Mumbai University Course Portal', 105, 23, { align: 'center' });
      doc.setFontSize(8.5);
      doc.text('ECCOR2PC203: Digital System Design Laboratory • Continuous Assessment Report', 105, 28, { align: 'center' });

      // Metadata Block
      doc.setTextColor(30, 30, 40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('LABORATORY PERFORMANCE & CONTINUOUS ASSESSMENT RECORD', 14, 42);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const dateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      doc.text(`Generated Date: ${dateStr}`, 14, 48);
      doc.text(`Instructor: Prof. Rajesh Verma (Faculty In-Charge)`, 14, 53);
      doc.text(`Academic Term: Even Semester 2026-2027`, 14, 58);

      // Summary Metric Box
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(125, 38, 71, 23, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`Total Enrolled: ${metrics.total} Students`, 128, 44);
      doc.text(`Class Quiz Average: ${metrics.avgQuiz}%`, 128, 50);
      doc.text(`Average Labs Completed: ${metrics.avgLabs} / 12`, 128, 56);

      // Student Performance Table
      const tableHead = [['Roll No', 'Student Name', 'College Email', 'Labs (/12)', 'Quiz Avg', 'Circuits', 'Status']];
      const tableBody = sortedStudents.map((s) => [
        s.rollNo,
        s.name,
        s.email,
        `${s.completedLabs.length} / 12`,
        `${s.quizAvg}%`,
        `${s.savedCircuitsCount}`,
        s.status === 'on_track' ? 'ON TRACK' : s.status === 'in_progress' ? 'IN PROGRESS' : 'ATTENTION',
      ]);

      autoTable(doc, {
        head: tableHead,
        body: tableBody,
        startY: 65,
        theme: 'striped',
        styles: {
          fontSize: 8.5,
          cellPadding: 2.5,
          font: 'helvetica',
          textColor: [30, 30, 40],
        },
        headStyles: {
          fillColor: [37, 99, 235], // Brand Blue
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 20, fontStyle: 'bold' },
          1: { cellWidth: 40 },
          2: { cellWidth: 50 },
          3: { cellWidth: 22, halign: 'center' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 18, halign: 'center' },
          6: { cellWidth: 26, halign: 'center' },
        },
        didDrawPage: (data) => {
          // Footer
          doc.setFontSize(7.5);
          doc.setTextColor(130, 130, 130);
          doc.text(
            'Report generated via Virtual DSD Lab (ECCOR2PC203/ECCOR2PC204) • SAKEC Mumbai University',
            14,
            doc.internal.pageSize.height - 8
          );
          doc.text(
            `Page ${data.pageNumber} of ${(doc as any).getNumberOfPages()}`,
            doc.internal.pageSize.width - 14,
            doc.internal.pageSize.height - 8,
            { align: 'right' }
          );
        },
      });

      const filename = `DSD_ECCOR2PC203_Assessment_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
      recordGeneratedReport('PDF', filename);
      playSuccessChime();
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Record report generation to state & storage
  const recordGeneratedReport = (fmt: 'PDF' | 'CSV', title: string) => {
    const newReport: FacultyReportItem = {
      id: `rep-${Date.now()}`,
      created_at: new Date().toISOString(),
      title,
      format: fmt,
      totalStudents: sortedStudents.length,
      classAvgQuiz: metrics.avgQuiz,
      avgLabs: metrics.avgLabs,
    };

    const updated = [newReport, ...reportsList];
    setReportsList(updated);
    try {
      localStorage.setItem('dsd_faculty_reports', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Also persist to Supabase if available
    if (SUPABASE_CONFIGURED && user) {
      supabase.from('faculty_reports').insert({
        faculty_id: user.id,
        title,
        report_type: fmt.toLowerCase(),
        student_count: sortedStudents.length,
        class_average_quiz: metrics.avgQuiz,
        average_labs_completed: metrics.avgLabs,
      }).then(() => {});
    }

    setLastGeneratedReport(title);
    setShowReportSuccessModal(true);
  };

  // Route Guard: Access Restricted for non-faculty
  if (!isFacultyOrAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="p-8 rounded-3xl bg-white dark:bg-darklab-card border-2 border-indigo-100 dark:border-darklab-border shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-2xl text-ink-900 dark:text-cream-paper">
              Faculty & Instructor Access Required
            </h2>
            <p className="text-sm text-ink-600 dark:text-cream-muted max-w-md mx-auto leading-relaxed">
              The Faculty Dashboard contains class roster records, continuous assessment scores, and syllabus completion analytics restricted to authorized SAKEC educators.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-start via-brand-mid to-brand-end text-white font-bold text-xs sm:text-sm shadow-md shadow-brand/20 hover:opacity-95 transition-all"
            >
              Sign In with Faculty Account
            </button>
            <button
              onClick={() => switchDemoRole('faculty')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Preview Demo Faculty Role</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl overflow-hidden border border-indigo-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                ECCOR2PC203 • Faculty Portal
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Continuous Assessment
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-sans font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                DSA Module 4 (MergeSort)
              </span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
              Faculty Class Management & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
              Monitor student completion across all 12 syllabus practicals, evaluate automated quiz scores, inspect solderless breadboard circuit diagnostic logs, and export official Continuous Assessment reports for Mumbai University.
            </p>
          </div>

          {/* Action Buttons: Generate Class Report */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 backdrop-blur-sm transition-all flex items-center gap-2 shadow-xs active:scale-95"
              title="Download CSV Table"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={generatingReport}
              className="btn-brand-gradient px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand/30 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
              title="Generate Official SAKEC PDF Assessment Report"
            >
              {generatingReport ? (
                <span>Generating PDF...</span>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-white" />
                  <span>Generate Class PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-cream-border dark:border-darklab-border">
        <button
          type="button"
          onClick={() => {
            setActiveFacultyTab('overview');
            playConnectClick();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeFacultyTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:text-indigo-600 border border-cream-border dark:border-darklab-border'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveFacultyTab('students');
            playConnectClick();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeFacultyTab === 'students'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:text-indigo-600 border border-cream-border dark:border-darklab-border'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Roster</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            {filteredStudents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveFacultyTab('reports');
            playConnectClick();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeFacultyTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:text-indigo-600 border border-cream-border dark:border-darklab-border'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Continuous Assessment Reports</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            {reportsList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveFacultyTab('feedback_inbox');
            playConnectClick();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeFacultyTab === 'feedback_inbox'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:text-indigo-600 border border-cream-border dark:border-darklab-border'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Student Support Inbox</span>
          {supportMessages.filter((m) => m.status === 'new').length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-white">
              {supportMessages.filter((m) => m.status === 'new').length} new
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeFacultyTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top 4 Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-ink-500 dark:text-cream-muted">
                <span className="text-xs font-bold uppercase tracking-wider">Enrolled Students</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-2xl text-ink-900 dark:text-cream-paper">
                  {metrics.total}
                </span>
                <span className="text-[11px] font-sans font-bold text-emerald-600 dark:text-emerald-400">
                  {metrics.onTrackCount} on track
                </span>
              </div>
              <p className="text-[11px] text-ink-400 dark:text-cream-muted">
                Active class roster registered for Semester 4
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-ink-500 dark:text-cream-muted">
                <span className="text-xs font-bold uppercase tracking-wider">Class Quiz Average</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-2xl text-ink-900 dark:text-cream-paper">
                  {metrics.avgQuiz}%
                </span>
                <span className="text-[11px] font-sans font-bold text-ink-500 dark:text-cream-muted">
                  across 6 theory modules
                </span>
              </div>
              <p className="text-[11px] text-ink-400 dark:text-cream-muted">
                Automated concept check evaluations
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-ink-500 dark:text-cream-muted">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Labs Completed</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-2xl text-ink-900 dark:text-cream-paper">
                  {metrics.avgLabs}
                </span>
                <span className="text-xs text-ink-400 dark:text-cream-muted">/ 12 Practicals</span>
              </div>
              <p className="text-[11px] text-ink-400 dark:text-cream-muted">
                Overall syllabus completion rate: {Math.round((metrics.avgLabs / 12) * 100)}%
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-ink-500 dark:text-cream-muted">
                <span className="text-xs font-bold uppercase tracking-wider">Challenging Area</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-400 truncate">
                  {metrics.strugglingTopic}
                </span>
              </div>
              <p className="text-[11px] text-ink-400 dark:text-cream-muted">
                Topic with highest diagnostic circuit fault count
              </p>
            </div>
          </div>

          {/* Quick Actions & Syllabus Completion Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-ink-900 dark:text-cream-paper">
                Quick Faculty Actions
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => setActiveFacultyTab('students')}
                  className="p-3 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-left hover:border-indigo-300 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="text-xs font-bold block text-ink-800 dark:text-cream-paper">Student Roster</span>
                      <span className="text-[11px] text-ink-500">Inspect individual student progress</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-400" />
                </button>

                <button
                  onClick={handleExportPDF}
                  disabled={generatingReport}
                  className="p-3 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-left hover:border-indigo-300 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold block text-ink-800 dark:text-cream-paper">Generate Class PDF</span>
                      <span className="text-[11px] text-ink-500">Download formatted marksheet</span>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-ink-400" />
                </button>

                <button
                  onClick={() => setActiveFacultyTab('feedback_inbox')}
                  className="p-3 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-left hover:border-indigo-300 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-xs font-bold block text-ink-800 dark:text-cream-paper">Support Inbox</span>
                      <span className="text-[11px] text-ink-500">
                        {supportMessages.filter((m) => m.status === 'new').length} pending student inquiries
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-400" />
                </button>
              </div>
            </div>

            {/* Recent Live Activity Feed */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-ink-900 dark:text-cream-paper flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Recent Class Practical & Viva Activity</span>
                </h3>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-cream-soft/60 dark:bg-darklab-base/60 border border-cream-border dark:border-darklab-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-ink-900 dark:text-cream-paper">Aarav Patel</span> completed{' '}
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">Lab 6: 4-Bit Synchronous Adder</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-ink-400 shrink-0 font-mono">2h ago</span>
                </div>

                <div className="p-3 rounded-2xl bg-cream-soft/60 dark:bg-darklab-base/60 border border-cream-border dark:border-darklab-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-ink-900 dark:text-cream-paper">Priya Sharma</span> scored{' '}
                      <span className="font-mono text-emerald-600 font-bold">10/10</span> in Module 3 Sequential Circuits Quiz
                    </div>
                  </div>
                  <span className="text-[11px] text-ink-400 shrink-0 font-mono">4h ago</span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-ink-900 dark:text-cream-paper">Safety Intervention</span>: Devansh Nair attempted wiring without IC VCC connection (resolved)
                    </div>
                  </div>
                  <span className="text-[11px] text-ink-400 shrink-0 font-mono">Yesterday</span>
                </div>
              </div>
            </div>
          </div>

          {/* 12 Practicals Completion Overview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-ink-900 dark:text-cream-paper">
              Syllabus Practical Completion Breakdown (12 Experiments)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {LAB_EXPERIMENTS.map((lab) => {
                const count = students.filter((s) => s.completedLabs.includes(lab.id)).length;
                const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                return (
                  <div
                    key={lab.id}
                    className="p-3 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[10px] text-indigo-600 dark:text-indigo-400">
                        Lab {lab.id}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-ink-500">
                        {count}/{students.length} ({pct}%)
                      </span>
                    </div>
                    <p className="font-medium text-ink-800 dark:text-cream-paper truncate text-[11px]">
                      {lab.shortTitle}
                    </p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS ROSTER */}
      {activeFacultyTab === 'students' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Roster Controls: Search, Filter, Batch & MergeSort */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search by student name, roll no, or college email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                />
              </div>

              {/* Batch & Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
                {/* Batch Selector */}
                <div className="flex items-center gap-1 bg-cream-soft dark:bg-darklab-base p-1 rounded-xl border border-cream-border dark:border-darklab-border">
                  <span className="text-[10px] font-bold text-ink-500 px-1.5 uppercase">Batch:</span>
                  {(['all', 'A', 'B', 'C'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBatchFilter(b)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                        batchFilter === b ? 'bg-indigo-600 text-white shadow-xs' : 'text-ink-600 hover:text-ink-900'
                      }`}
                    >
                      {b === 'all' ? 'All' : `Batch ${b}`}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                {(['all', 'on_track', 'in_progress', 'needs_attention'] as StatusFilter[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 capitalize ${
                      statusFilter === st
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted hover:text-ink-900 hover:bg-cream-border/40'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* DSA Module 4 MergeSort Indicator & Sorter Toolbar */}
            <div className="pt-2 border-t border-cream-border/60 dark:border-darklab-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-[11px] border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  <span>DSA Module 4: MergeSort Active</span>
                </div>
                <span className="text-[11px] text-ink-500 dark:text-cream-muted hidden md:inline">
                  Stable divide-and-conquer &bull; Guaranteed O(N log N) algorithmic complexity
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-ink-400 dark:text-cream-muted">Sort By:</span>
                <button
                  onClick={() => handleSortToggle('rollNo')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                    sortKey === 'rollNo' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-200' : 'text-ink-600 dark:text-cream-muted hover:bg-cream-soft'
                  }`}
                >
                  Roll No {sortKey === 'rollNo' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSortToggle('name')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                    sortKey === 'name' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-200' : 'text-ink-600 dark:text-cream-muted hover:bg-cream-soft'
                  }`}
                >
                  Name {sortKey === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSortToggle('labs')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                    sortKey === 'labs' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-200' : 'text-ink-600 dark:text-cream-muted hover:bg-cream-soft'
                  }`}
                >
                  Labs {sortKey === 'labs' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSortToggle('quiz')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                    sortKey === 'quiz' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-200' : 'text-ink-600 dark:text-cream-muted hover:bg-cream-soft'
                  }`}
                >
                  Quiz Score {sortKey === 'quiz' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-soft/80 dark:bg-darklab-base/80 border-b border-cream-border dark:border-darklab-border text-ink-500 dark:text-cream-muted font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Roll No</th>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">College Email</th>
                    <th className="py-3.5 px-4 text-center">Labs Completed</th>
                    <th className="py-3.5 px-4 text-center">Quiz Average</th>
                    <th className="py-3.5 px-4 text-center">Circuits</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border/60 dark:divide-darklab-border/60 font-sans">
                  {sortedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-ink-400 dark:text-cream-muted">
                        No students match the selected filter or search query.
                      </td>
                    </tr>
                  ) : (
                    sortedStudents.map((student) => {
                      const labsCount = student.completedLabs.length;
                      const pct = Math.round((labsCount / 12) * 100);

                      return (
                        <tr
                          key={student.id}
                          onClick={() => {
                            setSelectedStudent(student);
                            playConnectClick();
                          }}
                          className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors group"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-ink-800 dark:text-cream-paper">
                            {student.rollNo}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-ink-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {student.name}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-ink-500 dark:text-cream-muted font-mono text-[11px]">
                            {student.email}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-brand-500 h-full rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-ink-800 dark:text-cream-paper text-[11px]">
                                {labsCount}/12
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full font-mono font-bold text-[11px] ${
                                student.quizAvg >= 80
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : student.quizAvg >= 60
                                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              }`}
                            >
                              {student.quizAvg}%
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono text-ink-700 dark:text-cream-muted">
                            {student.savedCircuitsCount}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide ${
                                student.status === 'on_track'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : student.status === 'in_progress'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              }`}
                            >
                              {student.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded-lg bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS */}
      {activeFacultyTab === 'reports' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Report Generator Controls */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper">
                  Continuous Assessment Report Generator
                </h3>
                <p className="text-xs text-ink-500 dark:text-cream-muted">
                  Export verified class assessment records compliant with Mumbai University Term Work scheme.
                </p>
              </div>

              {/* Batch Filter for Reports */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink-600">Select Batch:</span>
                <select
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-bold"
                >
                  <option value="all">All Divisions (Full Class)</option>
                  <option value="A">Division A (Roll 101 - 104)</option>
                  <option value="B">Division B (Roll 105 - 107)</option>
                  <option value="C">Batch C (Roll 108+)</option>
                </select>
              </div>
            </div>

            {/* Quick Metrics for selected batch */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-center">
              <div>
                <span className="text-[10px] font-bold text-ink-400 uppercase">Filtered Students</span>
                <p className="font-display font-black text-xl text-ink-900 dark:text-cream-paper">{sortedStudents.length}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-ink-400 uppercase">Class Avg Quiz</span>
                <p className="font-display font-black text-xl text-emerald-600">{metrics.avgQuiz}%</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-ink-400 uppercase">Average Completed Labs</span>
                <p className="font-display font-black text-xl text-indigo-600">{metrics.avgLabs} / 12</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleExportPDF}
                disabled={generatingReport}
                className="btn-brand-gradient px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md shadow-brand/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>{generatingReport ? 'Generating PDF...' : 'Download Official PDF Report'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-ink-800 dark:text-cream-paper font-bold text-xs sm:text-sm hover:bg-cream-soft flex items-center gap-2 active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Download CSV Spreadsheet</span>
              </button>
            </div>
          </div>

          {/* Past Reports Log */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <h3 className="font-display font-extrabold text-base text-ink-900 dark:text-cream-paper flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              <span>Past Generated Continuous Assessment Reports</span>
            </h3>

            <div className="divide-y divide-cream-border dark:divide-darklab-border">
              {reportsList.map((rep) => (
                <div key={rep.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${rep.format === 'PDF' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'}`}>
                        {rep.format}
                      </span>
                      <span className="font-bold text-ink-900 dark:text-cream-paper">{rep.title}</span>
                    </div>
                    <div className="text-[11px] text-ink-400 dark:text-cream-muted flex items-center gap-3">
                      <span>Created: {new Date(rep.created_at).toLocaleString()}</span>
                      <span>&bull;</span>
                      <span>Students: {rep.totalStudents}</span>
                      <span>&bull;</span>
                      <span>Class Avg: {rep.classAvgQuiz}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (rep.format === 'PDF') handleExportPDF();
                      else handleExportCSV();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted hover:text-indigo-600 font-bold text-[11px] flex items-center gap-1.5 self-start sm:self-center transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Re-Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEEDBACK & SUPPORT INBOX */}
      {activeFacultyTab === 'feedback_inbox' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Inbox Filter Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-indigo-600" />
                  <span>Student Feedback & Support Tickets</span>
                </h3>
                <p className="text-xs text-ink-500 dark:text-cream-muted">
                  Read student feedback, answer lab help questions, and resolve reported simulator issues.
                </p>
              </div>

              <button
                onClick={loadSupportMessages}
                className="px-3 py-1.5 rounded-xl bg-cream-soft dark:bg-darklab-base text-xs font-bold text-ink-700 self-start sm:self-auto border border-cream-border"
              >
                Refresh Inbox
              </button>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cream-border dark:border-darklab-border text-xs">
              <span className="font-bold text-ink-400">Type:</span>
              {['all', 'bug_report', 'help_request', 'feedback'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSupportTypeFilter(t)}
                  className={`px-3 py-1 rounded-xl font-bold capitalize transition-colors ${
                    supportTypeFilter === t ? 'bg-indigo-600 text-white' : 'bg-cream-soft text-ink-700'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}

              <span className="font-bold text-ink-400 ml-3">Status:</span>
              {['all', 'new', 'in_review', 'resolved'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSupportStatusFilter(s)}
                  className={`px-3 py-1 rounded-xl font-bold capitalize transition-colors ${
                    supportStatusFilter === s ? 'bg-indigo-600 text-white' : 'bg-cream-soft text-ink-700'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Messages List */}
          {supportLoading ? (
            <div className="py-12 text-center text-xs text-ink-400">Loading inbox...</div>
          ) : supportMessages.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-darklab-card border border-cream-border text-xs text-ink-500">
              No tickets found matching your filter criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {supportMessages
                .filter((m) => supportTypeFilter === 'all' || m.type === supportTypeFilter)
                .filter((m) => supportStatusFilter === 'all' || m.status === supportStatusFilter)
                .map((msg) => (
                  <div
                    key={msg.id}
                    className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 uppercase">
                          {msg.type}
                        </span>
                        <span className="text-xs font-mono text-ink-500">{msg.category}</span>
                        <h4 className="font-bold text-sm text-ink-900 dark:text-cream-paper">{msg.subject}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-ink-400">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            msg.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : msg.status === 'in_review'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-700 dark:text-cream-muted leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="text-[11px] text-ink-400 font-mono">
                      From: {msg.contact_email || 'Anonymous Student'}
                      {msg.rating && <span className="ml-2 font-sans font-bold text-amber-500">★ {msg.rating}/5</span>}
                    </div>

                    {/* Admin/Faculty Reply Box */}
                    {msg.admin_reply ? (
                      <div className="mt-3 p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Your Instructor Reply:</span>
                        </div>
                        <p className="text-xs text-ink-800 dark:text-cream-paper pl-5">
                          {msg.admin_reply}
                        </p>
                      </div>
                    ) : (
                      <div className="pt-2">
                        {replyingId === msg.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={replyTextMap[msg.id] || ''}
                              onChange={(e) => setReplyTextMap({ ...replyTextMap, [msg.id]: e.target.value })}
                              placeholder="Write reply for student..."
                              className="w-full px-3 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSendReply(msg.id)}
                                disabled={submittingReply}
                                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 disabled:opacity-50"
                              >
                                {submittingReply ? 'Saving...' : 'Post Reply & Mark Resolved'}
                              </button>
                              <button
                                onClick={() => setReplyingId(null)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-ink-500 hover:text-ink-800"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReplyingId(msg.id);
                              playConnectClick();
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors inline-flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reply to Student</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Student Detail Slide-Over Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-[#14141E] rounded-3xl p-6 sm:p-8 border border-cream-border dark:border-darklab-border shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-cream-border dark:border-darklab-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                      {selectedStudent.rollNo}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide ${
                        selectedStudent.status === 'on_track'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : selectedStudent.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {selectedStudent.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-xl text-ink-900 dark:text-cream-paper">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-ink-500 dark:text-cream-muted font-mono">
                    {selectedStudent.email} &bull; Last active {new Date(selectedStudent.lastActive).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 rounded-xl text-ink-400 hover:text-ink-800 dark:hover:text-white hover:bg-cream-soft dark:hover:bg-darklab-card transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 12 Labs Checklist Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-ink-800 dark:text-cream-paper uppercase tracking-wider text-[11px]">
                    Syllabus Practical Progress ({selectedStudent.completedLabs.length}/12)
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                    {Math.round((selectedStudent.completedLabs.length / 12) * 100)}% Complete
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LAB_EXPERIMENTS.map((lab) => {
                    const isDone = selectedStudent.completedLabs.includes(lab.id);
                    return (
                      <div
                        key={lab.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          isDone
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                            : 'bg-cream-soft/60 dark:bg-darklab-card border-cream-border dark:border-darklab-border text-ink-400 dark:text-cream-muted'
                        }`}
                      >
                        <div className="truncate">
                          <p className="font-mono font-bold text-[10px]">Exp {lab.id}</p>
                          <p className="truncate text-[11px]">{lab.shortTitle}</p>
                        </div>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Breadboard Diagnostic History (Prevented Faults Log) */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-ink-800 dark:text-cream-paper uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Breadboard Diagnostic & Safety Interventions</span>
                </h4>

                {selectedStudent.breadboardFaults.length === 0 ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Clean laboratory session: zero safety violations or IC short-circuits.</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {selectedStudent.breadboardFaults.map((fault, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>{fault}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Quiz Scores */}
              {selectedStudent.recentQuizzes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-ink-800 dark:text-cream-paper uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-brand-500" />
                    <span>Recent Quiz Submissions</span>
                  </h4>

                  <div className="space-y-1">
                    {selectedStudent.recentQuizzes.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-cream-soft dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-xs flex items-center justify-between"
                      >
                        <span className="font-bold text-ink-800 dark:text-cream-paper">{q.topic}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-ink-400 dark:text-cream-muted">{q.date}</span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {q.score}/{q.maxScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Notification Modal for Report Generation */}
      <AnimatePresence>
        {showReportSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-darklab-card rounded-3xl p-6 border border-cream-border dark:border-darklab-border shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper">
                  Report Generated Successfully
                </h3>
                <p className="text-xs text-ink-500 dark:text-cream-muted">
                  The Continuous Assessment file has been downloaded and logged to past reports:
                </p>
                <p className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-1">
                  {lastGeneratedReport}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportSuccessModal(false)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
