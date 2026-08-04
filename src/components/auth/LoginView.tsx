import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import { apiClient } from '../../services/apiClient';
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Database,
  AlertCircle
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { setAuthUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedQuickRole, setSelectedQuickRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const quickLogins = [
    {
      role: 'SUPER_ADMIN' as UserRole,
      title: 'Super Admin',
      email: 'sysadmin@yourdomain.com',
      password: 'ProdAdminSecure#2026!',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      desc: 'Global system configuration & RBAC permissions matrix',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      role: 'FACULTY' as UserRole,
      title: 'Faculty / Trainer',
      email: 'head.faculty@yourdomain.com',
      password: 'FacultyProdSecure#2026!',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      desc: 'Live classrooms, curriculum builder & rubric grading',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      role: 'STUDENT' as UserRole,
      title: 'Student Portal',
      email: 'student.demo@yourdomain.com',
      password: 'StudentProdSecure#2026!',
      icon: <GraduationCap className="w-5 h-5 text-amber-600" />,
      desc: 'Video lectures, timed examinations & certificates',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  const handleQuickSelect = (item: (typeof quickLogins)[0]) => {
    setSelectedQuickRole(item.role);
    setEmail(item.email);
    setPassword(item.password);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Authenticate directly against Database API
      const res = await apiClient.login({ email, password });

      if (res.success && res.accessToken && res.user) {
        localStorage.setItem('lms_access_token', res.accessToken);
        localStorage.setItem('lms_auth_token', res.accessToken);
        localStorage.setItem('lms_auth_role', res.user.role);
        localStorage.setItem('lms_auth_user', JSON.stringify(res.user));

        setAuthUser(res.user.role as UserRole, res.user);

        setIsLoading(false);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErrorMessage('Authentication failed. Invalid email address or password.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Invalid email address or password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold mx-auto shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/20 mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">EduPulse LMS Studio</h2>
        <p className="mt-2 text-xs text-slate-400">
          Enterprise Learning Management System &bull; Database Authentication Active
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-dropdown border border-gray-100">
          {/* Database Authentication Status Pill */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Strict Database Authentication</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ENFORCED
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">User Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-200"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-200 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating with Database...</span>
              ) : (
                <>
                  <span>Sign In To Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Production Preset Account Auto-Fill */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
              Auto-fill Production Account Credentials
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickLogins.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleQuickSelect(item)}
                  className={`p-3 text-left rounded-2xl border transition-200 flex items-start gap-2.5 ${
                    selectedQuickRole === item.role
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="p-1.5 rounded-xl bg-white shadow-xs border border-gray-100 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate">{item.title}</div>
                    <div className="text-[10px] text-gray-500 truncate">{item.email}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
