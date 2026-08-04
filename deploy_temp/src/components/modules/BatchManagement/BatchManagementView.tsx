import React, { useState } from 'react';
import type { Batch } from '../../../types';
import { mockBatches } from '../../../data/mockData';
import { Layers, Plus } from 'lucide-react';
import { Modal } from '../../common/Modal';

export const BatchManagementView: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [batchName, setBatchName] = useState('');
  const [capacity, setCapacity] = useState(50);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Batch = {
      id: `bat-${Date.now()}`,
      courseId: 'crs-1',
      courseName: 'Full-Stack Modern Web Engineering',
      batchName: batchName || `FS-2026-SUMMER-${mockBatches.length + 1}`,
      facultyId: 'fac-1',
      facultyName: 'Dr. Rajesh Kumar',
      studentCount: 0,
      capacity: capacity,
      startDate: '2026-08-10',
      endDate: '2026-11-30',
      status: 'UPCOMING'
    };
    setBatches([...batches, created]);
    setIsAddModalOpen(false);
    setBatchName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Batch Management</h1>
          <p className="text-xs text-gray-500">Allocate students to cohorts, assign trainers, set capacities, and schedules.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-200"
        >
          <Plus className="w-4 h-4" /> Create New Cohort Batch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((b) => {
          const occupancy = Math.round((b.studentCount / b.capacity) * 100);
          return (
            <div key={b.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:shadow-md transition-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {b.status}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{b.batchName}</h3>
                </div>
                <div className="p-2 bg-gray-50 rounded-xl text-gray-500">
                  <Layers className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              <div className="text-xs text-gray-600 mt-2 font-medium truncate">
                {b.courseName}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Assigned Faculty:</span>
                  <span className="font-semibold text-slate-800">{b.facultyName}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Schedule Duration:</span>
                  <span className="text-gray-700">{b.startDate} to {b.endDate}</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 mb-1">
                    <span>Enrolled Seats</span>
                    <span>{b.studentCount} / {b.capacity} ({occupancy}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancy >= 90 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Student Cohort Batch"
      >
        <form onSubmit={handleCreateBatch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cohort Batch Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. FS-2026-AUTUMN-A"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Batch Capacity (Max Students)</label>
            <input
              type="number"
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
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
              Create Batch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
