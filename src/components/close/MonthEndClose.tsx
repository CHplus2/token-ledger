import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Unlock,
  Shield,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';

export const MonthEndClose: React.FC = () => {
  const {
    closeTasks,
    toggleCloseTask,
    closeReadinessScore,
    openBreaksCount,
    unclassifiedCount,
    pendingJournalsCount,
    currentUser,
    setActiveModule,
    openAIWithContext,
  } = useLedger();

  const [isLocked, setIsLocked] = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);

  const tasksList = closeTasks ?? [];
  const completedCount = tasksList.filter((t) => t.status === 'COMPLETED').length;
  const isController = currentUser?.role === 'CONTROLLER' || currentUser?.role === 'CFO';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Month-End Close Control Center"
        subtitle="Step-by-step institutional digital asset closing workflows, reconciliation sign-offs, and period freeze locks."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAIWithContext('CLOSE_READINESS', { closeTasks: tasksList, closeReadinessScore })}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>AI Close Analysis</span>
            </button>

            <button
              onClick={() => setLockModalOpen(true)}
              disabled={closeReadinessScore < 100 || isLocked}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 ${
                isLocked
                  ? 'bg-[#f1f5f9] text-slate-600 border border-[#cbd5e1] cursor-not-allowed'
                  : closeReadinessScore === 100
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                  : 'bg-[#f8fafc] text-slate-600 border border-[#cbd5e1] cursor-not-allowed'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isLocked ? 'Period Frozen (Locked)' : 'Lock August 2026 Books'}</span>
            </button>
          </div>
        }
      />

      {/* Progress & Scorecard Banner */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-0.5">
              Close Readiness Scorecard
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              August 2026 Close Status:{' '}
              <span className={closeReadinessScore === 100 ? 'text-emerald-600' : 'text-purple-600'}>
                {closeReadinessScore}% Complete
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {completedCount} of {tasksList.length} mandatory accounting controls verified.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-xs font-bold text-slate-900">Target Sign-Off:</span>
              <span className="text-xs text-slate-600 font-mono">Sep 5, 2026 (Day +5)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-[#f1f5f9] rounded-full overflow-hidden border border-[#cbd5e1]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              closeReadinessScore === 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-purple-600 to-indigo-500'
            }`}
            style={{ width: `${closeReadinessScore}%` }}
          />
        </div>
      </div>

      {/* Close Checklist Tasks */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">Mandatory Month-End Close Checklist</span>
          <span className="text-slate-600">Dual-Control Audit Sign-Off Required</span>
        </div>

        <div className="divide-y divide-[#e2e8f0]">
          {tasksList.map((task) => {
            const isCompleted = task.status === 'COMPLETED';

            return (
              <div
                key={task.id}
                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors ${
                  isCompleted ? 'bg-[#f8fafc]/30' : 'hover:bg-[#f8fafc]/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleCloseTask(task.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'border border-[#cbd5e1] hover:border-purple-400 bg-[#f8fafc]'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{task.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f1f5f9] text-purple-700 border border-[#cbd5e1]">
                        {task.category}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{task.description}</p>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Assignee: <strong className="text-slate-700">{task.assignedToName}</strong> • Due: {task.dueDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={task.status} size="sm" />

                  {task.id === 'task_2' && unclassifiedCount > 0 && (
                    <button
                      onClick={() => setActiveModule('transactions')}
                      className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-700 border border-amber-500/30 hover:bg-amber-500/30 font-semibold text-xs cursor-pointer"
                    >
                      Resolve {unclassifiedCount} Items
                    </button>
                  )}

                  {task.id === 'task_3' && openBreaksCount > 0 && (
                    <button
                      onClick={() => setActiveModule('reconciliation')}
                      className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-700 border border-rose-500/30 hover:bg-rose-500/30 font-semibold text-xs cursor-pointer"
                    >
                      Fix {openBreaksCount} Breaks
                    </button>
                  )}

                  {task.id === 'task_4' && pendingJournalsCount > 0 && (
                    <button
                      onClick={() => setActiveModule('subledger')}
                      className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-700 border border-purple-500/30 hover:bg-purple-500/30 font-semibold text-xs cursor-pointer"
                    >
                      Approve Journals
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Period Lock Modal */}
      {lockModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-md p-6 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center gap-2 text-rose-600 font-bold mb-2">
              <Lock className="w-5 h-5" />
              <span>Lock & Freeze August 2026 Period</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Freezing the accounting period permanently prevents modifications to transactions, subledger journal lines, or cost basis lots without formal auditor unlock authorization.
            </p>

            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] text-xs mb-4 text-slate-700">
              <div>Period: <strong className="text-slate-900">August 2026 (2026-08)</strong></div>
              <div>Authorized Signer: <strong className="text-slate-900">{currentUser.name} ({currentUser.title})</strong></div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setLockModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] text-xs font-medium text-slate-700 hover:bg-[#f8fafc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLocked(true);
                  setLockModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm Period Freeze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
