import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { StatCard } from '../../common/StatCard';
import {
  GraduationCap,
  BookOpen,
  Video,
  Users,
  DollarSign,
  FileCheck2,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { mockLiveClasses, mockNotifications } from '../../../data/mockData';

export const DashboardView: React.FC = () => {
  const { role, currentUser, setActiveModule } = useAuth();

  const studentGrowthData = [
    { month: 'Jan', students: 120, revenue: 14000 },
    { month: 'Feb', students: 180, revenue: 22000 },
    { month: 'Mar', students: 240, revenue: 31000 },
    { month: 'Apr', students: 310, revenue: 42000 },
    { month: 'May', students: 420, revenue: 58000 },
    { month: 'Jun', students: 510, revenue: 74000 },
    { month: 'Jul', students: 645, revenue: 98000 },
  ];

  const attendanceCategoryData = [
    { name: 'Present', value: 85, color: '#16A34A' },
    { name: 'Late', value: 9, color: '#F59E0B' },
    { name: 'Absent', value: 6, color: '#DC2626' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            {role.replace('_', ' ')} VIEW
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {currentUser.firstName}! 👋
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Here is your daily operational summary for <span className="font-semibold text-slate-800">{currentUser.instituteName}</span>.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveModule('Live Classes')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-200 shadow-md shadow-blue-500/20"
          >
            <Video className="w-4 h-4" /> Join Live Sessions
          </button>
          <button
            onClick={() => setActiveModule('Courses')}
            className="px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-slate-700 text-xs font-semibold rounded-xl transition-200"
          >
            Explore Courses
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value="645"
          trend="+18%"
          icon={<GraduationCap className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Active Courses"
          value="24"
          trend="+4"
          icon={<BookOpen className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Live Today"
          value="3 Sessions"
          icon={<Video className="w-5 h-5" />}
          iconBg="bg-red-50 text-red-600"
        />
        <StatCard
          title="Faculty Team"
          value="18"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Revenue"
          value="$98,400"
          trend="+24%"
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Pending Homework"
          value="12 Files"
          isPositive={false}
          trend="-2"
          icon={<FileCheck2 className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Enrollment & Revenue Growth</h3>
              <p className="text-xs text-gray-500">Monthly student acquisition and tuition trend</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600">
              YTD 2026
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentGrowthData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <h3 className="font-bold text-slate-900 text-sm mb-1">Attendance Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">Overall institute daily check-in ratio</p>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs font-semibold mt-2">
            {attendanceCategoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Today's Live Classes</h3>
            </div>
            <button
              onClick={() => setActiveModule('Live Classes')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {mockLiveClasses.map((lc) => (
              <div
                key={lc.id}
                className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between hover:bg-blue-50/40 transition-200"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{lc.title}</span>
                    {lc.status === 'LIVE' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500 text-white animate-pulse">
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" /> {lc.scheduledTime}
                    </span>
                    <span>Instructor: {lc.instructorName}</span>
                  </div>
                </div>

                <a
                  href={lc.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-200"
                >
                  <Play className="w-3 h-3 fill-current" /> Join
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Activity Stream</h3>
            <span className="text-xs text-gray-400">Realtime audit feed</span>
          </div>

          <div className="space-y-3">
            {mockNotifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-200">
                <div
                  className={`p-2 rounded-xl text-xs font-bold mt-0.5 ${
                    notif.type === 'SUCCESS'
                      ? 'bg-emerald-50 text-emerald-600'
                      : notif.type === 'WARNING'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {notif.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                    <span>{notif.title}</span>
                    <span className="text-[10px] text-gray-400">{notif.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
