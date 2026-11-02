import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DiagnosticTest } from './components/DiagnosticTest';
import { LevelAnalysisReport } from './components/LevelAnalysisReport';
import { PracticeStudio } from './components/PracticeStudio';
import { MollierSimulator } from './components/MollierSimulator';
import { StudyMaterialsModal } from './components/StudyMaterialsModal';
import { GrowthJourneyModal } from './components/GrowthJourneyModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import {
  DiagnosticResult,
  ACHIEVEMENT_LEVELS,
  CycleGrowthItem,
  StudentProfile,
} from './types/hvac';
import {
  Snowflake,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  BarChart2,
  TrendingUp,
  User,
  Users,
  LogOut,
  Lock,
} from 'lucide-react';

const STORAGE_KEY_REGISTERED_ACCOUNTS = 'hvac_registered_accounts';
const STORAGE_KEY_ACTIVE_USER_ID = 'hvac_active_user_id';

export default function App() {
  // Navigation & UI States
  const [currentTab, setCurrentTab] = useState<'diagnostic' | 'report' | 'practice' | 'mollier'>('diagnostic');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('hvac_theme');
      return saved === 'dark' || saved === 'light' ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('hvac_theme', theme);
    } catch (e) {
      console.warn('Failed to persist theme', e);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const [isStudyModalOpen, setIsStudyModalOpen] = useState<boolean>(false);
  const [isGrowthModalOpen, setIsGrowthModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState<boolean>(false);
  const [cycleNotice, setCycleNotice] = useState<string>('');

  // Student Account Management (User ID uniquely identifies each student across academic years)
  const [registeredAccounts, setRegisteredAccounts] = useState<StudentProfile[]>([]);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);

  // Student Specific Learning States
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [previousDiagnosticResult, setPreviousDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [cycleHistory, setCycleHistory] = useState<CycleGrowthItem[]>([]);
  const [practiceConfig, setPracticeConfig] = useState<{
    cycle?: number;
    targetLevel: number;
    count: number;
    domainFilter?: string;
    focusWeakness: boolean;
  }>({
    cycle: 1,
    targetLevel: 3,
    count: 50,
    domainFilter: 'all',
    focusWeakness: false,
  });

  // 1. Initial Load: Retrieve Accounts and Active Session
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REGISTERED_ACCOUNTS);
      let parsedAccounts: StudentProfile[] = [];
      if (stored) {
        parsedAccounts = JSON.parse(stored);
        setRegisteredAccounts(parsedAccounts);
      } else {
        // Seed default demo student so teachers/evaluators can test with 1-click
        const seedStudent: StudentProfile = {
          userId: 'demo_student',
          password: 'password123',
          name: '홍길동',
          studentId: '30115',
          phone: '010-1234-5678',
          email: 'demo_student@hvac-school.kr',
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString(),
          department: '공조냉동기계과',
          gradeClass: '3학년 1반',
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
        parsedAccounts = [seedStudent];
        setRegisteredAccounts(parsedAccounts);
        localStorage.setItem(STORAGE_KEY_REGISTERED_ACCOUNTS, JSON.stringify(parsedAccounts));
      }

      const activeUserId = localStorage.getItem(STORAGE_KEY_ACTIVE_USER_ID);
      if (activeUserId && parsedAccounts.length > 0) {
        const found = parsedAccounts.find((s) => s.userId.toLowerCase() === activeUserId.toLowerCase());
        if (found) {
          setCurrentStudent(found);
          loadUserData(found.userId);
          return;
        }
      }

      // If no active user session, open auth modal
      setIsAuthModalOpen(true);
    } catch (e) {
      console.warn('Failed to load initial account data', e);
      setIsAuthModalOpen(true);
    }
  }, []);

  // Helper: Load student-specific data from localStorage keyed by userId
  const loadUserData = (userId: string) => {
    try {
      const rawData = localStorage.getItem(`hvac_user_${userId}`);
      if (rawData) {
        const data = JSON.parse(rawData);
        setCurrentCycle(data.currentCycle || 1);
        setDiagnosticResult(data.diagnosticResult || null);
        setPreviousDiagnosticResult(data.previousDiagnosticResult || null);
        setCycleHistory(data.cycleHistory || []);
        if (data.practiceConfig) {
          setPracticeConfig(data.practiceConfig);
        }
        if (data.diagnosticResult) {
          setCurrentTab('report');
        } else {
          setCurrentTab('diagnostic');
        }
      } else {
        // Reset to initial clean state for fresh account
        setCurrentCycle(1);
        setDiagnosticResult(null);
        setPreviousDiagnosticResult(null);
        setCycleHistory([]);
        setPracticeConfig({
          cycle: 1,
          targetLevel: 3,
          count: 50,
          domainFilter: 'all',
          focusWeakness: false,
        });
        setCurrentTab('diagnostic');
      }
    } catch (e) {
      console.warn('Error loading user data', e);
    }
  };

  // Helper: Save current user state
  const saveCurrentUserData = (
    userId: string,
    stateToSave: {
      currentCycle: number;
      diagnosticResult: DiagnosticResult | null;
      previousDiagnosticResult: DiagnosticResult | null;
      cycleHistory: CycleGrowthItem[];
      practiceConfig: any;
    }
  ) => {
    try {
      localStorage.setItem(`hvac_user_${userId}`, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Error saving user data', e);
    }
  };

  // Handle Login or Registration Success
  const handleLoginSuccess = (profile: StudentProfile) => {
    // 1. Update registered accounts list
    const existingIndex = registeredAccounts.findIndex(
      (acc) => acc.userId.toLowerCase() === profile.userId.toLowerCase()
    );
    let updatedAccounts = [...registeredAccounts];

    if (existingIndex >= 0) {
      updatedAccounts[existingIndex] = profile;
    } else {
      updatedAccounts.unshift(profile);
    }

    setRegisteredAccounts(updatedAccounts);
    try {
      localStorage.setItem(STORAGE_KEY_REGISTERED_ACCOUNTS, JSON.stringify(updatedAccounts));
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER_ID, profile.userId);
    } catch (e) {}

    // 2. Set current student session and load isolated data
    setCurrentStudent(profile);
    loadUserData(profile.userId);
    setIsAuthModalOpen(false);

    setCycleNotice(`환영합니다, ${profile.name} (${profile.studentId}) 학생! 로그인되었습니다.`);
    setTimeout(() => setCycleNotice(''), 4500);
  };

  // Handle Logout
  const handleLogout = () => {
    if (currentStudent) {
      saveCurrentUserData(currentStudent.userId, {
        currentCycle,
        diagnosticResult,
        previousDiagnosticResult,
        cycleHistory,
        practiceConfig,
      });
    }
    setCurrentStudent(null);
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER_ID);
    } catch (e) {}
    setIsAuthModalOpen(true);
  };

  // Handle Deleting an Account from this device
  const handleDeleteAccount = (userIdToDelete: string) => {
    const updatedAccounts = registeredAccounts.filter((a) => a.userId !== userIdToDelete);
    setRegisteredAccounts(updatedAccounts);
    try {
      localStorage.setItem(STORAGE_KEY_REGISTERED_ACCOUNTS, JSON.stringify(updatedAccounts));
      localStorage.removeItem(`hvac_user_${userIdToDelete}`);
    } catch (e) {}

    if (currentStudent?.userId === userIdToDelete) {
      if (updatedAccounts.length > 0) {
        handleLoginSuccess(updatedAccounts[0]);
      } else {
        handleLogout();
      }
    }
  };

  // Diagnostic Test Completion
  const handleDiagnosticComplete = (result: DiagnosticResult) => {
    const enrichedResult: DiagnosticResult = {
      ...result,
      userId: currentStudent?.userId,
      studentId: currentStudent?.studentId,
      studentName: currentStudent?.name,
    };

    setDiagnosticResult(enrichedResult);

    const recCount = ACHIEVEMENT_LEVELS[enrichedResult.level].recommendedQuestions;
    const newConfig = {
      cycle: currentCycle,
      targetLevel: enrichedResult.level,
      count: recCount,
      domainFilter: 'all',
      focusWeakness: false,
    };
    setPracticeConfig(newConfig);

    if (currentStudent) {
      saveCurrentUserData(currentStudent.userId, {
        currentCycle,
        diagnosticResult: enrichedResult,
        previousDiagnosticResult,
        cycleHistory,
        practiceConfig: newConfig,
      });
    }

    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch Practice
  const handleStartPractice = (config: {
    targetLevel: number;
    count: number;
    domainFilter?: string;
    focusWeakness: boolean;
  }) => {
    const fullConfig = {
      ...config,
      cycle: currentCycle,
    };
    setPracticeConfig(fullConfig);

    if (currentStudent) {
      saveCurrentUserData(currentStudent.userId, {
        currentCycle,
        diagnosticResult,
        previousDiagnosticResult,
        cycleHistory,
        practiceConfig: fullConfig,
      });
    }

    setCurrentTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Next Cycle Diagnostic Trigger
  const handleStartNextCycleDiagnostic = (stats: {
    cycle: number;
    targetLevel: number;
    totalQuestions: number;
    correctCount: number;
    scorePercent: number;
  }) => {
    const historyItem: CycleGrowthItem = {
      cycle: stats.cycle,
      diagnosticDate: diagnosticResult?.completedAt || new Date().toLocaleDateString('ko-KR'),
      diagnosticScore: diagnosticResult?.totalScore || 0,
      diagnosticPercentage: diagnosticResult?.percentage || 0,
      level: stats.targetLevel,
      practiceQuestionsSolved: stats.totalQuestions,
      practiceScorePercent: stats.scorePercent,
      completedAt: new Date().toLocaleString('ko-KR'),
    };

    const nextHistory = [...cycleHistory, historyItem];
    setCycleHistory(nextHistory);

    const prevResult = diagnosticResult;
    setPreviousDiagnosticResult(prevResult);

    const nextCycle = stats.cycle + 1;
    setCurrentCycle(nextCycle);
    setDiagnosticResult(null);

    if (currentStudent) {
      saveCurrentUserData(currentStudent.userId, {
        currentCycle: nextCycle,
        diagnosticResult: null,
        previousDiagnosticResult: prevResult,
        cycleHistory: nextHistory,
        practiceConfig,
      });
    }

    setCurrentTab('diagnostic');
    setCycleNotice(
      `🚀 ${currentStudent ? currentStudent.name : '학생'}님의 제${nextCycle}차 레벨업 진단평가가 시작되었습니다! 새로운 30문항으로 발전된 실력을 확인하세요.`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setCycleNotice('');
    }, 8000);
  };

  const handleRetakeDiagnostic = () => {
    setIsRetakeModalOpen(true);
  };

  const confirmRetakeDiagnostic = () => {
    setIsRetakeModalOpen(false);
    setDiagnosticResult(null);
    if (currentStudent) {
      saveCurrentUserData(currentStudent.userId, {
        currentCycle,
        diagnosticResult: null,
        previousDiagnosticResult,
        cycleHistory,
        practiceConfig,
      });
    }
    setCurrentTab('diagnostic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        diagnosticResult={diagnosticResult}
        currentCycle={currentCycle}
        currentStudent={currentStudent}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenStudyModal={() => setIsStudyModalOpen(true)}
        onOpenGrowthModal={() => setIsGrowthModalOpen(true)}
        onOpenStudentModal={() => setIsAuthModalOpen(true)}
      />

      {/* Cycle / Login Notice Toast */}
      {cycleNotice && (
        <div className="max-w-7xl mx-auto w-full px-4 pt-4">
          <div className="p-4 bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-sm flex items-center justify-between text-xs sm:text-sm text-blue-900 dark:text-blue-200 animate-fadeIn">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="font-semibold">{cycleNotice}</span>
            </div>
            <button
              onClick={() => setCycleNotice('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 py-1 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome / Overview Hero */}
        {currentTab === 'diagnostic' && !diagnosticResult && (
          <div className="mb-8 relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 특성화고·마이스터고 냉동공조과 전용 AI 코스웨어
                  </div>
                  {currentStudent && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 text-xs font-semibold">
                      <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{currentStudent.name} (아이디: {currentStudent.userId})</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">· 학번 {currentStudent.studentId}</span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentCycle === 1
                    ? `${currentStudent ? currentStudent.name + ' 학생,' : ''} 30문항 진단평가로 5단계 성취수준을 확인하세요`
                    : `제${currentCycle}차 레벨업 재진단평가로 성장한 실력을 검증하세요`}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {currentCycle === 1
                    ? '2022 개정 직업계고 전문교과 [냉동 공조 설계] & [냉동 공조 유지 보수 관리] 표준 성취기준 기반 30문항 진단평가를 거쳐 학생의 성취수준을 5단계로 정밀 분석하고, 수준에 맞춘 20~100개의 맞춤형 문제를 자동으로 생성합니다.'
                    : `이전 학습을 마친 학생의 실력 향상을 재측정하기 위한 새로운 30문항 진단평가입니다. 진단 후 한 단계 더 높아진 성취수준에 맞추어 다음 맞춤형 문제 세트가 즉시 제공됩니다.`}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 제{currentCycle}차 신규 30문항
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 5단계 성취수준 분석 & 레벨업
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 수준별 20~100제 자동 순환
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" /> 고유 아이디별 개별 포트폴리오
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 로그인 / 계정 전환
                </button>
                <button
                  onClick={() => setIsGrowthModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" /> 나의 성장 여정 보기 ({currentCycle}회차)
                </button>
                <button
                  onClick={() => setIsStudyModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 필수 공식집 보기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Diagnostic 30-Questions Test */}
        {currentTab === 'diagnostic' && (
          <DiagnosticTest
            cycle={currentCycle}
            previousResult={previousDiagnosticResult}
            onComplete={handleDiagnosticComplete}
          />
        )}

        {/* Tab 2: 5-Level Analysis Report */}
        {currentTab === 'report' && diagnosticResult && (
          <LevelAnalysisReport
            result={diagnosticResult}
            student={currentStudent}
            onStartPractice={handleStartPractice}
            onRetakeDiagnostic={handleRetakeDiagnostic}
          />
        )}

        {/* Tab 3: Level-Tailored 20~100 Problem Practice Studio */}
        {currentTab === 'practice' && (
          <PracticeStudio
            initialConfig={practiceConfig}
            onReturnToReport={() => {
              if (diagnosticResult) setCurrentTab('report');
              else setCurrentTab('diagnostic');
            }}
            onOpenMollier={() => setCurrentTab('mollier')}
            onStartNextCycleDiagnostic={handleStartNextCycleDiagnostic}
          />
        )}

        {/* Tab 4: Interactive P-h Mollier Simulator */}
        {currentTab === 'mollier' && (
          <div className="space-y-6">
            <MollierSimulator />
          </div>
        )}
      </main>

      {/* Student Authentication Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={currentStudent ? () => setIsAuthModalOpen(false) : undefined}
        onLoginSuccess={handleLoginSuccess}
        currentStudent={currentStudent}
        registeredAccounts={registeredAccounts}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Growth Journey Modal */}
      <GrowthJourneyModal
        isOpen={isGrowthModalOpen}
        onClose={() => setIsGrowthModalOpen(false)}
        currentCycle={currentCycle}
        currentLevel={diagnosticResult?.level || previousDiagnosticResult?.level || 1}
        history={cycleHistory}
        student={currentStudent}
      />

      {/* Study Materials & Formulas Modal */}
      <StudyMaterialsModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
      />

      {/* Retake Diagnostic Confirmation Modal */}
      {isRetakeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">진단평가 재응시 확인</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">30문항 진단평가 기록 초기화</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              기존 진단평가 성취도 및 분석 결과를 초기화하고, 30문제 진단평가를 처음부터 다시 시작하시겠습니까?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsRetakeModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmRetakeDiagnostic}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              >
                재응시 시작하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Snowflake className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">HVAC-R AI 에듀테크 코스웨어 플랫폼</span>
          </div>
          <div>
            고등학교 공조냉동기계과 / 냉동공조설비과 교육과정 및 공조냉동기계기능사 기준
          </div>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            {currentStudent ? (
              <button
                onClick={handleLogout}
                className="hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center gap-1 cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer font-medium"
              >
                로그인 / 가입
              </button>
            )}
            <button
              onClick={() => setIsGrowthModalOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer font-medium"
            >
              성장 여정
            </button>
            <button
              onClick={() => setIsStudyModalOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer font-medium"
            >
              공식집
            </button>
            <button
              onClick={() => setCurrentTab('mollier')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer font-medium"
            >
              몰리에르 선도
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
