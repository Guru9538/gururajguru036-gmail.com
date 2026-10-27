import React, { useState, useEffect } from 'react';
import { Student, AttendanceStatus, AttendanceSession, UserRole } from '../types';
import {
  CalendarCheck,
  Calendar,
  Check,
  X,
  Clock,
  AlertTriangle,
  Save,
  CheckCircle2,
  Users,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { calculateAttendanceStats } from '../utils/schoolMath';

interface AttendanceTrackerProps {
  students: Student[];
  currentRole: UserRole;
  sessions: AttendanceSession[];
  onSaveSession: (session: AttendanceSession) => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  currentRole,
  sessions,
  onSaveSession,
}) => {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedDate, setSelectedDate] = useState('2026-10-27');
  const [entries, setEntries] = useState<Record<string, { status: AttendanceStatus; note: string }>>({});
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Filter students for the selected class
  const classStudents = students.filter((s) => {
    const key = `${s.grade.replace('Grade ', '')}-${s.section}`;
    return key === selectedClass;
  });

  // When class or date changes, load existing session or initialize default
  useEffect(() => {
    const existing = sessions.find((s) => s.classKey === selectedClass && s.date === selectedDate);
    const initialMap: Record<string, { status: AttendanceStatus; note: string }> = {};

    if (existing) {
      existing.entries.forEach((e) => {
        initialMap[e.studentId] = { status: e.status, note: e.note || '' };
      });
    }

    // Ensure all class students have an entry (default to present if not recorded)
    classStudents.forEach((st) => {
      if (!initialMap[st.id]) {
        initialMap[st.id] = { status: 'present', note: '' };
      }
    });

    setEntries(initialMap);
  }, [selectedClass, selectedDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach((st) => {
      updated[st.id] = {
        status,
        note: prevNotes(st.id),
      };
    });
    setEntries(updated);
  };

  const prevNotes = (id: string) => entries[id]?.note || '';

  // Stats calculation
  const currentEntriesList = classStudents.map((st) => ({
    status: entries[st.id]?.status || 'present',
  }));
  const stats = calculateAttendanceStats(currentEntriesList);

  const handleSave = () => {
    const sessionEntries = classStudents.map((st) => ({
      studentId: st.id,
      status: entries[st.id]?.status || 'present',
      note: entries[st.id]?.note || undefined,
    }));

    const session: AttendanceSession = {
      id: `att-${selectedDate}-${selectedClass}`,
      date: selectedDate,
      classKey: selectedClass,
      entries: sessionEntries,
    };

    onSaveSession(session);
    setSaveSuccessMessage(`Attendance successfully recorded for ${selectedClass} on ${selectedDate}.`);
    setTimeout(() => {
      setSaveSuccessMessage('');
    }, 4000);
  };

  const canEdit = currentRole === 'admin' || currentRole === 'teacher';

  return (
    <div className="space-y-6">
      {/* Title & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Attendance Register</h2>
          <p className="text-sm text-slate-500">
            Log student presence, track morning roll-call, and monitor absenteeism compliance.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleSave}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition"
          >
            <Save className="w-4 h-4" /> Save Daily Register
          </button>
        )}
      </div>

      {saveSuccessMessage && (
        <div
          role="alert"
          data-testid="attendance-save-alert"
          className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm rounded-xl flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="font-semibold">{saveSuccessMessage}</span>
        </div>
      )}

      {/* Controls Bar: Class selector, Date Picker, and Bulk Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 uppercase">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
            >
              <option value="10-A">Grade 10-A (32 students)</option>
              <option value="10-B">Grade 10-B (28 students)</option>
              <option value="11-A">Grade 11-A (30 students)</option>
              <option value="12-A">Grade 12-A (26 students)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 uppercase">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-1 text-slate-800"
            />
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Bulk:</span>
            <button
              onClick={() => handleMarkAll('present')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
            >
              Reset to Absent
            </button>
          </div>
        )}
      </div>

      {/* Realtime Attendance Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Roster</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Present
          </span>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.present}</p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-2xs">
          <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Late / Tardy
          </span>
          <p className="text-2xl font-bold text-amber-800 mt-1">{stats.late}</p>
        </div>

        <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 shadow-2xs">
          <span className="text-xs text-rose-700 font-medium flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Absent
          </span>
          <p className="text-2xl font-bold text-rose-800 mt-1">{stats.absent}</p>
        </div>

        <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-xs text-sky-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Rate Today
          </span>
          <p className="text-2xl font-bold text-sky-800 mt-1">{stats.attendanceRate}%</p>
        </div>
      </div>

      {/* Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Overall Standing</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((s) => {
                const currentStatus = entries[s.id]?.status || 'present';
                const currentNote = entries[s.id]?.note || '';
                const isUnderThreshold = s.attendanceRate < 75;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{s.rollNo}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>
                          {s.firstName} {s.lastName}
                        </span>
                        {isUnderThreshold && (
                          <span
                            title="Below 75% attendance threshold"
                            className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700"
                          >
                            <AlertTriangle className="w-3 h-3" /> Alert
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-600">
                        {s.attendanceRate}% cumulative
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(s.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                        >
                          <Check className="w-3 h-3" /> Present
                        </button>

                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(s.id, 'late')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                          }`}
                        >
                          <Clock className="w-3 h-3" /> Late
                        </button>

                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(s.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-800'
                          }`}
                        >
                          <X className="w-3 h-3" /> Absent
                        </button>

                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(s.id, 'excused')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'excused'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-800'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {canEdit ? (
                        <input
                          type="text"
                          placeholder={currentStatus === 'absent' ? 'Reason (e.g. sick leave)' : 'Optional notes'}
                          value={currentNote}
                          onChange={(e) => handleNoteChange(s.id, e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                        />
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          {currentNote || 'No notes filed'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
