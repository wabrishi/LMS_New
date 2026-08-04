import React, { useState, useEffect } from 'react';
import type { Quiz } from '../../../types';
import { mockQuizzes } from '../../../data/mockData';
import { Clock, Award, Play, RotateCcw, ShieldAlert } from 'lucide-react';

export const QuizExaminationView: React.FC = () => {
  const [quizzes] = useState<Quiz[]>(mockQuizzes);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(1800);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  useEffect(() => {
    if (!activeQuiz || isQuizCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuiz, isQuizCompleted]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.durationMinutes * 60);
    setIsQuizCompleted(false);
    setQuizScore(0);
  };

  const handleSelectOption = (qId: string, answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: answer });
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q) => {
      const studentAns = selectedAnswers[q.id];
      if (studentAns === q.correctAnswer) {
        score += q.marks;
      } else if (studentAns && activeQuiz.isNegativeMarking) {
        score -= 2.0;
      }
    });
    setQuizScore(Math.max(0, score));
    setIsQuizCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Quiz & Examination Engine</h1>
        <p className="text-xs text-gray-500">Take timed interactive assessments with automatic grading and negative marking safeguards.</p>
      </div>

      {!activeQuiz ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((qz) => (
            <div key={qz.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:shadow-md transition-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md uppercase">
                    {qz.courseName}
                  </span>
                  {qz.isNegativeMarking && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Negative Marking (-2.0)
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base mt-2">{qz.title}</h3>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[10px] block font-semibold">Questions</span>
                    <span className="font-bold text-slate-900">{qz.questionCount} Items</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[10px] block font-semibold">Duration</span>
                    <span className="font-bold text-slate-900">{qz.durationMinutes} Mins</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[10px] block font-semibold">Total Score</span>
                    <span className="font-bold text-slate-900">{qz.totalMarks} Pts</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartQuiz(qz)}
                className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-200"
              >
                <Play className="w-4 h-4 fill-current" /> Start Examination
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-card space-y-6">
          {!isQuizCompleted ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">{activeQuiz.title}</h2>
                  <span className="text-xs text-gray-500">Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
                </div>
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-xl border border-red-200 font-mono font-bold text-sm">
                  <Clock className="w-4 h-4" /> Time Left: {formatTime(timeLeft)}
                </div>
              </div>

              {(() => {
                const q = activeQuiz.questions[currentQuestionIdx];
                return (
                  <div className="space-y-4">
                    <div className="text-sm font-bold text-slate-900 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      {q.text} <span className="text-blue-600 text-xs font-semibold ml-2">({q.marks} Marks)</span>
                    </div>

                    <div className="space-y-2">
                      {q.options?.map((opt, idx) => {
                        const isSelected = selectedAnswers[q.id] === opt;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(q.id, opt)}
                            className={`w-full text-left p-3.5 rounded-xl text-xs font-medium border transition-200 ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                                : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-50'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                  disabled={currentQuestionIdx === 0}
                  className="px-4 py-2 bg-gray-100 text-slate-700 rounded-xl text-xs font-semibold disabled:opacity-50"
                >
                  Previous Question
                </button>

                {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Submit Exam & View Score
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-100">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Examination Completed!</h2>
              <div className="text-3xl font-extrabold text-blue-600">
                {quizScore} / {activeQuiz.totalMarks} Points
              </div>
              <p className="text-xs text-gray-500">
                {quizScore >= activeQuiz.passingMarks
                  ? 'Congratulations! You passed the assessment benchmark.'
                  : 'Requires improvement. Review curriculum notes and re-attempt.'}
              </p>

              <button
                onClick={() => setActiveQuiz(null)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Return to Catalog
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
