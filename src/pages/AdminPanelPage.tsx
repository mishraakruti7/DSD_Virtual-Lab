// ==============================================================================
// AdminPanelPage: User Role Management, System Diagnostics & Support Inbox
// Allows administrators to promote/demote users, toggle active status, and manage support.
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Database,
  Terminal,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Award,
  FlaskConical,
  Inbox,
  MessageSquare,
  Send,
  FileSpreadsheet,
  Download,
  UserCheck,
  UserX,
  BarChart3,
  LayoutDashboard,
  Clock,
  Star,
  MessageCircle,
  FileText,
  Activity,
  Server,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, SupportMessageRecord, SupportMessageStatus } from '../types/database.types';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient';
import { playConnectClick, playSuccessChime, playErrorClick } from '../utils/soundEffects';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt: string;
  lastSignIn: string;
}

// Demo users list for local/offline evaluation
const DEMO_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 'u-101',
    name: 'Priya Sharma',
    email: 'priya.sharma@sakec.ac.in',
    role: 'student',
    isActive: true,
    createdAt: '2026-08-10T10:00:00Z',
    lastSignIn: '2026-09-24T18:40:00Z',
  },
  {
    id: 'u-102',
    name: 'Aarav Patel',
    email: 'aarav.patel@sakec.ac.in',
    role: 'student',
    isActive: true,
    createdAt: '2026-08-12T11:30:00Z',
    lastSignIn: '2026-09-24T15:20:00Z',
  },
  {
    id: 'u-103',
    name: 'Prof. Rajesh Verma',
    email: 'rajesh.verma@sakec.ac.in',
    role: 'faculty',
    isActive: true,
    createdAt: '2026-07-01T09:00:00Z',
    lastSignIn: '2026-09-24T20:15:00Z',
  },
  {
    id: 'u-104',
    name: 'Dr. Nilakshi Jain',
    email: 'nilakshi.jain@sakec.ac.in',
    role: 'faculty',
    isActive: true,
    createdAt: '2026-07-05T09:30:00Z',
    lastSignIn: '2026-09-23T14:10:00Z',
  },
  {
    id: 'u-105',
    name: 'Lab Administrator',
    email: 'admin@sakec.ac.in',
    role: 'admin',
    isActive: true,
    createdAt: '2026-06-15T08:00:00Z',
    lastSignIn: '2026-09-24T21:00:00Z',
  },
  {
    id: 'u-106',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@sakec.ac.in',
    role: 'student',
    isActive: true,
    createdAt: '2026-08-15T14:20:00Z',
    lastSignIn: '2026-09-23T11:15:00Z',
  },
  {
    id: 'u-107',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@sakec.ac.in',
    role: 'student',
    isActive: true,
    createdAt: '2026-08-10T12:00:00Z',
    lastSignIn: '2026-09-24T20:10:00Z',
  },
];

export const AdminPanelPage: React.FC<{ onNavigateTab?: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { user, role, isAdmin, switchDemoRole, openAuthModal } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'support_inbox' | 'reports'>('overview');
  const [users, setUsers] = useState<AdminUserRecord[]>(DEMO_ADMIN_USERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [copiedSql, setCopiedSql] = useState(false);

  // Role Change Confirmation Modal State
  const [pendingChange, setPendingChange] = useState<{
    targetUser: AdminUserRecord;
    newRole: UserRole;
  } | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Support Inbox State
  const [supportMessages, setSupportMessages] = useState<SupportMessageRecord[]>([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportTypeFilter, setSupportTypeFilter] = useState<string>('all');
  const [supportStatusFilter, setSupportStatusFilter] = useState<string>('all');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [submittingReply, setSubmittingReply] = useState(false);

  // Fetch users from Supabase if configured
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;

    async function loadCloudUsers() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, display_name, role, is_active, created_at, updated_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          const cloudUsers: AdminUserRecord[] = data.map((p) => ({
            id: p.id,
            name: p.display_name || p.email.split('@')[0],
            email: p.email,
            role: (p.role as UserRole) || 'student',
            isActive: (p as any).is_active !== false,
            createdAt: p.created_at || new Date().toISOString(),
            lastSignIn: p.updated_at || p.created_at || new Date().toISOString(),
          }));
          setUsers(cloudUsers);
        }
      } catch (err: any) {
        console.warn('Could not load cloud profiles:', err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCloudUsers();
  }, []);

  // Fetch support messages
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
            id: 'fb-adm-1',
            user_id: 'u-101',
            type: 'bug_report',
            category: 'breadboard',
            subject: 'Wire snapping offset on IC Pin 7',
            message: 'When connecting IC ground pin to lower bus rail, wire sometimes attached to hole below.',
            status: 'resolved',
            admin_reply: 'Fixed in breadboard terminal snapping grid v2.4.1.',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date().toISOString(),
            contact_email: 'priya.sharma@sakec.ac.in',
            rating: 4,
          },
          {
            id: 'fb-adm-2',
            user_id: 'u-106',
            type: 'help_request',
            category: 'quiz',
            subject: 'Continuous assessment score recalculation after retake',
            message: 'I scored 9/10 on my second attempt at Module 2 Quiz, but Term Work calculator shows first attempt score.',
            status: 'new',
            created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
            contact_email: 'rohan.deshmukh@sakec.ac.in',
            rating: 5,
          },
          {
            id: 'fb-adm-3',
            user_id: null,
            type: 'contact',
            category: 'contact:collaboration',
            subject: '[COLLABORATION] DSD Virtual Lab inter-college workshop inquiry',
            message: 'From: Dr. K. Raman (raman.k@spit.ac.in)\n\nInterested in conducting a joint digital electronics virtual lab demonstration for Mumbai University engineering colleges.',
            status: 'in_review',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            contact_email: 'raman.k@spit.ac.in',
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

  // System Stats calculation
  const stats = useMemo(() => {
    const total = users.length;
    const studentsCount = users.filter((u) => u.role === 'student').length;
    const facultyCount = users.filter((u) => u.role === 'faculty').length;
    const adminCount = users.filter((u) => u.role === 'admin').length;
    const deactivatedCount = users.filter((u) => u.isActive === false).length;

    return {
      total,
      studentsCount,
      facultyCount,
      adminCount,
      deactivatedCount,
      totalPracticals: 12,
      totalModules: 6,
    };
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchQuery, roleFilter]);

  const copySqlToClipboard = () => {
    const activeId = user?.id || '<your-user-id>';
    const sql = `UPDATE public.profiles SET role = 'admin' WHERE id = '${activeId}';`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    playConnectClick();
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Toggle user activation
  const handleToggleUserActive = async (targetUser: AdminUserRecord) => {
    const nextActive = targetUser.isActive === false ? true : false;
    playConnectClick();

    try {
      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase
          .from('profiles')
          .update({ is_active: nextActive })
          .eq('id', targetUser.id);
        if (error) throw error;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: nextActive } : u))
      );

      setStatusMessage({
        type: 'success',
        text: `Account for ${targetUser.name} has been ${nextActive ? 'activated' : 'deactivated'}.`,
      });
      playSuccessChime();
    } catch (err: any) {
      console.error('Failed to toggle active status:', err);
      // Demo fallback
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: nextActive } : u))
      );
      setStatusMessage({
        type: 'success',
        text: `(Demo) Account for ${targetUser.name} has been ${nextActive ? 'activated' : 'deactivated'}.`,
      });
      playSuccessChime();
    }
  };

  // Role Change apply
  const handleApplyRoleChange = async () => {
    if (!pendingChange) return;
    const { targetUser, newRole } = pendingChange;
    setUpdatingRole(true);
    setStatusMessage(null);

    try {
      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', targetUser.id);

        if (error) throw error;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );

      setStatusMessage({
        type: 'success',
        text: `Successfully updated ${targetUser.name}'s role to ${newRole.toUpperCase()}.`,
      });
      playSuccessChime();
    } catch (err: any) {
      console.error('Role update error:', err);
      if (!SUPABASE_CONFIGURED) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
        );
        setStatusMessage({
          type: 'success',
          text: `(Demo Mode) Updated ${targetUser.name}'s role to ${newRole.toUpperCase()}.`,
        });
        playSuccessChime();
      } else {
        setStatusMessage({
          type: 'error',
          text: `Role update failed: ${err.message}.`,
        });
        playErrorClick();
      }
    } finally {
      setUpdatingRole(false);
      setPendingChange(null);
    }
  };

  // Update ticket status / reply
  const handleUpdateTicket = async (ticketId: string, newStatus: SupportMessageStatus, replyText?: string) => {
    playConnectClick();
    setSubmittingReply(true);

    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (replyText !== undefined) {
        updateData.admin_reply = replyText;
      }

      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase
          .from('support_messages')
          .update(updateData)
          .eq('id', ticketId);
        if (error) throw error;
      }

      setSupportMessages((prev) =>
        prev.map((m) => (m.id === ticketId ? { ...m, ...updateData } : m))
      );

      const saved = localStorage.getItem('dsd_support_messages');
      if (saved) {
        const parsed: SupportMessageRecord[] = JSON.parse(saved);
        const updated = parsed.map((m) => (m.id === ticketId ? { ...m, ...updateData } : m));
        localStorage.setItem('dsd_support_messages', JSON.stringify(updated));
      }

      setStatusMessage({
        type: 'success',
        text: `Ticket status set to ${newStatus.toUpperCase()}${replyText ? ' with official admin response.' : '.'}`,
      });
      setReplyingId(null);
      playSuccessChime();
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: `Failed to update ticket: ${err.message}`,
      });
      playErrorClick();
    } finally {
      setSubmittingReply(false);
    }
  };

  // CSV Export functions
  const handleExportUsersCSV = () => {
    playConnectClick();
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Status', 'Registered Date', 'Last Active'];
    const rows = users.map((u) => [
      `"${u.id}"`,
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.role.toUpperCase()}"`,
      `"${u.isActive === false ? 'DEACTIVATED' : 'ACTIVE'}"`,
      `"${new Date(u.createdAt).toLocaleDateString()}"`,
      `"${new Date(u.lastSignIn).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `DSD_Users_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSuccessChime();
  };

  const handleExportSupportCSV = () => {
    playConnectClick();
    const headers = ['Ticket ID', 'Type', 'Category', 'Subject', 'Status', 'Author Email', 'Rating', 'Created Date'];
    const rows = supportMessages.map((m) => [
      `"${m.id}"`,
      `"${m.type}"`,
      `"${m.category}"`,
      `"${m.subject.replace(/"/g, '""')}"`,
      `"${m.status}"`,
      `"${m.contact_email || 'N/A'}"`,
      `"${m.rating || 'N/A'}"`,
      `"${new Date(m.created_at).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `DSD_Support_Tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSuccessChime();
  };

  // Route Guard: Access Restricted for non-admins
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="p-8 rounded-3xl bg-white dark:bg-darklab-card border-2 border-purple-100 dark:border-darklab-border shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-2xl text-ink-900 dark:text-cream-paper">
              Administrator Access Required
            </h2>
            <p className="text-sm text-ink-600 dark:text-cream-muted max-w-md mx-auto leading-relaxed">
              The Admin Panel allows promoting users, deactivating accounts, and managing platform tickets.
              You must be logged in as an administrator to view this console.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-start via-brand-mid to-brand-end text-white font-bold text-xs sm:text-sm shadow-md shadow-brand/20 hover:opacity-95 transition-all"
            >
              Sign In with Admin Account
            </button>
            <button
              onClick={() => switchDemoRole('admin')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs sm:text-sm hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Preview Demo Admin Role</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white shadow-xl overflow-hidden border border-purple-800/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
                ECCOR2PC203 • Admin Console
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Role-Based Access Control (RBAC)
              </span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
              System Administration & Role Management
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl leading-relaxed">
              Manage student, faculty, and administrator privileges across the SAKEC Virtual DSD Lab portal.
              Audit registered users, review support messages, and inspect platform system health.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-cream-border dark:border-darklab-border">
        <button
          type="button"
          onClick={() => {
            setActiveAdminTab('overview');
            playConnectClick();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeAdminTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:text-purple-600 border border-cream-border dark:border-darklab-border'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>System Overview</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveAdminTab('users');
            playConnectClick();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeAdminTab === 'users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:text-purple-600 border border-cream-border dark:border-darklab-border'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveAdminTab('support_inbox');
            playConnectClick();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeAdminTab === 'support_inbox'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:text-purple-600 border border-cream-border dark:border-darklab-border'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Support & Incident Inbox</span>
          {supportMessages.filter((m) => m.status === 'new').length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-white">
              {supportMessages.filter((m) => m.status === 'new').length} new
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveAdminTab('reports');
            playConnectClick();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeAdminTab === 'reports'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:text-purple-600 border border-cream-border dark:border-darklab-border'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>System Reports & Export</span>
        </button>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-ink-400 hover:text-ink-700 font-bold text-sm"
          >
            &times;
          </button>
        </div>
      )}

      {/* TAB 1: SYSTEM OVERVIEW */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* System Health & Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-ink-500 dark:text-cream-muted text-xs font-bold uppercase tracking-wider">
                <span>Total Accounts</span>
                <Users className="w-4 h-4 text-brand-500" />
              </div>
              <p className="font-display font-black text-2xl text-ink-900 dark:text-cream-paper">
                {stats.total}
              </p>
              <p className="text-[11px] text-ink-400 dark:text-cream-muted">
                All registered portal profiles
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-ink-500 dark:text-cream-muted text-xs font-bold uppercase tracking-wider">
                <span>Student Accounts</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400">
                {stats.studentsCount}
              </p>
              <p className="text-[11px] text-ink-400 dark:text-cream-muted">
                Lab learners & experimenters
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-ink-500 dark:text-cream-muted text-xs font-bold uppercase tracking-wider">
                <span>Faculty Members</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              </div>
              <p className="font-display font-black text-2xl text-indigo-600 dark:text-indigo-400">
                {stats.facultyCount}
              </p>
              <p className="text-[11px] text-ink-400 dark:text-cream-muted">
                Authorized class instructors
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-ink-500 dark:text-cream-muted text-xs font-bold uppercase tracking-wider">
                <span>Administrators</span>
                <span className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
              <p className="font-display font-black text-2xl text-purple-600 dark:text-purple-400">
                {stats.adminCount}
              </p>
              <p className="text-[11px] text-ink-400 dark:text-cream-muted">
                Full platform privileges
              </p>
            </div>
          </div>

          {/* Infrastructure Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-700 dark:text-cream-muted uppercase">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>Backend Storage</span>
              </div>
              <p className="text-sm font-bold text-ink-900 dark:text-cream-paper">
                {SUPABASE_CONFIGURED ? 'Supabase PostgreSQL (Cloud Active)' : 'Local Storage Sandbox (Offline)'}
              </p>
              <p className="text-[11px] text-ink-500">
                RLS policies active for profiles, progress, and support_messages.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-700 dark:text-cream-muted uppercase">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span>RBAC Security</span>
              </div>
              <p className="text-sm font-bold text-ink-900 dark:text-cream-paper">
                Server-Verified Faculty Codes
              </p>
              <p className="text-[11px] text-ink-500">
                Prevents unauthorized faculty promotion during self-registration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-700 dark:text-cream-muted uppercase">
                <Server className="w-4 h-4 text-sky-500" />
                <span>Curriculum Modules</span>
              </div>
              <p className="text-sm font-bold text-ink-900 dark:text-cream-paper">
                12 Practicals &bull; 6 Modules
              </p>
              <p className="text-[11px] text-ink-500">
                Aligned with Mumbai University ECCOR2PC203 Scheme.
              </p>
            </div>
          </div>

          {/* Setup Instructions / Initial Admin Notice Banner */}
          <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 text-indigo-900 dark:text-indigo-200 font-display font-extrabold text-sm sm:text-base">
                <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Initial Admin Setup: Grant Your First Admin Account</span>
              </div>

              <button
                onClick={copySqlToClipboard}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-darklab-card border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors shadow-xs"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied SQL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Snippet</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-ink-600 dark:text-cream-muted leading-relaxed">
              Because new user signups default strictly to the <code className="font-mono font-bold text-indigo-700 dark:text-indigo-300">student</code> role for security, promote your account to <code className="font-mono font-bold text-purple-700 dark:text-purple-300">admin</code> by executing this command in your Supabase SQL Editor:
            </p>

            <div className="p-3 rounded-2xl bg-slate-900 text-indigo-200 font-mono text-xs overflow-x-auto border border-slate-800 flex items-center justify-between gap-4">
              <code className="text-emerald-400 select-all">
                UPDATE public.profiles SET role = 'admin' WHERE id = '{user?.id || '<your-user-id>'}';
              </code>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* User Management Toolbar: Search & Role Filters */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] font-bold text-ink-500 dark:text-cream-muted mr-1">Role:</span>
                {(['all', 'student', 'faculty', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs capitalize ${
                      roleFilter === r
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted hover:text-ink-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Management Table */}
          <div className="rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-soft/80 dark:bg-darklab-base/80 border-b border-cream-border dark:border-darklab-border text-ink-500 dark:text-cream-muted font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">College Email</th>
                    <th className="py-3.5 px-4 text-center">Current Role</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Last Active</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border/60 dark:divide-darklab-border/60 font-sans">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-ink-400 dark:text-cream-muted">
                        No users match the search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isActive = u.isActive !== false;
                      return (
                        <tr key={u.id} className="hover:bg-cream-soft/50 dark:hover:bg-darklab-base/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-ink-900 dark:text-white flex items-center gap-2">
                              <div
                                className={`w-7 h-7 rounded-lg text-white text-xs font-display font-black flex items-center justify-center shrink-0 ${
                                  u.role === 'admin'
                                    ? 'bg-purple-600'
                                    : u.role === 'faculty'
                                    ? 'bg-indigo-600'
                                    : 'bg-emerald-600'
                                }`}
                              >
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span>{u.name}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-ink-600 dark:text-cream-muted">
                            {u.email}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase tracking-wide ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                  : u.role === 'faculty'
                                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200'
                              }`}
                            >
                              {isActive ? 'Active' : 'Deactivated'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center text-ink-500 dark:text-cream-muted font-mono text-[11px]">
                            {new Date(u.lastSignIn).toLocaleDateString()}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Toggle Active/Inactive */}
                              <button
                                onClick={() => handleToggleUserActive(u)}
                                title={isActive ? 'Deactivate user login' : 'Reactivate user'}
                                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                                  isActive
                                    ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60'
                                    : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60'
                                }`}
                              >
                                {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              </button>

                              {/* Role switches */}
                              {(['student', 'faculty', 'admin'] as UserRole[]).map((r) => {
                                const isCurrent = u.role === r;
                                return (
                                  <button
                                    key={r}
                                    disabled={isCurrent}
                                    onClick={() => {
                                      setPendingChange({ targetUser: u, newRole: r });
                                      playConnectClick();
                                    }}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                                      isCurrent
                                        ? 'opacity-30 cursor-default bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        : r === 'admin'
                                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-200 border border-purple-200 dark:border-purple-800'
                                        : r === 'faculty'
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-200 border border-indigo-200 dark:border-indigo-800'
                                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200 border border-emerald-200 dark:border-emerald-800'
                                    }`}
                                  >
                                    Make {r}
                                  </button>
                                );
                              })}
                            </div>
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

      {/* TAB 3: SUPPORT INBOX */}
      {activeAdminTab === 'support_inbox' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Inbox Filter Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-purple-600" />
                  <span>Platform-Wide Support & Incident Inbox</span>
                </h3>
                <p className="text-xs text-ink-500 dark:text-cream-muted">
                  Review student feedback, bug reports, and faculty contact queries across all courses.
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
              {['all', 'bug_report', 'feature_request', 'help_request', 'contact', 'feedback'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSupportTypeFilter(t)}
                  className={`px-3 py-1 rounded-xl font-bold capitalize transition-colors ${
                    supportTypeFilter === t ? 'bg-purple-600 text-white' : 'bg-cream-soft text-ink-700'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}

              <span className="font-bold text-ink-400 ml-3">Status:</span>
              {['all', 'new', 'in_review', 'resolved', 'closed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSupportStatusFilter(s)}
                  className={`px-3 py-1 rounded-xl font-bold capitalize transition-colors ${
                    supportStatusFilter === s ? 'bg-purple-600 text-white' : 'bg-cream-soft text-ink-700'
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
              No support tickets found matching the selected filter.
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
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 uppercase">
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
                              : msg.status === 'closed'
                              ? 'bg-slate-100 text-slate-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-700 dark:text-cream-muted leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-ink-400 font-mono">
                      <div>
                        From: {msg.contact_email || 'Anonymous Student'}
                        {msg.rating && <span className="ml-2 font-sans font-bold text-amber-500">★ {msg.rating}/5</span>}
                      </div>

                      {/* Quick Status Changers */}
                      <div className="flex items-center gap-1.5 font-sans">
                        {msg.status !== 'in_review' && (
                          <button
                            onClick={() => handleUpdateTicket(msg.id, 'in_review')}
                            className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-bold hover:bg-amber-100"
                          >
                            Mark In Review
                          </button>
                        )}
                        {msg.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateTicket(msg.id, 'resolved')}
                            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100"
                          >
                            Mark Resolved
                          </button>
                        )}
                        {msg.status !== 'closed' && (
                          <button
                            onClick={() => handleUpdateTicket(msg.id, 'closed')}
                            className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold hover:bg-slate-200"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Official Response */}
                    {msg.admin_reply ? (
                      <div className="mt-3 p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Admin / Faculty Reply:</span>
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
                              placeholder="Write reply for user..."
                              className="w-full px-3 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateTicket(msg.id, 'resolved', replyTextMap[msg.id])}
                                disabled={submittingReply}
                                className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xs hover:bg-purple-700 disabled:opacity-50"
                              >
                                {submittingReply ? 'Saving...' : 'Post Reply & Resolve'}
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
                            className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors inline-flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Post Official Admin Reply</span>
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

      {/* TAB 4: SYSTEM REPORTS & EXPORT */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                <span>System Analytics & Audit Exports</span>
              </h3>
              <p className="text-xs text-ink-500 dark:text-cream-muted">
                Download comprehensive CSV reports for institutional records, syllabus audits, and security compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-ink-900 dark:text-cream-paper">User Directory Roster</h4>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs text-ink-500">
                  Export complete list of all {users.length} accounts including name, email, role, and active status.
                </p>
                <button
                  onClick={handleExportUsersCSV}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Users CSV</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-ink-900 dark:text-cream-paper">Support Tickets & Bugs Log</h4>
                  <Inbox className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-ink-500">
                  Export all {supportMessages.length} feedback tickets, bug reports, and contact requests with resolution status.
                </p>
                <button
                  onClick={handleExportSupportCSV}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Tickets CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Role Change */}
      <AnimatePresence>
        {pendingChange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-darklab-card rounded-3xl p-6 border border-cream-border dark:border-darklab-border shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-ink-900 dark:text-cream-paper">
                    Confirm Role Reassignment
                  </h3>
                  <p className="text-xs text-ink-500 dark:text-cream-muted">
                    This modification updates system authorizations immediately.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink-500 dark:text-cream-muted">Target User:</span>
                  <span className="font-bold text-ink-900 dark:text-cream-paper">{pendingChange.targetUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 dark:text-cream-muted">Email:</span>
                  <span className="font-mono text-ink-700 dark:text-cream-muted">{pendingChange.targetUser.email}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-cream-border dark:border-darklab-border">
                  <span className="text-ink-500 dark:text-cream-muted">Transition:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <span className="line-through text-ink-400">{pendingChange.targetUser.role}</span>
                    <span className="text-purple-600 dark:text-purple-400">&rarr;</span>
                    <span className="text-purple-600 dark:text-purple-400 uppercase font-black">
                      {pendingChange.newRole}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={updatingRole}
                  onClick={() => setPendingChange(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-ink-600 hover:text-ink-900 dark:text-cream-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updatingRole}
                  onClick={handleApplyRoleChange}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  {updatingRole ? 'Updating Permissions...' : 'Confirm Role Change'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
