import React from 'react';
import { X, TrendingUp, Award, CheckCircle, Calendar, Sparkles, Flame, ShieldCheck, User } from 'lucide-react';
import { CycleGrowthItem, ACHIEVEMENT_LEVELS, StudentProfile } from '../types/hvac';

interface GrowthJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCycle: number;
  currentLevel: number;
  history: CycleGrowthItem[];
  student?: StudentProfile | null;
  onSelectCycleToView?: (cycle: number) => void;
}

export const GrowthJourneyModal: React.FC<GrowthJourneyModalProps> = ({
  isOpen,
  onClose,
  currentCycle,
  currentLevel,
  history,
  student,
}) => {
  if (!isOpen) return null;

  const currentLevelInfo = ACHIEVEMENT_LEVELS[currentLevel];
  const totalQuestionsSolved = history.reduce(
    (sum, item) => sum + (item.practiceQuestionsSolved || 0) + 30, // 30 diagnostic + practice
    0
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {student ? `${student.name} 학생의 연속 성장 여정` : '나의 냉동공조 연속 성장 여정'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  {currentCycle}회차 진행 중
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {student
                  ? `학번 ${student.studentId} · ${student.gradeClass || student.department}`
                  : '진단평가와 맞춤형 문제 풀이를 반복하며 기록된 성취수준 성장 이력'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Summary Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">현재 성취 레벨</span>
              <span className={`text-xl md:text-2xl font-black mt-1 block ${currentLevelInfo.textColor}`}>
                Level {currentLevel}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{currentLevelInfo.shortName}</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">진행된 학습 회차</span>
              <span className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1 block">
                {currentCycle}
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">회차</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">지속 순환 학습</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">누적 해결 문항</span>
              <span className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                {totalQuestionsSolved}
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">제</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">진단 + 맞춤 실전</span>
            </div>
          </div>

          {/* Continuous Loop Philosophy Card */}
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">
                '자가진단 → 맞춤형 훈련 → 레벨업 재진단' 완전 학습 선순환 시스템
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                냉동공조공학은 이론과 실기 공식이 유기적으로 연결되어 있습니다. 본 코스웨어는 학생이 한 번 풀고 끝나는 것이 아니라, 맞춤형 문제를 완주할 때마다 새로운 진단평가를 거쳐 지속적으로 상위 마스터 레벨까지 도달하도록 이끕니다.
              </p>
            </div>
          </div>

          {/* Cycle Timeline History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 차수별 성장 히스토리 타임라인
            </h4>

            {history.length === 0 ? (
              <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p>아직 완료된 차수 기록이 저장 중입니다.</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  현재 제{currentCycle}차 진단평가와 맞춤형 문제를 풀면 이곳에 레벨 상승 궤적이 누적됩니다.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, idx) => {
                  const lvlInfo = ACHIEVEMENT_LEVELS[item.level];
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-white dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-mono font-black flex items-center justify-center text-sm border border-blue-200 dark:border-blue-800/40">
                          {item.cycle}차
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              제{item.cycle}차 사이클 완료
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lvlInfo.badgeBg} ${lvlInfo.textColor}`}>
                              Level {item.level}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                            진단 {item.diagnosticScore}/30점 ({item.diagnosticPercentage}%) · 맞춤 실전 {item.practiceQuestionsSolved}문제 완료
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                          {item.completedAt || item.diagnosticDate}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5" /> 완료
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Achievement Badges */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> 달성 역량 배지
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xl block mb-1">🏁</span>
                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">첫 진단 완주</span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">달성 완료</span>
              </div>
              <div className={`p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border ${currentCycle >= 2 ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20' : 'border-slate-200 dark:border-slate-800 opacity-50'}`}>
                <span className="text-xl block mb-1">🔄</span>
                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">2회차 레벨업 도전</span>
                <span className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold">{currentCycle >= 2 ? '달성 완료' : '진행 예정'}</span>
              </div>
              <div className={`p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border ${currentLevel >= 3 ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 opacity-50'}`}>
                <span className="text-xl block mb-1">📜</span>
                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">기능사 합격권 도달</span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">{currentLevel >= 3 ? '달성 완료' : 'Level 3 이상'}</span>
              </div>
              <div className={`p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border ${currentLevel >= 5 ? 'border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20' : 'border-slate-200 dark:border-slate-800 opacity-50'}`}>
                <span className="text-xl block mb-1">👑</span>
                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">냉동공조 마스터</span>
                <span className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold">{currentLevel >= 5 ? '달성 완료' : 'Level 5 달성'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/80 dark:bg-slate-950">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
