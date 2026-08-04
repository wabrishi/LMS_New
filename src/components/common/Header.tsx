import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import {
  Search,
  Bell,
  ShieldCheck,
  Building2,
  GraduationCap,
  BookOpen,
  X
} from 'lucide-react';
import { mockNotifications } from '../../data/mockData';

export const Header: React.FC = () => {
  const { role, currentUser, searchQuery, setSearchQuery } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const rolesList: { id: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'SUPER_ADMIN', label: 'Super Admin', icon: <ShieldCheck className="w-4 h-4 text-purple-600" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'INSTITUTE_ADMIN', label: 'Institute Admin', icon: <Building2 className="w-4 h-4 text-blue-600" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'FACULTY', label: 'Faculty / Trainer', icon: <BookOpen className="w-4 h-4 text-emerald-600" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'STUDENT', label: 'Student Portal', icon: <GraduationCap className="w-4 h-4 text-amber-600" />, color: 'bg-amber-50 text-amber-700 border-amber-200' }
  ];

  const currentRoleObj = rolesList.find(r => r.id === role) || rolesList[0];
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      <div className="flex items-center gap-3 w-1/3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Global search courses, students, faculty, batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-200"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Badge Indicator (Read-only, Dropdown Removed) */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-subtle ${currentRoleObj.color}`}>
          {currentRoleObj.icon}
          <span>{currentRoleObj.label}</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl relative transition-200"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-dropdown p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50/50 text-xs transition-200">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-gray-600 text-[11px] mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.firstName}
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/20"
          />
          <div className="hidden md:block text-left leading-tight">
            <div className="text-xs font-bold text-slate-900">
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <div className="text-[10px] text-gray-500">{currentUser.instituteName}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
