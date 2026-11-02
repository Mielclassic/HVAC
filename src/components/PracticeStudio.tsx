import React, { useState, useEffect } from 'react';
import { Question, ACHIEVEMENT_LEVELS, HVACDomain } from '../types/hvac';
import { generateQuestionPool } from '../data/problemBank';
import { PhDiagramCard } from './PhDiagramCard';
import { CotStepsExplanation } from './CotStepsExplanation';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  MessageSquare,
  Send,
  Calculator,
  Bookmark,
  Layers,
  HelpCircle,
  Sliders,
  Check,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticeStudioProps {
  initialConfig: {
    cycle?: number;
    targetLevel: number;
    count: number;
    domainFilter?: string;
    focusWeakness: boolean;
  };
  onReturnToReport: () => void;
  onOpenMollier: () => void;
  onStartNextCycleDiagnostic: (stats: {
    cycle: number;
    targetLevel: number;
    totalQuestions: number;
    correctCount: number;
    scorePercent: number;
  }) => void;
}

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  initialConfig,
  onReturnToReport,
  onOpenMollier,
  onStartNextCycleDiagnostic,
}) => {
  const currentCycle = initialConfig.cycle || 1;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [isCompletionScreenOpen, setIsCompletionScreenOpen] = useState<boolean>(false);

  // Practice Modes: 'study' (instant feedback) vs 'exam' (feedback after submission)
  const [mode, setMode] = useState<'study' | 'exam'>('study');
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);

  // AI Tutor Drawer & Chat
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [tutorQuery, setTutorQuery] = useState<string>('');
  const [tutorReplies, setTutorReplies] = useState<Array<{ sender: 'user' | 'tutor'; text: string }>>([]);
  const [isTutorLoading, setIsTutorLoading] = useState<boolean>(false);

  // Scratchpad / Mini HVAC Calculator
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calcM, setCalcM] = useState<string>('50');
  const [calcC, setCalcC] = useState<string>('1.0');
  const [calcDt, setCalcDt] = useState<string>('30');
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // Dynamic AI Questions Generator
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiGenMessage, setAiGenMessage] = useState<string>('');

  const levelInfo = ACHIEVEMENT_LEVELS[initialConfig.targetLevel];

  // Initialize Questions on mount
  useEffect(() => {
    const generated = generateQuestionPool(
      initialConfig.targetLevel,
      initialConfig.count,
      initialConfig.domainFilter
    );
    setQuestions(generated);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsExamSubmitted(false);
  }, [initialConfig]);

  const currentQ = questions[currentIndex];
  const totalCount = questions.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (idx: number) => {
    if (mode === 'exam' && isExamSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ?.id]: idx,
    }));
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // AI Question Generation via Server Endpoint
  const handleGenerateMoreAiQuestions = async () => {
    setIsGeneratingAi(true);
    setAiGenMessage('Gemini AI가 냉동공조 고교 맞춤형 문항을 생성 중입니다...');
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: initialConfig.targetLevel,
          domain: initialConfig.domainFilter || 'all',
          count: 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions((prev) => [...prev, ...data.questions]);
          setAiGenMessage(`성공! Gemini가 새로운 ${data.questions.length}문제를 추가했습니다.`);
        } else {
          setAiGenMessage('추가 문제 생성 완료 (로컬 은행 확장 적용)');
        }
      } else {
        // Fallback local addition
        const moreLocal = generateQuestionPool(
          initialConfig.targetLevel,
          questions.length + 5,
          initialConfig.domainFilter
        );
        setQuestions(moreLocal);
        setAiGenMessage('로컬 문제 은행에서 5문제가 추가되었습니다.');
      }
    } catch (e) {
      setAiGenMessage('로컬 문제 은행에서 5문제가 추가되었습니다.');
      const moreLocal = generateQuestionPool(
        initialConfig.targetLevel,
        questions.length + 5,
        initialConfig.domainFilter
      );
      setQuestions(moreLocal);
    } finally {
      setIsGeneratingAi(false);
      setTimeout(() => setAiGenMessage(''), 4000);
    }
  };

  // Ask AI Tutor
  const handleAskTutor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tutorQuery.trim()) return;

    const userMsg = tutorQuery.trim();
    setTutorReplies((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setTutorQuery('');
    setIsTutorLoading(true);

    try {
      const res = await fetch('/api/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionContext: currentQ,
          userQuestion: userMsg,
          studentLevel: levelInfo.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTutorReplies((prev) => [
          ...prev,
          { sender: 'tutor', text: data.reply || '답변을 불러오지 못했습니다.' },
        ]);
      } else {
        setTutorReplies((prev) => [
          ...prev,
          {
            sender: 'tutor',
            text: `[학습 팁] 현재 문제는 ${currentQ.domain} 영역입니다.\n핵심 원리: ${currentQ.explanation}\n참고 공식: ${currentQ.formula || '기본 이론'}`,
          },
        ]);
      }
    } catch (err) {
      setTutorReplies((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: `[학습 팁] 질문하신 내용과 관련된 핵심 해설:\n${currentQ.explanation}`,
        },
      ]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  // Scratchpad calculator calculation: Q = m * c * deltaT
  const handleCalculateHeat = () => {
    const m = parseFloat(calcM) || 0;
    const c = parseFloat(calcC) || 0;
    const dt = parseFloat(calcDt) || 0;
    setCalcResult(m * c * dt);
  };

  // Final Score calculation
  const totalCorrect = questions.filter((q) => userAnswers[q.id] === q.answerIndex).length;
  const scorePercent = totalCount > 0 ? Math.round((totalCorrect / totalCount) * 100) : 0;

  const handleFinishExam = () => {
    setIsExamSubmitted(true);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
  };

  if (!currentQ) {
    return (
      <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
        <h3 className="text-xl font-bold text-white">문제를 준비하는 중입니다...</h3>
        <button
          onClick={onReturnToReport}
          className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl"
        >
          리포트로 돌아가기
        </button>
      </div>
    );
  }

  const isCurrentAnswered = userAnswers[currentQ.id] !== undefined;
  const isCurrentCorrect = userAnswers[currentQ.id] === currentQ.answerIndex;
  const showFeedback = mode === 'study' ? isCurrentAnswered : isExamSubmitted;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToReport}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="분석 리포트로 돌아가기"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${levelInfo.badgeBg}`}>
                {levelInfo.shortName} 맞춤형
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {initialConfig.domainFilter && initialConfig.domainFilter !== 'all'
                  ? `${initialConfig.domainFilter} 집중`
                  : '전 영역 균형'}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              맞춤형 실전 학습 코스웨어 ({totalCount}문항 세트)
            </h1>
          </div>
        </div>

        {/* Action Tools: Mode Switcher + Calculator + AI Question Generator */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setMode('study')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                mode === 'study' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              학습 모드 (즉시 채점)
            </button>
            <button
              onClick={() => setMode('exam')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                mode === 'exam' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              시험 모드 (일괄 채점)
            </button>
          </div>

          {/* Mollier Simulator Quick Open */}
          <button
            onClick={onOpenMollier}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-blue-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-blue-400 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" /> P-h 선도 열기
          </button>

          {/* Scratchpad Calculator */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              showCalculator
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700'
                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="공식 계산기 및 스크래치패드"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* AI Generator Button */}
          <button
            onClick={handleGenerateMoreAiQuestions}
            disabled={isGeneratingAi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
            {isGeneratingAi ? 'AI 생성 중...' : '+5문제 추가 생성'}
          </button>
        </div>
      </div>

      {aiGenMessage && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 rounded-xl text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          {aiGenMessage}
        </div>
      )}

      {showCalculator && (
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> 냉동공조 열량 공식 계산기 (Q = m · c · ΔT)
            </span>
            <span className="text-slate-500 font-mono text-[11px]">단위: kcal, kg, ℃</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">질량 m (kg)</label>
              <input
                type="number"
                value={calcM}
                onChange={(e) => setCalcM(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">비열 c (kcal/kg·℃)</label>
              <input
                type="number"
                step="0.1"
                value={calcC}
                onChange={(e) => setCalcC(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">온도차 ΔT (℃)</label>
              <input
                type="number"
                value={calcDt}
                onChange={(e) => setCalcDt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCalculateHeat}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition cursor-pointer"
              >
                열량 Q 계산
              </button>
            </div>
          </div>

          {calcResult !== null && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">계산된 열량 Q =</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold text-base">
                {calcResult.toLocaleString()} kcal{' '}
                <span className="text-slate-500 text-xs">
                  (약 {(calcResult / 3024).toFixed(2)} USRT / {(calcResult / 860).toFixed(2)} kW)
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Problem Display (8 cols) + Navigator & AI Tutor (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Problem Section (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Header info */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 flex items-center justify-center font-black text-sm">
                #{currentIndex + 1}
              </span>
              {currentQ.subject && (
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                  currentQ.subject === '냉동 공조 일반'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                    : currentQ.subject === '냉동 공조 설계'
                    ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                }`}>
                  {currentQ.subject}
                </span>
              )}
              {currentQ.standardCode && (
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800" title={currentQ.standardName || '성취기준'}>
                  {currentQ.standardCode}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                {currentQ.domain}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                난이도: Level {currentQ.level}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTutorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800 text-xs font-bold transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" /> AI 튜터에게 질문
              </button>

              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                  bookmarked.has(currentQ.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/50 dark:border-amber-700 dark:text-amber-300'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="북마크"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Body */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* P-h Mollier Diagram (Dynamic SVG Rendering) */}
            {(currentQ.cycleData || currentQ.diagramType === 'mollier') && (
              <PhDiagramCard
                cycleData={currentQ.cycleData}
                title="P-h 몰리에르 선도 (공학적 상태점 검증 완료)"
              />
            )}

            {currentQ.diagramType && !currentQ.cycleData && currentQ.diagramType !== 'mollier' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {currentQ.concept}
                </span>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, oIndex) => {
              const isSelected = userAnswers[currentQ.id] === oIndex;
              const isTheAnswer = currentQ.answerIndex === oIndex;

              let btnClass = 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200';
              if (showFeedback) {
                if (isTheAnswer) {
                  btnClass = 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-100 font-bold';
                } else if (isSelected && !isTheAnswer) {
                  btnClass = 'bg-rose-50 border-2 border-rose-600 text-rose-950 dark:bg-rose-950/40 dark:border-rose-500 dark:text-rose-100';
                }
              } else if (isSelected) {
                btnClass = 'bg-blue-50 border-2 border-blue-600 text-blue-950 dark:bg-blue-950/50 dark:border-blue-400 dark:text-white shadow-xs font-semibold';
              }

              return (
                <button
                  key={oIndex}
                  onClick={() => handleSelectOption(oIndex)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 cursor-pointer ${btnClass}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {['①', '②', '③', '④'][oIndex]}
                  </span>
                  <span className="text-sm md:text-base leading-relaxed">{opt}</span>
                  {showFeedback && isTheAnswer && (
                    <span className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" /> 정답
                    </span>
                  )}
                  {showFeedback && isSelected && !isTheAnswer && (
                    <span className="ml-auto flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400">
                      <XCircle className="w-4 h-4" /> 오답
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Explanation Card */}
          {showFeedback && (
            <div
              className={`p-5 rounded-2xl border space-y-3 animate-fadeIn ${
                isCurrentCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-500/30 dark:text-emerald-200'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950 dark:bg-rose-950/20 dark:border-rose-500/30 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCurrentCorrect ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">정답입니다!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span className="text-rose-700 dark:text-rose-400 font-bold">
                        오답입니다. (정답: {['①', '②', '③', '④'][currentQ.answerIndex]})
                      </span>
                    </>
                  )}
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                  핵심: {currentQ.concept}
                </span>
              </div>

              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>

              {currentQ.formula && (
                <div className="p-2.5 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-amber-800 dark:text-amber-300">
                  <strong className="text-slate-500 font-sans">핵심 공식: </strong> {currentQ.formula}
                </div>
              )}

              {currentQ.practicalTip && (
                <div className="text-xs text-blue-700 dark:text-blue-300 font-medium pt-1 flex items-start gap-1.5">
                  <span className="font-bold flex-shrink-0">💡 실무/기능사 Tip:</span>
                  <span>{currentQ.practicalTip}</span>
                </div>
              )}

              {/* 4-Step Chain-of-Thought (CoT) Calculation Breakdown */}
              {currentQ.cotSteps && currentQ.cotSteps.length > 0 && (
                <div className="pt-2">
                  <CotStepsExplanation steps={currentQ.cotSteps} />
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> 이전 문제
            </button>

            <span className="text-xs text-slate-500 font-mono">
              문제 {currentIndex + 1} / {totalCount}
            </span>

            {currentIndex < totalCount - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
              >
                다음 문제 <ArrowRight className="w-4 h-4" />
              </button>
            ) : mode === 'exam' && !isExamSubmitted ? (
              <button
                onClick={handleFinishExam}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
              >
                시험 채점 및 제출 <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  try {
                    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
                  } catch (e) {}
                  setIsCompletionScreenOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
              >
                맞춤형 학습 완료 & 다음 단계 진단 <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar: Question Matrix & Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Score Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 pb-2">
              <span>제{currentCycle}차 학습 진행 현황</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {answeredCount} / {totalCount} 완료
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">정답률 (학습 기준)</span>
                <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                  {answeredCount > 0
                    ? Math.round(
                        (questions.filter((q) => userAnswers[q.id] === q.answerIndex).length /
                          answeredCount) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">검토 표시</span>
                <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-400">
                  {bookmarked.size}개
                </span>
              </div>
            </div>

            {/* Quick Finish Button if at least half questions answered */}
            {answeredCount >= 5 && (
              <button
                onClick={() => {
                  try {
                    confetti({ particleCount: 80, spread: 60 });
                  } catch (e) {}
                  setIsCompletionScreenOpen(true);
                }}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" /> 학습 완료 및 레벨업 진단평가 보기
              </button>
            )}

            {/* Matrix of problem buttons */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                문제 바로가기:
              </span>
              <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-1.5 max-h-56 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAns = userAnswers[q.id] !== undefined;
                  const isCor = userAnswers[q.id] === q.answerIndex;
                  const isMarked = bookmarked.has(q.id);

                  let bg = 'bg-white text-slate-500 border border-slate-200 dark:bg-slate-950 dark:text-slate-500 dark:border-slate-800 hover:border-slate-300';
                  if (isCurrent) {
                    bg = 'ring-2 ring-blue-600 bg-blue-50 text-blue-800 font-bold dark:bg-blue-950 dark:text-white shadow-xs';
                  } else if (showFeedback) {
                    bg = isCor
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : isAns
                      ? 'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                      : 'bg-white text-slate-400 border border-slate-200 dark:bg-slate-950 dark:text-slate-600 dark:border-slate-800';
                  } else if (isAns) {
                    bg = 'bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-8 rounded-lg text-xs font-mono font-bold relative transition flex items-center justify-center cursor-pointer ${bg}`}
                    >
                      {idx + 1}
                      {isMarked && (
                        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI HVAC Tutor Card */}
          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI 냉동공조 전담 튜터 '쿨쌤'</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">문제를 풀다 막힐 때 언제든 질문하세요.</p>
              </div>
            </div>

            <form onSubmit={handleAskTutor} className="space-y-2">
              <input
                type="text"
                placeholder="예: 과냉각을 취하면 왜 효율이 좋아지나요?"
                value={tutorQuery}
                onChange={(e) => setTutorQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isTutorLoading || !tutorQuery.trim()}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3 h-3" />
                {isTutorLoading ? '답변 생성 중...' : '질문 전송'}
              </button>
            </form>

            {/* Recent reply box */}
            {tutorReplies.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto space-y-2 text-xs">
                {tutorReplies.slice(-3).map((r, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl ${
                      r.sender === 'user'
                        ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 ml-4'
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-950 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-200 mr-2 whitespace-pre-line'
                    }`}
                  >
                    <span className="font-bold text-[10px] block text-slate-500 dark:text-slate-400 mb-0.5">
                      {r.sender === 'user' ? '나의 질문' : '쿨쌤 답변:'}
                    </span>
                    {r.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion & Next Cycle Diagnostic Modal */}
      {isCompletionScreenOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> 제{currentCycle}차 맞춤형 학습 완주
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                축하합니다! {totalCount}문제를 완료했습니다
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                수준별 맞춤 훈련을 성실히 이수하여 문제 해결력과 냉동공조 공학 이론이 크게 향상되었습니다.
              </p>
            </div>

            {/* Score & Growth Summary */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">학습 문항수</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                  {totalCount}
                  <span className="text-xs text-slate-500 font-normal">제</span>
                </span>
              </div>
              <div className="border-x border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">맞힌 문항</span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block">
                  {totalCorrect}
                  <span className="text-xs text-slate-500 font-normal">개</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">최종 정답률</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5 block">
                  {scorePercent}%
                </span>
              </div>
            </div>

            {/* Next Step Callout */}
            <div className="p-4 bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 rounded-2xl space-y-1.5 text-xs text-blue-900 dark:text-blue-200">
              <div className="font-bold flex items-center gap-1.5 text-blue-800 dark:text-blue-300 text-sm">
                <TrendingUp className="w-4 h-4" /> 다음 단계: 제{currentCycle + 1}차 레벨업 진단평가
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                맞춤형 학습을 마친 학생은 새로운 30문항 진단평가를 통해{' '}
                <strong className="text-slate-900 dark:text-white">성취수준 향상(레벨업)</strong>을 재측정받고, 그에 맞춘 차기 맞춤형 문제를 계속 학습할 수 있습니다.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setIsCompletionScreenOpen(false);
                  onStartNextCycleDiagnostic({
                    cycle: currentCycle,
                    targetLevel: initialConfig.targetLevel,
                    totalQuestions: totalCount,
                    correctCount: totalCorrect,
                    scorePercent,
                  });
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm md:text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🚀 제{currentCycle + 1}차 레벨업 진단평가 시작하기 (신규 30문항)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsCompletionScreenOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  문제 검토 계속하기
                </button>
                <button
                  onClick={() => {
                    setIsCompletionScreenOpen(false);
                    onReturnToReport();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  이전 리포트 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
