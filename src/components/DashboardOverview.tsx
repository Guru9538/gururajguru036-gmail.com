import React from 'react';
import {
  UserRole,
  Student,
  Teacher,
  FeeInvoice,
  Announcement,
  StudentReportCard,
  TimetableSlot,
  Assignment,
} from '../types';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  FileText,
  DollarSign,
  UserCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency, getAttendanceBadgeColor, getGradeBadgeColor } from '../utils/helpers';
import { calculateFeeMetrics } from '../utils/schoolMath';
import { PerformanceTrendChart } from './PerformanceTrendChart';

interface DashboardOverviewProps {
  currentRole: UserRole;
  students: Student[];
  teachers: Teacher[];
  invoices: FeeInvoice[];
  announcements: Announcement[];
  reportCards: Record<string, StudentReportCard>;
  timetable: TimetableSlot[];
  assignments: Assignment[];
  onNavigate: (tab: any) => void;
  onOpenReportCard: (studentId: string) => void;
  onPayInvoice: (invoice: FeeInvoice) => void;
  onEnrollStudent: () => void;
  onPublishNotice: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentRole,
  students,
  teachers,
  invoices,
  announcements,
  reportCards,
  timetable,
  assignments,
  onNavigate,
  onOpenReportCard,
  onPayInvoice,
  onEnrollStudent,
  onPublishNotice,
}) => {
  // Common calculations
  const totalStudents = students.length;
  const avgAttendance =
    students.length > 0
      ? Math.round(
          (students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length) * 10
        ) / 10
      : 0;

  const feeMetrics = calculateFeeMetrics(invoices);
  const lowAttendanceStudents = students.filter((s) => s.attendanceRate < 80);

  // Default student for Student role
  const marcus = students.find((s) => s.id === 'std-101') || students[0];
  const marcusReport = reportCards[marcus.id];

  // Ward for Parent role
  const [selectedWardId, setSelectedWardId] = React.useState<string>(marcus.id);
  const selectedWard = students.find((s) => s.id === selectedWardId) || marcus;
  const wardReport = reportCards[selectedWard.id];
  const wardInvoices = invoices.filter((inv) => inv.studentId === selectedWard.id);
  const pendingWardInvoices = wardInvoices.filter((inv) => inv.status !== 'Paid');

  // Timetable for Monday
  const todayClasses = timetable.filter((t) => t.day === 'Monday').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Role Banner / Context */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              {currentRole.toUpperCase()} DASHBOARD
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentRole === 'admin' && 'Campus Administration & ERP'}
              {currentRole === 'teacher' && 'Faculty Class Portal (Grade 10-A)'}
              {currentRole === 'student' && `Welcome back, ${marcus.firstName}!`}
              {currentRole === 'parent' && `Guardian Portal • ${selectedWard.firstName}’s Progress`}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {currentRole === 'admin' &&
                'Real-time institutional oversight across student admissions, faculty roster, attendance compliance, and fee revenues.'}
              {currentRole === 'teacher' &&
                'Review daily class roster, record attendance, grade submissions, and track term examinations.'}
              {currentRole === 'student' &&
                'Check your daily schedule, track attendance consistency, submit assignments, and view your official report card.'}
              {currentRole === 'parent' &&
                'Monitor your ward’s attendance, examine midterm scorecards, and settle academic dues securely online.'}
            </p>
          </div>

          {/* Banner Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {currentRole === 'admin' && (
              <>
                <button
                  onClick={onEnrollStudent}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" /> Enroll Student
                </button>
                <button
                  onClick={onPublishNotice}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> Post Notice
                </button>
              </>
            )}

            {currentRole === 'teacher' && (
              <button
                onClick={() => onNavigate('attendance')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow flex items-center gap-1.5"
              >
                <CalendarCheck className="w-4 h-4" /> Mark Today’s Attendance
              </button>
            )}

            {currentRole === 'student' && marcusReport && (
              <button
                onClick={() => onOpenReportCard(marcus.id)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" /> View My Report Card
              </button>
            )}

            {currentRole === 'parent' && pendingWardInvoices.length > 0 && (
              <button
                onClick={() => onPayInvoice(pendingWardInvoices[0])}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" /> Pay Term Fee ({formatCurrency(pendingWardInvoices[0].amount)})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* -------------------- ADMIN VIEW -------------------- */}
      {currentRole === 'admin' && (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Enrolled</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</h3>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> 100% capacity in 10-A
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Faculty & Staff</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{teachers.length}</h3>
                <p className="text-xs text-slate-500 mt-1">Across 5 departments</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Attendance</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{avgAttendance}%</h3>
                <p className="text-xs text-emerald-600 font-medium mt-1">Healthy threshold</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fee Collection</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{feeMetrics.collectionRate}%</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {formatCurrency(feeMetrics.totalCollected)} / {formatCurrency(feeMetrics.totalBilled)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Attention / Alert for low attendance students */}
          {lowAttendanceStudents.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Attendance Action Required ({lowAttendanceStudents.length} student below 80%)
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    {lowAttendanceStudents.map((s) => `${s.firstName} ${s.lastName} (${s.attendanceRate}%)`).join(', ')} has fallen below required state threshold.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('attendance')}
                className="self-start sm:self-auto px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium rounded-lg transition"
              >
                Inspect Attendance Register
              </button>
            </div>
          )}

          {/* 3-Term Academic Performance Trend Chart (Recharts) */}
          <PerformanceTrendChart currentRole={currentRole} />

          {/* Quick Grid: Recent Students & Financial Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Enrolled Students Roster</h3>
                <button
                  onClick={() => onNavigate('students')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  View All Students <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
                    <tr>
                      <th className="py-2.5 px-3">Student</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Parent</th>
                      <th className="py-2.5 px-3">Attendance</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.slice(0, 5).map((s) => {
                      const badge = getAttendanceBadgeColor(s.attendanceRate);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900">
                              {s.firstName} {s.lastName}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">{s.rollNo}</div>
                          </td>
                          <td className="py-2.5 px-3 text-xs text-slate-700 font-medium">
                            {s.grade}-{s.section}
                          </td>
                          <td className="py-2.5 px-3 text-xs text-slate-600">
                            <div>{s.parentName}</div>
                            <div className="text-[11px] text-slate-400">{s.parentPhone}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
                            >
                              {s.attendanceRate}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => onOpenReportCard(s.id)}
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              Report
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Overview Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900">Term Fee Collection</h3>
                  <button
                    onClick={() => onNavigate('fees')}
                    className="text-xs text-indigo-600 font-medium hover:underline"
                  >
                    Manage
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Total Billed:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(feeMetrics.totalBilled)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Collected:</span>
                      <span className="font-semibold text-emerald-600">{formatCurrency(feeMetrics.totalCollected)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Pending:</span>
                      <span className="font-semibold text-amber-600">{formatCurrency(feeMetrics.totalPending)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Overdue:</span>
                      <span className="font-semibold text-rose-600">{formatCurrency(feeMetrics.totalOverdue)}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-indigo-600 font-bold">{feeMetrics.collectionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${feeMetrics.collectionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  onClick={() => onNavigate('fees')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                >
                  Inspect Invoices Ledger
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* -------------------- TEACHER VIEW -------------------- */}
      {currentRole === 'teacher' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase">My Class Assignment</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">Grade 10 - Section A</h3>
                  <p className="text-xs text-slate-500 mt-0.5">32 Students • Room 204</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  10A
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase">Today's Attendance</span>
                  <h3 className="text-xl font-bold text-emerald-600 mt-1">Marked & Saved</h3>
                  <p className="text-xs text-slate-500 mt-0.5">94% Present today</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase">Pending Grading</span>
                  <h3 className="text-xl font-bold text-amber-600 mt-1">1 Assignment</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Quadratic Curves (28/32 in)</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Today's Teaching Schedule & Quick Grading Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Today’s Teaching Schedule (Monday)</h3>
                <button
                  onClick={() => onNavigate('timetable')}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Full Timetable
                </button>
              </div>

              <div className="space-y-3">
                {todayClasses.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                      idx === 0
                        ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-300/40'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center text-xs font-bold text-slate-800 shadow-2xs">
                        <span>P{item.period}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.subject}</h4>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.startTime} – {item.endTime}
                          </span>
                          <span>•</span>
                          <span>{item.room}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {idx === 0 ? (
                        <span className="text-[11px] font-semibold px-2.5 py-1 bg-indigo-600 text-white rounded-full">
                          Current / Next
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Scheduled</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Teacher Fast Actions</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => onNavigate('attendance')}
                    className="w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <CalendarCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-slate-800">Attendance Register</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => onNavigate('gradebook')}
                    className="w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-semibold text-slate-800">Gradebook & Exam Marks</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={onPublishNotice}
                    className="w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-semibold text-slate-800">Class Announcement</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Notice for Teachers:</span> Midterm grades must be
                finalized by November 12th before parent conference packets are generated.
              </div>
            </div>
          </div>

          {/* 3-Term Class Performance Trend Chart (Recharts) */}
          <PerformanceTrendChart currentRole={currentRole} />
        </div>
      )}

      {/* -------------------- STUDENT VIEW (Marcus Vance) -------------------- */}
      {currentRole === 'student' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase">My Attendance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-900">{marcus.attendanceRate}%</h3>
                <span className="text-xs text-emerald-600 font-semibold">Exemplary</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">1 excused absence this term</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase">Current Term GPA</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-indigo-600">{marcusReport?.gpa || '3.84'}</h3>
                <span className="text-xs text-slate-500">/ 4.0</span>
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-1">Grade: A (Outstanding)</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase">Class Rank</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-900">#2</h3>
                <span className="text-xs text-slate-500">of 32 students</span>
              </div>
              <p className="text-xs text-indigo-600 font-medium mt-1">Top 5% Honor Roll</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase">Assignments</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-amber-600">2 Pending</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">Due in next 5 days</p>
            </div>
          </div>

          {/* 3-Term Student Performance Trend Chart (Recharts) */}
          <PerformanceTrendChart
            currentRole={currentRole}
            studentName={`${marcus.firstName} ${marcus.lastName}`}
          />

          {/* Student Center: Report Card summary + Today's Classes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Academic Scorecard Summary</h3>
                  <p className="text-xs text-slate-500">Mid-Term Evaluation • Class 10-A</p>
                </div>
                <button
                  onClick={() => onOpenReportCard(marcus.id)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Award className="w-3.5 h-3.5" /> Full Report Card
                </button>
              </div>

              {marcusReport && (
                <div className="divide-y divide-slate-100">
                  {marcusReport.subjects.map((sub) => {
                    const gradeBadge = getGradeBadgeColor(sub.obtainedScore >= 90 ? 'A' : 'B');
                    return (
                      <div key={sub.subject} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{sub.subject}</p>
                          <p className="text-xs text-slate-500 italic">{sub.teacherRemarks}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900">
                            {sub.obtainedScore} / {sub.maxScore}
                          </span>
                          <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded ${gradeBadge.bg}`}>
                            {sub.obtainedScore >= 90 ? 'A' : 'B+'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Timetable / Next classes */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-3">Today’s Schedule</h3>
              <div className="space-y-2.5">
                {todayClasses.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border text-xs ${
                      idx === 0
                        ? 'bg-indigo-50/70 border-indigo-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{item.subject}</span>
                      <span className="text-slate-500 text-[11px]">{item.startTime}</span>
                    </div>
                    <div className="text-slate-500 mt-1 flex justify-between">
                      <span>{item.room}</span>
                      <span className="text-indigo-600 font-medium">{item.teacher}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- PARENT VIEW -------------------- */}
      {currentRole === 'parent' && (
        <div className="space-y-6">
          {/* Ward Switcher Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                {selectedWard.firstName[0]}
                {selectedWard.lastName[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedWard.firstName} {selectedWard.lastName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedWard.grade} - Section {selectedWard.section} • Roll No: {selectedWard.rollNo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Switch Child:</span>
              <select
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.firstName} {st.lastName} ({st.grade}-{st.section})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Child KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase">Attendance Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-900">{selectedWard.attendanceRate}%</h3>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    selectedWard.attendanceRate >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedWard.attendanceRate >= 85 ? 'Satisfactory' : 'Action Required'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Minimum 75% mandatory for exam eligibility</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase">Academic Standing</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-indigo-600">
                  {wardReport ? `${wardReport.letterGrade} (${wardReport.gpa} GPA)` : 'Active'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Class Rank: {wardReport ? `#${wardReport.classRank}` : 'In progress'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase">Fee Status</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h3
                  className={`text-2xl font-bold ${
                    pendingWardInvoices.length > 0 ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {pendingWardInvoices.length > 0
                    ? `${formatCurrency(pendingWardInvoices.reduce((a, b) => a + b.amount, 0))} Due`
                    : 'Clear'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {pendingWardInvoices.length > 0 ? 'Due for Term 2' : 'All invoices paid'}
              </p>
            </div>
          </div>

          {/* Ward 3-Term Performance Trend (Recharts) */}
          <PerformanceTrendChart
            currentRole={currentRole}
            studentName={`${selectedWard.firstName} ${selectedWard.lastName}`}
          />

          {/* Parent Action Cards: Fee Payments & Report Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Outstanding Invoices */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-3">Tuition & School Dues</h3>
              {wardInvoices.length === 0 ? (
                <p className="text-xs text-slate-500">No invoices generated for this student.</p>
              ) : (
                <div className="space-y-3">
                  {wardInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3 rounded-lg border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{inv.title}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inv.status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'Overdue'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Invoice #{inv.invoiceNo} • Due {inv.dueDate}
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <span className="text-base font-bold text-slate-900">{formatCurrency(inv.amount)}</span>
                        {inv.status !== 'Paid' ? (
                          <button
                            onClick={() => onPayInvoice(inv)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
                          >
                            Pay Online
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Report Card & Teacher Remarks */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Academic Evaluation</h3>
                {wardReport ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <p className="text-xs text-slate-500 font-medium">Principal’s Endorsement:</p>
                      <p className="text-xs text-slate-800 italic mt-1 font-serif">
                        "{wardReport.principalRemarks}"
                      </p>
                      <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                        <span>Conduct: <strong>{wardReport.conduct}</strong></span>
                        <span>Rank: <strong>#{wardReport.classRank} / {wardReport.totalStudents}</strong></span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      Overall Score: <strong>{wardReport.averagePercentage}%</strong> ({wardReport.letterGrade})
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Evaluation pending publication.</p>
                )}
              </div>

              {wardReport && (
                <div className="pt-4 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => onOpenReportCard(selectedWard.id)}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4" /> Open Official Report Card & Grades
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Announcements Bulletin Bar (Visible in all roles) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
            <h3 className="text-base font-bold text-slate-900">Campus Notice Board & Bulletins</h3>
          </div>
          <button
            onClick={() => onNavigate('announcements')}
            className="text-xs text-indigo-600 hover:underline font-semibold"
          >
            View All ({announcements.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {announcements.slice(0, 2).map((ann) => (
            <div
              key={ann.id}
              className={`p-3.5 rounded-xl border transition ${
                ann.pinned ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    ann.category === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : ann.category === 'Academic'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {ann.category}
                </span>
                <span className="text-[11px] text-slate-400">{ann.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {ann.content}
              </p>
              <div className="mt-2 text-[11px] text-slate-400">
                Posted by {ann.author} • {ann.authorRole}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
