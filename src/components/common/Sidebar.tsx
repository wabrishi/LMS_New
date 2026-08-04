import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Video,
  FileText,
  PlaySquare,
  FileCheck2,
  HelpCircle,
  CalendarCheck,
  CreditCard,
  Award,
  MessageSquare,
  Mail,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  roles: UserRole[];
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { role, activeModule, setActiveModule, hasPermission, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Students', icon: <GraduationCap className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY'] },
    { name: 'Faculty', icon: <Users className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN'] },
    { name: 'Courses', icon: <BookOpen className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Batches', icon: <Layers className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY'] },
    { name: 'Live Classes', icon: <Video className="w-5 h-5 text-red-500" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'], badge: 'LIVE' },
    { name: 'Video Library', icon: <PlaySquare className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Study Materials', icon: <FileText className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Assignments', icon: <FileCheck2 className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Quizzes & Exams', icon: <HelpCircle className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Attendance', icon: <CalendarCheck className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Fees & Invoices', icon: <CreditCard className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STUDENT'] },
    { name: 'Certificates', icon: <Award className="w-5 h-5 text-amber-500" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Discussion Forum', icon: <MessageSquare className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Direct Messages', icon: <Mail className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT'] },
    { name: 'Reports & Analytics', icon: <BarChart3 className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY'] },
    { name: 'RBAC Control', icon: <ShieldCheck className="w-5 h-5 text-purple-600" />, roles: ['SUPER_ADMIN'] },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'INSTITUTE_ADMIN'] },
  ];

  const filteredMenu = menuItems.filter((item) => {
    if (item.name === 'RBAC Control') return role === 'SUPER_ADMIN';
    if (item.name === 'Dashboard') return true;
    return hasPermission(role, item.name, 'view');
  });

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-base tracking-tight leading-none block">EduPulse LMS</span>
                <span className="text-[10px] text-gray-500 font-medium">Enterprise Learning Platform</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-gray-400 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-200"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="p-3 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = activeModule === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveModule(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-200 group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-slate-900'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <span className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-slate-900'}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.name}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 text-red-600 rounded-md animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-200"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
