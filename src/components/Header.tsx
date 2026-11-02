import React from 'react';
import {
  Snowflake,
  Activity,
  Award,
  BookOpen,
  Zap,
  BarChart2,
  FileCheck2,
  HelpCircle,
  User,
  Users,
  Sun,
  Moon,
} from 'lucide-react';
import { DiagnosticResult, ACHIEVEMENT_LEVELS, StudentProfile } from '../types/hvac';

interface HeaderProps {
  currentTab: 'diagnostic' | 'report' | 'practice' | 'mollier';
  onSelectTab: (tab: 'diagnostic' | 'report' | 'practice' | 'mollier') => void;
  diagnosticResult: DiagnosticResult | null;
  currentCycle: number;
  currentStudent: StudentProfile | null;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenStudyModal: () => void;
  onOpenGrowthModal: () => void;
  onOpenStudentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  diagnosticResult,
  currentCycle,
  currentStudent,
  theme = 'light',
  onToggleTheme,
  onOpenStudyModal,
  onOpenGrowthModal,
  onOpenStudentModal,
}) => {
  const levelInfo = diagnosticResult ? ACHIEVEMENT_LEVELS[diagnosticResult.level] : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black flex-shrink-0">
            <Snowflake className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg tracking-tight">
                HVAC-R AI 에듀테크
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              2022 개정 직업계고 전문교과 [냉동 공조 설계 & 유지 보수 관리] 맞춤형 코스웨어
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => onSelectTab('diagnostic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              currentTab === 'diagnostic'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">30문항</span> 진단평가
          </button>

          <button
            onClick={() => {
              if (diagnosticResult) onSelectTab('report');
            }}
            disabled={!diagnosticResult}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              currentTab === 'report'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            5단계 분석
          </button>

          <button
            onClick={() => onSelectTab('practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              currentTab === 'practice'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            맞춤형 문제 (20~100제)
          </button>

          <button
            onClick={() => onSelectTab('mollier')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              currentTab === 'mollier'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            P-h 선도
          </button>
        </nav>

        {/* Right side: Student Profile, Cycle & Level, Theme Toggle, Study docs */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle (Eye-Comfort Light vs Soft Dark) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title={theme === 'light' ? '차분한 다크 모드로 전환' : '편안한 라이트 모드로 전환'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          )}

          {/* Student Profile Switcher Chip */}
          <button
            onClick={onOpenStudentModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold transition cursor-pointer text-slate-800 dark:text-slate-200"
            title={
              currentStudent
                ? `${currentStudent.name} (${currentStudent.studentId})${
                    currentStudent.email ? ` · 이메일: ${currentStudent.email} (인증됨)` : ''
                  }`
                : '학생 정보 확인 / 다른 학생으로 전환'
            }
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] relative">
              {currentStudent ? currentStudent.name.slice(0, 1) : <User className="w-3.5 h-3.5" />}
              {currentStudent && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" title="학생 계정 활성" />
              )}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <span className="text-slate-900 dark:text-white block font-bold text-xs truncate max-w-[90px]">
                {currentStudent?.name || '학생 등록'}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono block">
                {currentStudent?.studentId || '학번 입력'}
              </span>
            </div>
            <Users className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Continuous Cycle Badge */}
          <button
            onClick={onOpenGrowthModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-blue-200 dark:border-slate-700 text-xs font-bold text-blue-800 dark:text-slate-300 transition cursor-pointer"
            title="나의 연속 성장 여정 및 이력 보기"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span className="font-mono text-blue-700 dark:text-blue-400 font-extrabold">{currentCycle}회차</span>
            <span className="hidden xl:inline text-slate-500 dark:text-slate-400 font-normal">성장 여정</span>
          </button>

          {levelInfo && (
            <div
              onClick={() => onSelectTab('report')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold cursor-pointer transition hover:opacity-90 ${levelInfo.badgeBg}`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{levelInfo.shortName}</span>
            </div>
          )}

          <button
            onClick={onOpenStudyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="교육과정 성취기준표 및 핵심 공식 핸드북"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">공식집</span>
          </button>
        </div>
      </div>
    </header>
  );
};


