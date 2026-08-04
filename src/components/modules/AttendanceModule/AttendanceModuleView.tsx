import React, { useState } from 'react';
import type { AttendanceEntry } from '../../../types';
import { mockStudents } from '../../../data/mockData';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '../../common/Badge';

export const AttendanceModuleView: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState('FS-2026-SPRING-A');
  const [selectedDate, setSelectedDate] = useState('2026-08-03');

  const [attendance, setAttendance] = useState<AttendanceEntry[]>(
    mockStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      rollNumber: s.rollNumber,
      avatarUrl: s.avatarUrl,
      status: s.attendancePercentage < 75 ? 'ABSENT' : 'PRESENT'
    }))
  );

  const toggleStatus = (studentId: string, newStatus: AttendanceEntry['status']) => {
    setAttendance(attendance.map(a => a.studentId === studentId ? { ...a, status: newStatus } : a));
  };

  const markAllPresent = () => {
    setAttendance(attendance.map(a => ({ ...a, status: 'PRESENT' })));
  };

  const presentCount = attendance.filter(a => a.status === 'PRESENT').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Attendance Register</h1>
          <p className="text-xs text-gray-500">Track daily student check-ins, bulk mark statuses, and monitor low attendance alerts (&lt;75%).</p>
        </div>
        <button
          onClick={markAllPresent}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-200"
        >
          <CheckCircle2 className="w-4 h-4" /> Bulk Mark All Present
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Active Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
            >
              <option value="FS-2026-SPRING-A">FS-2026-SPRING-A (Web Dev)</option>
              <option value="DSA-2026-SPRING-B">DSA-2026-SPRING-B (Algorithms)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Register Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
            />
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-bold text-slate-900">{presentCount} / {attendance.length} Present</div>
          <span className="text-[10px] text-gray-400">Attendance Ratio: {Math.round((presentCount / attendance.length) * 100)}%</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase font-semibold text-slate-900">
            <tr>
              <th className="p-3.5">Student Details</th>
              <th className="p-3.5">Roll Number</th>
              <th className="p-3.5 text-center">Status Action</th>
              <th className="p-3.5 text-right">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {attendance.map((entry) => (
              <tr key={entry.studentId} className="hover:bg-gray-50 transition-200">
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <img src={entry.avatarUrl} alt={entry.studentName} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-bold text-slate-900">{entry.studentName}</span>
                  </div>
                </td>
                <td className="p-3.5 font-mono text-gray-500">{entry.rollNumber}</td>
                <td className="p-3.5 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => toggleStatus(entry.studentId, 'PRESENT')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-200 ${
                        entry.status === 'PRESENT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-slate-900'
                      }`}
                    >
                      PRESENT
                    </button>
                    <button
                      onClick={() => toggleStatus(entry.studentId, 'LATE')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-200 ${
                        entry.status === 'LATE' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-slate-900'
                      }`}
                    >
                      LATE
                    </button>
                    <button
                      onClick={() => toggleStatus(entry.studentId, 'ABSENT')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-200 ${
                        entry.status === 'ABSENT' ? 'bg-rose-600 text-white shadow-xs' : 'text-gray-600 hover:text-slate-900'
                      }`}
                    >
                      ABSENT
                    </button>
                  </div>
                </td>
                <td className="p-3.5 text-right">
                  <Badge
                    variant={
                      entry.status === 'PRESENT'
                        ? 'success'
                        : entry.status === 'LATE'
                        ? 'warning'
                        : 'error'
                    }
                  >
                    {entry.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
