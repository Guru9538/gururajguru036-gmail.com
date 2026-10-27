import React, { useState } from 'react';
import { Announcement, UserRole } from '../types';
import { BellRing, Pin, Plus, Filter, Search, Calendar, User, X, AlertTriangle } from 'lucide-react';

interface AnnouncementsBoardProps {
  currentRole: UserRole;
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  isOpenCreateModal: boolean;
  onCloseCreateModal: () => void;
  onOpenCreateModal: () => void;
}

export const AnnouncementsBoard: React.FC<AnnouncementsBoardProps> = ({
  currentRole,
  announcements,
  onAddAnnouncement,
  isOpenCreateModal,
  onCloseCreateModal,
  onOpenCreateModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'Academic' as 'Academic' | 'Urgent' | 'Events' | 'Holiday' | 'Sports',
    author: currentRole === 'admin' ? 'Principal Office' : 'Dr. Robert Hawthorne',
    authorRole: currentRole === 'admin' ? 'Head of School' : 'Faculty Lead',
    targetAudience: 'All' as 'All' | 'Students' | 'Parents' | 'Teachers',
    date: new Date().toISOString().split('T')[0],
    pinned: false,
  });

  const categories = ['All', 'Urgent', 'Academic', 'Events', 'Holiday', 'Sports'];

  const filtered = announcements.filter((ann) => {
    const matchesCategory = selectedCategory === 'All' || ann.category === selectedCategory;
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.content.trim()) return;

    onAddAnnouncement(newNotice);
    onCloseCreateModal();
    setNewNotice({
      title: '',
      content: '',
      category: 'Academic',
      author: currentRole === 'admin' ? 'Principal Office' : 'Dr. Robert Hawthorne',
      authorRole: currentRole === 'admin' ? 'Head of School' : 'Faculty Lead',
      targetAudience: 'All',
      date: new Date().toISOString().split('T')[0],
      pinned: false,
    });
  };

  const canPublish = currentRole === 'admin' || currentRole === 'teacher';

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campus Notices & Bulletins
          </h2>
          <p className="text-sm text-slate-500">
            Institutional announcements, academic schedules, events, and emergency alerts.
          </p>
        </div>

        {canPublish && (
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Publish Announcement
          </button>
        )}
      </div>

      {/* Filter Chips & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bulletins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((ann) => (
          <div
            key={ann.id}
            className={`p-5 rounded-2xl border transition ${
              ann.pinned
                ? 'bg-gradient-to-r from-amber-50/60 to-white border-amber-200 shadow-xs ring-1 ring-amber-300/30'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.pinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      <Pin className="w-3 h-3 text-amber-700" /> Pinned
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ann.category === 'Urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : ann.category === 'Academic'
                        ? 'bg-indigo-100 text-indigo-800'
                        : ann.category === 'Events'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {ann.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {ann.date}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">{ann.title}</h3>
              </div>

              <span className="text-[11px] font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md shrink-0">
                Audience: {ann.targetAudience}
              </span>
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{ann.content}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{ann.author}</span> • {ann.authorRole}
              </span>
              <span className="text-[11px] text-slate-400">Official Bulletin</span>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- PUBLISH NOTICE MODAL ---------------- */}
      {isOpenCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Publish Campus Announcement</h3>
              </div>
              <button onClick={onCloseCreateModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Fair Registration Deadline"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Urgent">Urgent Alert</option>
                    <option value="Events">Campus Events</option>
                    <option value="Holiday">Holiday Notice</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetAudience}
                    onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="All">All Campus</option>
                    <option value="Students">Students Only</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Teachers">Faculty & Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter notice details, instructions, and dates..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={newNotice.pinned}
                  onChange={(e) => setNewNotice({ ...newNotice, pinned: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pinNotice" className="text-slate-700 font-medium">
                  Pin to top of campus bulletin board
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
