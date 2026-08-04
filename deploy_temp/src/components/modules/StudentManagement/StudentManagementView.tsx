import React, { useState } from 'react';
import { DataTable, type Column } from '../../common/DataTable';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import type { Student } from '../../../types';
import { mockStudents } from '../../../data/mockData';
import { UserPlus, Eye, Mail, Phone } from 'lucide-react';

export const StudentManagementView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: `ED-2026-0${mockStudents.length + 1}`
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      userId: `u-std-${Date.now()}`,
      rollNumber: formData.rollNumber,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+91 98765 00000',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      enrolledCourseCount: 1,
      attendancePercentage: 100,
      feeStatus: 'PAID',
      admissionDate: new Date().toISOString().split('T')[0]
    };

    setStudents([newStudent, ...students]);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', phone: '', rollNumber: '' });
  };

  const columns: Column<Student>[] = [
    {
      header: 'Student Name',
      accessorKey: 'name',
      sortable: true,
      cell: (student) => (
        <div className="flex items-center gap-3">
          <img src={student.avatarUrl} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
          <div>
            <div className="font-bold text-slate-900">{student.name}</div>
            <div className="text-[10px] text-gray-400">{student.rollNumber}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Contact Info',
      accessorKey: 'email',
      cell: (student) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-[11px] text-gray-700">
            <Mail className="w-3 h-3 text-gray-400" /> {student.email}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Phone className="w-3 h-3 text-gray-400" /> {student.phone}
          </div>
        </div>
      )
    },
    {
      header: 'Courses Enrolled',
      accessorKey: 'enrolledCourseCount',
      sortable: true,
      cell: (student) => (
        <span className="font-semibold text-slate-800">{student.enrolledCourseCount} Courses</span>
      )
    },
    {
      header: 'Attendance %',
      accessorKey: 'attendancePercentage',
      sortable: true,
      cell: (student) => {
        const pct = student.attendancePercentage;
        const color = pct >= 90 ? 'text-emerald-600 font-bold' : pct >= 75 ? 'text-amber-600 font-semibold' : 'text-rose-600 font-bold';
        return <span className={color}>{pct}%</span>;
      }
    },
    {
      header: 'Fee Status',
      accessorKey: 'feeStatus',
      sortable: true,
      cell: (student) => (
        <Badge
          variant={
            student.feeStatus === 'PAID'
              ? 'success'
              : student.feeStatus === 'PENDING'
              ? 'warning'
              : 'error'
          }
        >
          {student.feeStatus}
        </Badge>
      )
    },
    {
      header: 'Actions',
      cell: (student) => (
        <button
          onClick={() => setSelectedStudent(student)}
          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-200"
        >
          <Eye className="w-3.5 h-3.5" /> View Profile
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-xs text-gray-500">Manage student admissions, profiles, course enrollments, and academic performance.</p>
        </div>
      </div>

      <DataTable
        title="Enrolled Student Roster"
        subtitle="Filter, search and export student records"
        columns={columns}
        data={students}
        searchPlaceholder="Search student name, roll number, email..."
        actionButton={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-200 shadow-md shadow-blue-500/20"
          >
            <UserPlus className="w-3.5 h-3.5" /> New Student Admission
          </button>
        }
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Student Admission Registration"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Student Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="student@domain.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              Register & Enrol Student
            </button>
          </div>
        </form>
      </Modal>

      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title="Student Academic Profile"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <img src={selectedStudent.avatarUrl} alt={selectedStudent.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h2>
                <div className="text-xs text-blue-700 font-mono font-semibold">Roll No: {selectedStudent.rollNumber}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                  <span>{selectedStudent.email}</span> &bull; <span>{selectedStudent.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-400 font-semibold uppercase">Enrolled Courses</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{selectedStudent.enrolledCourseCount}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-400 font-semibold uppercase">Attendance %</div>
                <div className="text-xl font-bold text-emerald-600 mt-1">{selectedStudent.attendancePercentage}%</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-400 font-semibold uppercase">Fee Status</div>
                <div className="mt-1">
                  <Badge variant={selectedStudent.feeStatus === 'PAID' ? 'success' : 'error'}>
                    {selectedStudent.feeStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
