import React, { useState } from 'react';
import { TimetableSlot, UserRole } from '../types';
import { Clock, Plus, MapPin, User, Calendar, BookOpen, X, Sparkles } from 'lucide-react';

interface TimetableScheduleProps {
  currentRole: UserRole;
  timetable: TimetableSlot[];
  onAddSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
}

export const TimetableSchedule: React.FC<TimetableScheduleProps> = ({
  currentRole,
  timetable,
  onAddSlot,
}) => {
  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const [activeDay, setActiveDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [slotForm, setSlotForm] = useState({
    day: 'Monday' as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday',
    period: 1,
    startTime: '08:30 AM',
    endTime: '09:15 AM',
    subject: '',
    teacher: '',
    room: 'Room 204',
    classKey: '10-A',
  });

  const daySlots = timetable
    .filter((slot) => slot.day === activeDay && slot.classKey === selectedClass)
    .sort((a, b) => a.period - b.period);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotForm.subject.trim() || !slotForm.teacher.trim()) return;

    onAddSlot(slotForm);
    setIsAddModalOpen(false);
    setSlotForm({
      day: activeDay,
      period: daySlots.length + 1,
      startTime: '02:30 PM',
      endTime: '03:15 PM',
      subject: '',
      teacher: '',
      room: 'Room 204',
      classKey: selectedClass,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Academic Timetable & Class Schedule
          </h2>
          <p className="text-sm text-slate-500">
            Weekly periods, lecture halls, assigned instructors, and real-time period schedule.
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Add Period Slot
          </button>
        )}
      </div>

      {/* Class and Day Selection */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase">Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
          >
            <option value="10-A">Grade 10-A</option>
            <option value="10-B">Grade 10-B</option>
            <option value="11-A">Grade 11-A</option>
            <option value="12-A">Grade 12-A</option>
          </select>
        </div>

        {/* Day Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {days.map((day) => {
            const isActive = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Slots Timeline / Grid */}
      <div className="space-y-3">
        {daySlots.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
            No periods scheduled for {activeDay} in Class {selectedClass}.
          </div>
        ) : (
          daySlots.map((slot, index) => {
            const isFirst = index === 0 && activeDay === 'Monday';
            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isFirst
                    ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-300/40 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Period Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shrink-0 ${
                      isFirst
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-medium">Period</span>
                    <span className="text-sm font-extrabold">{slot.period}</span>
                  </div>

                  {/* Period Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{slot.subject}</h3>
                      {isFirst && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                          Active / Next
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {slot.teacher}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {slot.room}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    45 mins
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ---------------- ADD PERIOD SLOT MODAL ---------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Class Timetable Slot</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chemistry / Biology"
                  value={slotForm.subject}
                  onChange={(e) => setSlotForm({ ...slotForm, subject: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructor / Teacher</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Robert Hawthorne"
                  value={slotForm.teacher}
                  onChange={(e) => setSlotForm({ ...slotForm, teacher: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={slotForm.day}
                    onChange={(e) => setSlotForm({ ...slotForm, day: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Period Number</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={slotForm.period}
                    onChange={(e) => setSlotForm({ ...slotForm, period: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={slotForm.startTime}
                    onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={slotForm.endTime}
                    onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Room / Laboratory</label>
                <input
                  type="text"
                  value={slotForm.room}
                  onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                >
                  Save Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
