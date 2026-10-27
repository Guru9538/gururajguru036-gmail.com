import React, { useState } from 'react';
import {
  UserRole,
  Student,
  Teacher,
  AttendanceSession,
  StudentReportCard,
  TimetableSlot,
  FeeInvoice,
  Announcement,
  Assignment,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_REPORT_CARDS,
  INITIAL_TIMETABLE,
  INITIAL_INVOICES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ASSIGNMENTS,
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { StudentsManagement } from './components/StudentsManagement';
import { AttendanceTracker } from './components/AttendanceTracker';
import { GradebookReportCards } from './components/GradebookReportCards';
import { TimetableSchedule } from './components/TimetableSchedule';
import { FeeManagement } from './components/FeeManagement';
import { AnnouncementsBoard } from './components/AnnouncementsBoard';
import { TeachersDirectory } from './components/TeachersDirectory';
import { AIVoiceAssistant } from './components/AIVoiceAssistant';
import { AITeacherGuidance } from './components/AITeacherGuidance';
import { AIStudentTutor } from './components/AIStudentTutor';
import { StudentLearningDashboard } from './components/StudentLearningDashboard';
import { AdminAIControlsModal } from './components/AdminAIControlsModal';
import { calculateOverallPerformance } from './utils/schoolMath';
import { SavedLessonPlan, AISettings } from './types';
import { Menu } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data States
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(
    INITIAL_ATTENDANCE_SESSIONS
  );
  const [reportCards, setReportCards] = useState<Record<string, StudentReportCard>>(
    INITIAL_REPORT_CARDS
  );
  const [timetable, setTimetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);
  const [invoices, setInvoices] = useState<FeeInvoice[]>(INITIAL_INVOICES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);

  // Modal states
  const [activeReportCardId, setActiveReportCardId] = useState<string | null>(null);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<FeeInvoice | null>(null);
  const [isOpenCreateNotice, setIsOpenCreateNotice] = useState(false);
  const [isAdminAISettingsOpen, setIsAdminAISettingsOpen] = useState(false);

  // AI System States & Governance
  const [aiSettings, setAiSettings] = useState<AISettings>({
    isAIEnabled: true,
    voiceAssistantEnabled: true,
    allowStudentVoice: true,
    selectedProvider: 'hybrid_gemini',
    supportKannada: true,
  });

  const [savedLessonPlans, setSavedLessonPlans] = useState<SavedLessonPlan[]>([
    {
      id: 'lp-init-1',
      title: 'Daily Lesson Plan: Newton’s Second Law (F = m × a)',
      grade: 'Grade 10',
      subject: 'Physics & Science',
      chapter: 'Forces & Laws of Motion',
      topic: 'Newton’s Second Law',
      createdAt: '2026-10-25',
      teacherName: 'Dr. Robert Hawthorne',
      objectives: [
        'Understand relationship between force, mass, and acceleration.',
        'Calculate net force across metric units (Newtons).',
      ],
      simpleExplanation: 'Net force is directly proportional to acceleration for a given mass.',
      realWorldAnalogy: 'Pushing an empty shopping cart vs a cart filled with heavy groceries.',
      differentiatedStrategies: {
        foundational: 'Provide pre-calculated acceleration tables.',
        intermediate: 'Guide through formula manipulation for mass and acceleration.',
        advanced: 'Solve multi-body pulley tension challenges.',
      },
      classroomActivities: ['Frictionless cart ramp demonstration', 'Partner problem solving'],
      homeworkSuggestion: 'Complete Problem Set 3.2 questions 1-8.',
    },
  ]);

  // Count alerts
  const lowAttendanceCount = students.filter((s) => s.attendanceRate < 80).length;
  const pendingFeesCount = invoices.filter((i) => i.status !== 'Paid').length;

  // Handlers
  const handleAddStudent = (
    newStudentData: Omit<Student, 'id' | 'attendanceRate' | 'status' | 'enrolledDate' | 'avatarSeed'>
  ) => {
    const newId = `std-${Date.now().toString().slice(-4)}`;
    const student: Student = {
      ...newStudentData,
      id: newId,
      attendanceRate: 100,
      status: 'Active',
      enrolledDate: new Date().toISOString().split('T')[0],
      avatarSeed: newStudentData.firstName,
    };
    setStudents((prev) => [student, ...prev]);

    // Initialize mock report card for new student
    const newReport: StudentReportCard = {
      id: `rep-${newId}`,
      studentId: newId,
      studentName: `${student.firstName} ${student.lastName}`,
      rollNo: student.rollNo,
      grade: student.grade,
      section: student.section,
      academicYear: '2026-2027',
      term: 'Mid-Term',
      subjects: [
        { subject: 'Advanced Mathematics', maxScore: 100, obtainedScore: 85, teacherRemarks: 'Shows good analytical aptitude.' },
        { subject: 'Physics & Science', maxScore: 100, obtainedScore: 88, teacherRemarks: 'Active in class lab projects.' },
        { subject: 'English Literature', maxScore: 100, obtainedScore: 82, teacherRemarks: 'Thoughtful comprehension.' },
        { subject: 'Computer Science', maxScore: 100, obtainedScore: 90, teacherRemarks: 'Great problem solver.' },
        { subject: 'World History', maxScore: 100, obtainedScore: 84, teacherRemarks: 'Consistent performance.' },
      ],
      gpa: 3.4,
      averagePercentage: 85.8,
      letterGrade: 'B+',
      classRank: students.length + 1,
      totalStudents: students.length + 1,
      attendancePercentage: 100,
      conduct: 'Good',
      principalRemarks: 'Warm welcome to Crestview Academy. We expect great achievements ahead.',
    };
    setReportCards((prev) => ({ ...prev, [newId]: newReport }));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveAttendanceSession = (session: AttendanceSession) => {
    setAttendanceSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = session;
        return copy;
      }
      return [session, ...prev];
    });

    // Update students attendance rate slightly based on today's mark
    setStudents((prev) =>
      prev.map((st) => {
        const entry = session.entries.find((e) => e.studentId === st.id);
        if (!entry) return st;
        let delta = 0;
        if (entry.status === 'present') delta = 0.4;
        else if (entry.status === 'absent') delta = -1.8;
        else if (entry.status === 'late') delta = -0.5;
        const newRate = Math.min(100, Math.max(50, Math.round((st.attendanceRate + delta) * 10) / 10));
        return { ...st, attendanceRate: newRate };
      })
    );
  };

  const handlePayInvoice = (
    invoiceId: string,
    paymentMethod: 'Credit Card' | 'Bank Transfer' | 'UPI / Digital' | 'Cash Receipt'
  ) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'Paid',
              paidDate: new Date().toISOString().split('T')[0],
              paymentMethod,
            }
          : inv
      )
    );
  };

  const handleCreateInvoice = (
    newInvoice: Omit<FeeInvoice, 'id' | 'status' | 'paidDate' | 'paymentMethod'>
  ) => {
    const inv: FeeInvoice = {
      ...newInvoice,
      id: `inv-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
    };
    setInvoices((prev) => [inv, ...prev]);
  };

  const handleAddAnnouncement = (newAnn: Omit<Announcement, 'id'>) => {
    const ann: Announcement = {
      ...newAnn,
      id: `ann-${Date.now().toString().slice(-4)}`,
    };
    setAnnouncements((prev) => [ann, ...prev]);
  };

  const handleAddTimetableSlot = (newSlot: Omit<TimetableSlot, 'id'>) => {
    const slot: TimetableSlot = {
      ...newSlot,
      id: `tt-${Date.now().toString().slice(-4)}`,
    };
    setTimetable((prev) => [...prev, slot]);
  };

  const handleAddTeacher = (newTch: Omit<Teacher, 'id' | 'avatarSeed'>) => {
    const tch: Teacher = {
      ...newTch,
      id: `tch-${Date.now().toString().slice(-4)}`,
      avatarSeed: newTch.name,
    };
    setTeachers((prev) => [...prev, tch]);
  };

  const handleUpdateMarks = (studentId: string, subjectIndex: number, newScore: number) => {
    const existing = reportCards[studentId];
    if (!existing) return;

    const updatedSubjects = existing.subjects.map((s, idx) =>
      idx === subjectIndex ? { ...s, obtainedScore: Math.min(s.maxScore, Math.max(0, newScore)) } : s
    );

    const perf = calculateOverallPerformance(updatedSubjects);

    setReportCards((prev) => ({
      ...prev,
      [studentId]: {
        ...existing,
        subjects: updatedSubjects,
        averagePercentage: perf.averagePercentage,
        gpa: perf.gpa,
        letterGrade: perf.letterGrade,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        unreadCount={announcements.filter((a) => a.pinned).length}
        onOpenAnnouncements={() => setActiveTab('announcements')}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          lowAttendanceCount={lowAttendanceCount}
          pendingFeesCount={pendingFeesCount}
          onOpenAISettings={() => setIsAdminAISettingsOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* Mobile view toggle for sidebar */}
          <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 p-1"
            >
              <Menu className="w-5 h-5 text-indigo-600" />
              <span>Menu / Modules</span>
            </button>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
              {activeTab}
            </span>
          </div>

          {activeTab === 'dashboard' && (
            <DashboardOverview
              currentRole={currentRole}
              students={students}
              teachers={teachers}
              invoices={invoices}
              announcements={announcements}
              reportCards={reportCards}
              timetable={timetable}
              assignments={assignments}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenReportCard={(id) => {
                setActiveReportCardId(id);
                setActiveTab('gradebook');
              }}
              onPayInvoice={(inv) => {
                setSelectedInvoiceForPay(inv);
                setActiveTab('fees');
              }}
              onEnrollStudent={() => setActiveTab('students')}
              onPublishNotice={() => {
                setActiveTab('announcements');
                setIsOpenCreateNotice(true);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentsManagement
              students={students}
              currentRole={currentRole}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              onOpenReportCard={(id) => {
                setActiveReportCardId(id);
                setActiveTab('gradebook');
              }}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceTracker
              students={students}
              currentRole={currentRole}
              sessions={attendanceSessions}
              onSaveSession={handleSaveAttendanceSession}
            />
          )}

          {activeTab === 'gradebook' && (
            <GradebookReportCards
              students={students}
              currentRole={currentRole}
              reportCards={reportCards}
              activeReportCardId={activeReportCardId}
              onCloseReportCard={() => setActiveReportCardId(null)}
              onOpenReportCard={(id) => setActiveReportCardId(id)}
              onUpdateMarks={handleUpdateMarks}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableSchedule
              currentRole={currentRole}
              timetable={timetable}
              onAddSlot={handleAddTimetableSlot}
            />
          )}

          {activeTab === 'fees' && (
            <FeeManagement
              currentRole={currentRole}
              invoices={invoices}
              students={students}
              onPayInvoice={handlePayInvoice}
              onCreateInvoice={handleCreateInvoice}
              selectedInvoiceForPay={selectedInvoiceForPay}
              onClosePayModal={() => setSelectedInvoiceForPay(null)}
              onOpenPayModal={(inv) => setSelectedInvoiceForPay(inv)}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsBoard
              currentRole={currentRole}
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              isOpenCreateModal={isOpenCreateNotice}
              onCloseCreateModal={() => setIsOpenCreateNotice(false)}
              onOpenCreateModal={() => setIsOpenCreateNotice(true)}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersDirectory
              currentRole={currentRole}
              teachers={teachers}
              onAddTeacher={handleAddTeacher}
            />
          )}

          {activeTab === 'aiVoice' && (
            <AIVoiceAssistant
              currentRole={currentRole}
              aiSettings={aiSettings}
            />
          )}

          {activeTab === 'aiTeacher' && (
            <AITeacherGuidance
              currentRole={currentRole}
              students={students}
              savedPlans={savedLessonPlans}
              onSavePlan={(p) => setSavedLessonPlans((prev) => [p, ...prev])}
            />
          )}

          {activeTab === 'aiTutor' && (
            <AIStudentTutor
              currentRole={currentRole}
              studentName="Marcus Vance"
            />
          )}

          {activeTab === 'learningDashboard' && (
            <StudentLearningDashboard
              currentRole={currentRole}
              studentName="Marcus Vance"
              onNavigateToTutor={() => setActiveTab('aiTutor')}
            />
          )}
        </main>
      </div>

      {/* Admin AI Governance & Policies Modal */}
      <AdminAIControlsModal
        isOpen={isAdminAISettingsOpen}
        onClose={() => setIsAdminAISettingsOpen(false)}
        settings={aiSettings}
        onUpdateSettings={setAiSettings}
      />
    </div>
  );
}
