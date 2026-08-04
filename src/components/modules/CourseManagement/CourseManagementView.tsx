import React, { useState } from 'react';
import type { Course } from '../../../types';
import { mockCourses } from '../../../data/mockData';
import {
  Plus,
  Clock,
  Users,
  Star,
  CheckCircle,
  PlayCircle,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Modal } from '../../common/Modal';

export const CourseManagementView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(mockCourses[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string>('mod-1');

  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Software Development');
  const [newCoursePrice, setNewCoursePrice] = useState(499);
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Course = {
      id: `crs-${Date.now()}`,
      title: newCourseTitle,
      category: newCourseCategory,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      price: newCoursePrice,
      durationHours: 40,
      description: newCourseDesc || 'Master modern fullstack development concepts with hands-on practice projects.',
      instructorName: 'Dr. Rajesh Kumar',
      instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      totalStudents: 0,
      rating: 5.0,
      isPublished: true,
      learningOutcomes: ['Build scalable applications', 'Deploy to cloud environments'],
      prerequisites: ['Basic programming background'],
      modules: []
    };
    setCourses([created, ...courses]);
    setSelectedCourse(created);
    setIsAddModalOpen(false);
    setNewCourseTitle('');
    setNewCourseDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Course Catalog & Curriculum Builder</h1>
          <p className="text-xs text-gray-500">Create, manage, publish courses and structure video/document lessons.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-200"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {courses.map((crs) => {
            const isSelected = selectedCourse?.id === crs.id;
            return (
              <div
                key={crs.id}
                onClick={() => setSelectedCourse(crs)}
                className={`bg-white p-4 rounded-2xl border transition-200 cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-card'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={crs.thumbnail}
                    alt={crs.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {crs.category}
                      </span>
                      <span className="text-xs font-bold text-slate-900">${crs.price}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs mt-1 truncate">{crs.title}</h3>
                    <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" /> {crs.durationHours} hrs
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" /> {crs.totalStudents}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-current text-amber-500" /> {crs.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCourse && (
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-card space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">{selectedCourse.category}</span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedCourse.title}</h2>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{selectedCourse.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-slate-900">${selectedCourse.price}</span>
                <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                  Published & Active
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Learning Outcomes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedCourse.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Curriculum Structure</h4>
                <button className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Module
                </button>
              </div>

              {selectedCourse.modules.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No modules created yet. Click "Add Module" to start structuring lessons.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedCourse.modules.map((mod) => {
                    const isExpanded = expandedModuleId === mod.id;
                    return (
                      <div key={mod.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() => setExpandedModuleId(isExpanded ? '' : mod.id)}
                          className="w-full p-3.5 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-200 text-left"
                        >
                          <span className="font-bold text-slate-900 text-xs">{mod.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-semibold">{mod.lessons.length} Lessons</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-3 divide-y divide-gray-100 bg-white">
                            {mod.lessons.map((les) => (
                              <div key={les.id} className="py-2.5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2.5">
                                  {les.contentType === 'VIDEO' ? (
                                    <PlayCircle className="w-4 h-4 text-blue-600" />
                                  ) : les.contentType === 'PDF' ? (
                                    <FileText className="w-4 h-4 text-purple-600" />
                                  ) : (
                                    <HelpCircle className="w-4 h-4 text-amber-600" />
                                  )}
                                  <span className="font-medium text-slate-800">{les.title}</span>
                                </div>
                                <span className="text-[11px] text-gray-400 font-mono">{les.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Master Course"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Masterclass: Microservices with Docker & NestJS"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={newCourseCategory}
                onChange={(e) => setNewCourseCategory(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              >
                <option value="Software Development">Software Development</option>
                <option value="Computer Science">Computer Science</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Data Science & AI">Data Science & AI</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price ($ USD)</label>
              <input
                type="number"
                required
                value={newCoursePrice}
                onChange={(e) => setNewCoursePrice(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Description</label>
            <textarea
              rows={3}
              placeholder="Brief summary of syllabus and target audience..."
              value={newCourseDesc}
              onChange={(e) => setNewCourseDesc(e.target.value)}
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
              Publish Course
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
