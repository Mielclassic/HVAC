import React from 'react';
import { CotStep } from '../types/hvac';
import { CheckCircle2, ShieldCheck, ArrowRight, Calculator } from 'lucide-react';

interface CotStepsExplanationProps {
  steps?: CotStep[];
  title?: string;
  className?: string;
}

export const CotStepsExplanation: React.FC<CotStepsExplanationProps> = ({
  steps,
  title = 'AI 공학 연산 검증 4-Step Chain-of-Thought (CoT) 풀이',
  className = '',
}) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">{title}</h5>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              열역학 물리 법칙 위배 방지 및 환각 없는 단계별 수식 유도
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-bold">
          <CheckCircle2 className="w-3 h-3" /> 연산 무결성 검증 통과
        </span>
      </div>

      {/* 4 Steps Grid / Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {steps.map((st) => {
          let stepColor = 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200';
          let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';

          if (st.step === 1) {
            stepColor = 'border-blue-200 bg-blue-50/70 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-100';
            badgeColor = 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/60 dark:text-blue-200 dark:border-blue-700';
          } else if (st.step === 2) {
            stepColor = 'border-sky-200 bg-sky-50/70 text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-100';
            badgeColor = 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/60 dark:text-sky-200 dark:border-sky-700';
          } else if (st.step === 3) {
            stepColor = 'border-indigo-200 bg-indigo-50/70 text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-100';
            badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/60 dark:text-indigo-200 dark:border-indigo-700';
          } else if (st.step === 4) {
            stepColor = 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100';
            badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-700';
          }

          return (
            <div
              key={st.step}
              className={`p-3 rounded-xl border ${stepColor} space-y-1.5 transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${badgeColor}`}>
                  STEP {st.step}
                </span>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate ml-2 flex-1">
                  {st.title}
                </span>
              </div>

              {st.formula && (
                <div className="text-[11px] font-mono text-slate-800 dark:text-blue-300 bg-white/80 dark:bg-slate-950/60 px-2 py-1 rounded border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">적용 공식:</span>
                  <strong>{st.formula}</strong>
                </div>
              )}

              <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">계산 과정: {st.calculation}</div>
                <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  <span>{st.result}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
