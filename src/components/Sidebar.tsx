import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Award,
  Clock,
  CreditCard,
  BellRing,
  Briefcase,
  ChevronRight,
  School,
  PhoneCall,
  Mic,
  Sparkles,
  Lightbulb,
  Compass,
  Sliders,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'gradebook'
  | 'timetable'
  | 'fees'
  | 'announcements'
  | 'teachers'
  | 'aiVoice'
  | 'aiTeacher'
  | 'aiTutor'
  | 'learningDashboard';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  lowAttendanceCount?: number;
  pendingFeesCount?: number;
  onOpenAISettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  lowAttendanceCount = 1,
  pendingFeesCount = 2,
  onOpenAISettings,
}) => {
  const getAINavItems = () => {
    const items = [
      {
        id: 'aiVoice' as ActiveTab,
        label: 'AI Voice Assistant',
        icon: Mic,
        badge: 'Voice & ಕನ್ನಡ',
        badgeColor: 'bg-indigo-600 text-white',
      },
      {
        id: 'aiTeacher' as ActiveTab,
        label: 'AI Teacher Guidance',
        icon: Sparkles,
        badge: 'Copilot',
        badgeColor: 'bg-emerald-600 text-white',
        visible: currentRole === 'admin' || currentRole === 'teacher',
      },
      {
        id: 'aiTutor' as ActiveTab,
        label: 'AI Socratic Tutor',
        icon: Lightbulb,
        badge: '1-on-1',
        badgeColor: 'bg-amber-500 text-slate-900',
        visible: true,
      },
      {
        id: 'learningDashboard' as ActiveTab,
        label: 'Student Learning Hub',
        icon: Compass,
        badge: 'XP & Goals',
        badgeColor: 'bg-purple-600 text-white',
        visible: true,
      },
    ];

    return items.filter((i) => i.visible !== false);
  };

  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'students' as ActiveTab, label: 'Students Directory', icon: Users, badge: null },
      {
        id: 'attendance' as ActiveTab,
        label: 'Attendance Register',
        icon: CalendarCheck,
        badge: lowAttendanceCount > 0 && (currentRole === 'admin' || currentRole === 'teacher') ? `${lowAttendanceCount} alert` : null,
        badgeColor: 'bg-rose-500 text-white',
      },
      { id: 'gradebook' as ActiveTab, label: 'Grades & Report Cards', icon: Award },
      { id: 'timetable' as ActiveTab, label: 'Timetable & Classes', icon: Clock },
      {
        id: 'fees' as ActiveTab,
        label: currentRole === 'parent' || currentRole === 'student' ? 'Fee Invoices & Pay' : 'Fee Management',
        icon: CreditCard,
        badge: pendingFeesCount > 0 ? `${pendingFeesCount} due` : null,
        badgeColor: 'bg-amber-500 text-slate-900',
      },
      { id: 'announcements' as ActiveTab, label: 'Notice Board', icon: BellRing },
      { id: 'teachers' as ActiveTab, label: 'Faculty & Staff', icon: Briefcase },
    ];

    return baseItems;
  };

  const aiNavItems = getAINavItems();
  const navItems = getNavItems();

  const getProfileInfo = () => {
    switch (currentRole) {
      case 'admin':
        return {
          name: 'Dr. Arthur Sterling',
          role: 'Head of School / Principal',
          sub: 'Administrative Authority',
          avatarBg: 'bg-indigo-600',
        };
      case 'teacher':
        return {
          name: 'Dr. Robert Hawthorne',
          role: 'Senior Math Faculty',
          sub: 'Class Lead • Grade 10-A',
          avatarBg: 'bg-emerald-600',
        };
      case 'student':
        return {
          name: 'Marcus Vance',
          role: 'Student • ID 2026-10A-01',
          sub: 'Grade 10 - Section A',
          avatarBg: 'bg-sky-600',
        };
      case 'parent':
        return {
          name: 'Eleanor Vance',
          role: 'Parent / Guardian',
          sub: 'Ward: Marcus Vance (10-A)',
          avatarBg: 'bg-amber-600',
        };
    }
  };

  const profile = getProfileInfo();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-30 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          {/* Active User Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg ${profile.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}
            >
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .slice(-2)
                .join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-slate-900 truncate">{profile.name}</h4>
              <p className="text-xs text-indigo-600 font-medium truncate">{profile.role}</p>
              <p className="text-[11px] text-slate-500 truncate">{profile.sub}</p>
            </div>
          </div>

          {/* AI Learning & Teaching Suite */}
          <div>
            <div className="px-2 mb-2 text-[11px] font-semibold tracking-wider text-indigo-600 uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Learning & Teaching
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">New</span>
            </div>
            <nav className="space-y-1">
              {aiNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600'}`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-indigo-700 text-white' : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Management Modules */}
          <div>
            <div className="px-2 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Management Modules
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-4 h-4 text-indigo-500" />}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Admin AI Controls trigger */}
          {currentRole === 'admin' && onOpenAISettings && (
            <button
              onClick={onOpenAISettings}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-600" />
                <span>AI Governance & Controls</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-bold">Admin</span>
            </button>
          )}

          {/* School Contact Quick Card */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <School className="w-4 h-4 text-indigo-600" />
              <span>Crestview Academy</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Campus Helpdesk: (555) 019-4820
              <br />
              Office Hours: Mon–Fri, 8 AM – 4 PM
            </p>
            <div className="pt-1 border-t border-indigo-100/80 flex items-center justify-between text-indigo-600 font-medium">
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3 h-3" /> Emergency Line
              </span>
              <span className="text-slate-500 text-[10px]">Ext. 99</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>EduManage SIS v3.4</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
          </span>
        </div>
      </aside>
    </>
  );
};
