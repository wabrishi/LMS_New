import React, { useState } from 'react';
import type { StudyMaterial } from '../../../types';
import { mockMaterials } from '../../../data/mockData';
import { FileText, Folder, Download, Eye, Plus, Archive } from 'lucide-react';
import { Modal } from '../../common/Modal';

export const StudyMaterialsView: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>(mockMaterials);
  const [selectedDoc, setSelectedDoc] = useState<StudyMaterial | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('General');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: title || 'New_Course_Notes.pdf',
      courseName: 'Full-Stack Modern Web Engineering',
      fileType: 'PDF',
      fileSize: '3.5 MB',
      fileUrl: '#',
      uploadedAt: new Date().toISOString().split('T')[0],
      folder: folder
    };
    setMaterials([created, ...materials]);
    setIsUploadOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Study Materials Repository</h1>
          <p className="text-xs text-gray-500">Centralized file storage for PDF lecture slides, code repositories, and ZIP archives.</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-200"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((mat) => (
          <div key={mat.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:shadow-md transition-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  {mat.fileType === 'ZIP' ? <Archive className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  {mat.fileSize}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-xs mt-3 truncate">{mat.title}</h3>
              <div className="text-[11px] text-gray-500 mt-1">{mat.courseName}</div>
              <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                <Folder className="w-3 h-3 text-amber-500" /> Folder: {mat.folder}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedDoc(mat)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1 transition-200"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <a
                href={mat.fileUrl}
                download
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-200"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Course Study Material"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Document Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Fullstack_LMS_Architecture_Blueprint.pdf"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Folder Category</label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            >
              <option value="Architecture & Diagrams">Architecture & Diagrams</option>
              <option value="Lecture Slides">Lecture Slides</option>
              <option value="Lab Code">Lab Code</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Upload Material
            </button>
          </div>
        </form>
      </Modal>

      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={`Preview: ${selectedDoc.title}`}
          maxWidth="max-w-3xl"
        >
          <div className="bg-gray-100 p-8 rounded-xl text-center space-y-4">
            <FileText className="w-16 h-16 text-blue-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">{selectedDoc.title}</h3>
            <p className="text-xs text-gray-500">Official document preview simulated viewer for {selectedDoc.courseName}.</p>
          </div>
        </Modal>
      )}
    </div>
  );
};
