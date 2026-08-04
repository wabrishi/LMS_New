import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const ReportsModuleView: React.FC = () => {
  const reportData = [
    { course: 'Web Engineering', students: 245, revenue: 49900, completionRate: 94 },
    { course: 'Data Structures', students: 180, revenue: 39900, completionRate: 88 },
    { course: 'Cloud DevOps', students: 120, revenue: 29900, completionRate: 91 },
  ];

  const handleExportPDF = () => {
    alert('Generating Institute Performance PDF Report...');
  };

  const handleExportExcel = () => {
    alert('Exporting Analytics Data Sheet (.xlsx)...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reports & Visual Analytics</h1>
          <p className="text-xs text-gray-500">Generate executive PDF/Excel snapshots of student growth, revenue, and batch performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-200"
          >
            <FileText className="w-4 h-4 text-red-400" /> Export PDF Report
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-200 shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel (.xlsx)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Course Enrollment Metrics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="course" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="students" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Course Completion %</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="course" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="completionRate" stroke="#16A34A" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
