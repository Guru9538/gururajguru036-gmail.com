import React, { useState } from 'react';
import { Student, StudentReportCard, UserRole } from '../types';
import {
  Award,
  Search,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  X,
  FileText,
  Star,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { calculateOverallPerformance } from '../utils/schoolMath';
import { getGradeBadgeColor } from '../utils/helpers';

interface GradebookReportCardsProps {
  students: Student[];
  currentRole: UserRole;
  reportCards: Record<string, StudentReportCard>;
  activeReportCardId: string | null;
  onCloseReportCard: () => void;
  onOpenReportCard: (studentId: string) => void;
  onUpdateMarks?: (studentId: string, subjectIndex: number, newScore: number) => void;
}

export const GradebookReportCards: React.FC<GradebookReportCardsProps> = ({
  students,
  currentRole,
  reportCards,
  activeReportCardId,
  onCloseReportCard,
  onOpenReportCard,
  onUpdateMarks,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Mid-Term');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeCard = activeReportCardId ? reportCards[activeReportCardId] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Examinations & Academic Transcripts
          </h2>
          <p className="text-sm text-slate-500">
            Term evaluations, subject mark sheets, GPA derivations, and printable report cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase">Term:</span>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="text-sm font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 shadow-2xs"
          >
            <option value="Term 1">Term 1 (Autumn)</option>
            <option value="Mid-Term">Mid-Term Evaluation</option>
            <option value="Final Term">Final Term Exam</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search student grade records by name or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm bg-transparent border-none focus:outline-hidden text-slate-800"
        />
      </div>

      {/* Gradebook Overview Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Avg %</th>
                <th className="py-3 px-4 text-center">GPA (4.0)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Class Rank</th>
                <th className="py-3 px-4 text-right">Official Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const report = reportCards[s.id];
                const gradeBadge = report ? getGradeBadgeColor(report.letterGrade) : { bg: 'bg-slate-100 text-slate-700' };

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {s.firstName} {s.lastName}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">{s.rollNo}</div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {s.grade} - {s.section}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-slate-900">
                        {report ? `${report.averagePercentage}%` : '85.0%'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-indigo-600 font-mono">
                        {report ? report.gpa.toFixed(2) : '3.40'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeBadge.bg}`}
                      >
                        {report ? report.letterGrade : 'B+'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs font-semibold text-slate-700">
                        {report ? `#${report.classRank} / ${report.totalStudents}` : '#10 / 32'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenReportCard(s.id)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" /> View Transcript
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- OFFICIAL REPORT CARD MODAL ---------------- */}
      {activeCard && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden print:m-0 print:border-none print:shadow-none">
            {/* Action Bar (Hidden during Print) */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-bold">Official Student Academic Transcript</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={onCloseReportCard}
                  aria-label="Close Transcript"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body (Printable Certificate Style) */}
            <div className="p-8 space-y-6 bg-radial from-slate-50 to-white print:p-6" id="printable-report-card">
              {/* Academy Official Header */}
              <div className="text-center pb-6 border-b-2 border-indigo-900/20">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-900 text-white mb-2 shadow-md">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-serif font-black tracking-wider text-slate-900 uppercase">
                  Crestview Preparatory Academy
                </h1>
                <p className="text-xs font-sans text-slate-500 uppercase tracking-widest mt-0.5">
                  Affiliated to the Board of Secondary Education • Est. 1984
                </p>
                <div className="inline-block mt-3 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-900 text-xs font-bold uppercase tracking-wider">
                  Official Grade Report • {activeCard.academicYear} ({activeCard.term})
                </div>
              </div>

              {/* Student Bio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-semibold">Student Name:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{activeCard.studentName}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold">Roll Number:</span>
                  <p className="font-bold text-slate-900 font-mono mt-0.5">{activeCard.rollNo}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold">Class / Section:</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {activeCard.grade} - {activeCard.section}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold">Attendance Rate:</span>
                  <p className="font-bold text-emerald-700 mt-0.5">
                    {activeCard.attendancePercentage}% (Good)
                  </p>
                </div>
              </div>

              {/* Subject Scores Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3 text-center">Max Marks</th>
                      <th className="py-2.5 px-3 text-center">Obtained</th>
                      <th className="py-2.5 px-3 text-center">%</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCard.subjects.map((sub, idx) => {
                      const pct = Math.round((sub.obtainedScore / sub.maxScore) * 100);
                      const gradeLetter = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : 'B+';
                      return (
                        <tr key={sub.subject} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{sub.subject}</td>
                          <td className="py-2.5 px-3 text-center text-slate-500">{sub.maxScore}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                            {currentRole === 'teacher' && onUpdateMarks ? (
                              <input
                                type="number"
                                min={0}
                                max={sub.maxScore}
                                value={sub.obtainedScore}
                                onChange={(e) => onUpdateMarks(activeCard.studentId, idx, Number(e.target.value))}
                                className="w-14 text-center font-bold bg-amber-50 border border-amber-300 rounded px-1 py-0.5"
                              />
                            ) : (
                              sub.obtainedScore
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-semibold text-slate-700">{pct}%</td>
                          <td className="py-2.5 px-3 text-center font-bold text-indigo-700">
                            {gradeLetter}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 italic">{sub.teacherRemarks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Overall Performance Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-indigo-900">Aggregate %</span>
                  <p className="text-xl font-bold text-indigo-950 mt-1">{activeCard.averagePercentage}%</p>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-indigo-900">Term GPA</span>
                  <p className="text-xl font-bold text-indigo-950 mt-1">{activeCard.gpa.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-indigo-900">Overall Grade</span>
                  <p className="text-xl font-bold text-emerald-700 mt-1">{activeCard.letterGrade}</p>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-indigo-900">Class Rank</span>
                  <p className="text-xl font-bold text-indigo-950 mt-1">
                    #{activeCard.classRank} / {activeCard.totalStudents}
                  </p>
                </div>
              </div>

              {/* Remarks & Signatures */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800">Headmaster / Principal Evaluation:</span>
                  <p className="text-slate-600 italic mt-0.5 font-serif leading-relaxed">
                    "{activeCard.principalRemarks}"
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 text-center text-xs">
                  <div>
                    <div className="border-b border-slate-400 pb-1 font-serif text-slate-800 font-bold">
                      Dr. Robert Hawthorne
                    </div>
                    <span className="text-slate-400 text-[10px]">Class Lead Teacher</span>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto rounded-full border border-indigo-300 text-indigo-700 flex items-center justify-center text-[10px] font-serif uppercase tracking-tight">
                      SEAL
                    </div>
                    <span className="text-slate-400 text-[10px]">Crestview Academy</span>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 pb-1 font-serif text-slate-800 font-bold">
                      Dr. Arthur Sterling
                    </div>
                    <span className="text-slate-400 text-[10px]">Principal / Head of School</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
