import React, { useState } from 'react';
import type { Assignment } from '../../../types';
import { mockAssignments } from '../../../data/mockData';
import { Calendar, Upload } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Badge } from '../../common/Badge';

export const AssignmentModuleView: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);

  const [givenScore, setGivenScore] = useState(95);
  const [feedback, setFeedback] = useState('Excellent work!');

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsg) return;
    setAssignments(assignments.map(a => {
      if (a.id === selectedAsg.id && a.studentSubmission) {
        return {
          ...a,
          studentSubmission: {
            ...a.studentSubmission,
            score: givenScore,
            feedback: feedback,
            status: 'GRADED'
          }
        };
      }
      return a;
    }));
    setIsGradeOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-sans">Assignments & Lab Homework</h1>
        <p className="text-xs text-gray-500">Track student homework submissions, grade rubrics, and automated deadlines.</p>
      </div>

      <div className="space-y-4">
        {assignments.map((asg) => (
          <div key={asg.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:shadow-md transition-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                    {asg.batchName}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">{asg.courseName}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{asg.title}</h3>
                <p className="text-xs text-gray-600 max-w-2xl">{asg.description}</p>
                <div className="text-[11px] text-gray-400 flex items-center gap-4 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due Date: {asg.dueDate}
                  </span>
                  <span>Max Score: {asg.maxMarks} Points</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {asg.studentSubmission ? (
                  <div className="text-right">
                    <Badge variant={asg.studentSubmission.status === 'GRADED' ? 'success' : 'info'}>
                      {asg.studentSubmission.status === 'GRADED' ? `GRADED: ${asg.studentSubmission.score}/${asg.maxMarks}` : 'SUBMITTED'}
                    </Badge>
                    <div className="text-[10px] text-gray-400 mt-1">Submitted at {asg.studentSubmission.submittedAt}</div>
                  </div>
                ) : (
                  <Badge variant="warning">SUBMISSION PENDING</Badge>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedAsg(asg);
                      setIsGradeOpen(true);
                    }}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    Grade & Rubric
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAsg(asg);
                      setIsSubmitOpen(true);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Upload Solution
                  </button>
                </div>
              </div>
            </div>

            {asg.studentSubmission?.feedback && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800">
                <span className="font-bold">Faculty Rubric Feedback:</span> {asg.studentSubmission.feedback}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedAsg && (
        <Modal
          isOpen={isGradeOpen}
          onClose={() => setIsGradeOpen(false)}
          title={`Grade Submission: ${selectedAsg.title}`}
        >
          <form onSubmit={handleGrade} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Score (Max {selectedAsg.maxMarks}) *</label>
              <input
                type="number"
                required
                max={selectedAsg.maxMarks}
                value={givenScore}
                onChange={(e) => setGivenScore(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Notes</label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsGradeOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Save Grade & Send Feedback
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedAsg && (
        <Modal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          title={`Submit Homework Solution: ${selectedAsg.title}`}
        >
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 bg-gray-50 p-8 rounded-xl text-center">
              <Upload className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Drag and drop your solution ZIP / PDF here</p>
              <span className="text-[10px] text-gray-400">Maximum file size: 50MB</span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSubmitOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Solution uploaded successfully!');
                  setIsSubmitOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
