import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, Bell, Shield, BookOpen, User, Users, Calendar, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  unreadCount?: number;
  onOpenAnnouncements?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  unreadCount = 2,
  onOpenAnnouncements,
}) => {
  const roles: { id: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'admin', label: 'Administrator', icon: <Shield className="w-4 h-4 text-indigo-600" />, desc: 'Principal & Operations' },
    { id: 'teacher', label: 'Teacher', icon: <BookOpen className="w-4 h-4 text-emerald-600" />, desc: 'Dr. Hawthorne (10-A)' },
    { id: 'student', label: 'Student', icon: <User className="w-4 h-4 text-sky-600" />, desc: 'Marcus Vance (10-A)' },
    { id: 'parent', label: 'Parent', icon: <Users className="w-4 h-4 text-amber-600" />, desc: 'Eleanor Vance (Parent)' },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Crestview Academy</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-400/30 font-medium">
                  SIS / ERP
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Academic Year 2026–2027 • Fall Term
              </p>
            </div>
          </div>

          {/* Center Info: Date & Term status */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentDate}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Term 1 Active
            </span>
          </div>

          {/* Right Section: Role Switcher & Notifications */}
          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <button
              onClick={onOpenAnnouncements}
              aria-label={`View ${unreadCount} announcements`}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="View Announcements & Notices"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill Container */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
              <div className="hidden lg:flex items-center gap-1 mr-2 px-2 text-[11px] text-slate-400 font-medium">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Role:</span>
              </div>
              <div className="flex gap-1" role="tablist" aria-label="Portal Role Selector">
                {roles.map((role) => {
                  const isActive = currentRole === role.id;
                  return (
                    <button
                      key={role.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onRoleChange(role.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                      title={`${role.label} — ${role.desc}`}
                    >
                      {role.icon}
                      <span className="hidden sm:inline">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
