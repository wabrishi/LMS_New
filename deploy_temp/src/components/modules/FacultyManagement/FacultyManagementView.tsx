import React, { useState } from 'react';
import type { Faculty } from '../../../types';
import { mockFaculty } from '../../../data/mockData';
import { Star, BookOpen, Layers, UserPlus } from 'lucide-react';
import { Modal } from '../../common/Modal';

export const FacultyManagementView: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>(mockFaculty);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'Senior Professor',
    specialization: 'Computer Science & Software Engineering'
  });

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Faculty = {
      id: `fac-${Date.now()}`,
      userId: `u-fac-${Date.now()}`,
      employeeId: `EMP-FAC-${mockFaculty.length + 101}`,
      name: newFaculty.name,
      email: newFaculty.email,
      phone: newFaculty.phone || '+91 98111 00000',
      designation: newFaculty.designation,
      specialization: newFaculty.specialization,
      assignedBatchesCount: 2,
      totalStudents: 80,
      rating: 4.9,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    };
    setFacultyList([...facultyList, created]);
    setIsAddModalOpen(false);
    setNewFaculty({ name: '', email: '', phone: '', designation: 'Senior Professor', specialization: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Faculty & Trainer Directory</h1>
          <p className="text-xs text-gray-500">Manage institute faculty members, specializations, batch allocations, and ratings.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-200"
        >
          <UserPlus className="w-4 h-4" /> Onboard Faculty
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facultyList.map((fac) => (
          <div key={fac.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:shadow-md transition-200 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={fac.avatarUrl} alt={fac.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{fac.name}</h3>
                    <div className="text-[11px] text-blue-600 font-semibold">{fac.designation}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{fac.employeeId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-200">
                  <Star className="w-3 h-3 fill-current text-amber-500" /> {fac.rating}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold text-[10px] uppercase block">Specialization</span>
                  <span className="font-semibold text-slate-800">{fac.specialization}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>{fac.assignedBatchesCount} Assigned Batches</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    <span>{fac.totalStudents} Students</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-gray-500 truncate max-w-[180px]">{fac.email}</span>
              <button className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-slate-800 font-semibold transition-200">
                View Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard Faculty Member"
      >
        <form onSubmit={handleAddFaculty} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Name *</label>
            <input
              type="text"
              required
              placeholder="Dr. Anand Sharma"
              value={newFaculty.name}
              onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="faculty@institute.edu"
                value={newFaculty.email}
                onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                placeholder="Associate Professor"
                value={newFaculty.designation}
                onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Specialization / Subjects</label>
            <input
              type="text"
              required
              placeholder="e.g. Cloud Computing & Microservices Architecture"
              value={newFaculty.specialization}
              onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Onboard Trainer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
