import React, { useState, useEffect } from 'react';
import { getDiagnosticQuestionsForCycle } from '../data/diagnosticQuestions';
import { DiagnosticResult, HVACDomain, DOMAINS } from '../types/hvac';
import { PhDiagramCard } from './PhDiagramCard';

import {
  Clock,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Send,
  Sparkles,
  BarChart2,
  AlertCircle,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiagnosticTestProps {
  cycle?: number;
  previousResult?: DiagnosticResult | null;
  onComplete: (result: DiagnosticResult) => void;
}

export const DiagnosticTest: React.FC<DiagnosticTestProps> = ({
  cycle = 1,
  previousResult,
  onComplete,
}) => {
  const [questions, setQuestions] = useState(() => getDiagnosticQuestionsForCycle(cycle));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  useEffect(() => {
    setQuestions(getDiagnosticQuestionsForCycle(cycle));
    setCurrentIndex(0);
    setAnswers({});
    setBookmarked(new Set());
    setSecondsElapsed(0);
  }, [cycle]);

  // Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQ) * 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (index: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: index,
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

  // Quick Demo Auto-Fill: Allows instant testing of different levels
  const fillSampleAnswers = (preset: 'basic' | 'intermediate' | 'advanced') => {
    const newAnswers: Record<string, number> = {};
    questions.forEach((q, idx) => {
      if (preset === 'basic') {
        // ~35% score -> Level 1 (기초 입문)
        newAnswers[q.id] = idx % 3 === 0 ? q.answerIndex : (q.answerIndex + 1) % 4;
      } else if (preset === 'intermediate') {
        // ~67% score -> Level 3 (실무 발전)
        newAnswers[q.id] = idx % 3 !== 0 ? q.answerIndex : (q.answerIndex + 1) % 4;
      } else {
        // ~93% score -> Level 5 (전문 마스터)
        newAnswers[q.id] = idx === 3 || idx === 18 ? (q.answerIndex + 1) % 4 : q.answerIndex;
      }
    });
    setAnswers(newAnswers);
  };

  const calculateResults = () => {
    let totalScore = 0;
    const domainScores: Record<
      HVACDomain,
      { domain: HVACDomain; correct: number; total: number; percentage: number }
    > = {} as any;
    DOMAINS.forEach((domain) => {
      domainScores[domain] = { domain, correct: 0, total: 0, percentage: 0 };
    });

    let generalCorrect = 0;
    let generalTotal = 0;
    let designCorrect = 0;
    let designTotal = 0;
    let maintCorrect = 0;
    let maintTotal = 0;

    questions.forEach((q) => {
      const isCorrect = answers[q.id] === q.answerIndex;
      if (isCorrect) totalScore++;

      if (domainScores[q.domain]) {
        domainScores[q.domain].total++;
        if (isCorrect) domainScores[q.domain].correct++;
      }

      if (q.subject === '냉동 공조 일반') {
        generalTotal++;
        if (isCorrect) generalCorrect++;
      } else if (q.subject === '냉동 공조 설계') {
        designTotal++;
        if (isCorrect) designCorrect++;
      } else {
        maintTotal++;
        if (isCorrect) maintCorrect++;
      }
    });

    // Compute percentages
    DOMAINS.forEach((domain) => {
      const d = domainScores[domain];
      d.percentage = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
    });

    const percentage = Math.round((totalScore / totalQ) * 100);

    let level = 1;
    if (percentage >= 90) level = 5;
    else if (percentage >= 75) level = 4;
    else if (percentage >= 60) level = 3;
    else if (percentage >= 40) level = 2;
    else level = 1;

    // Minimum competency: 40% or higher (Level 2+) as defined in 2022 high school vocational curriculum
    const minimumCompetencyAchieved = percentage >= 40;

    // Identify strongest and weakest domains
    const sortedDomains = [...DOMAINS].sort(
      (a, b) => domainScores[a].percentage - domainScores[b].percentage
    );
    const weakestDomain = sortedDomains[0];
    const strongestDomain = sortedDomains[sortedDomains.length - 1];

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    const result: DiagnosticResult = {
      cycle,
      totalScore,
      totalQuestions: totalQ,
      percentage,
      level,
      minimumCompetencyAchieved,
      domainScores,
      subjectScores: {
        general: {
          correct: generalCorrect,
          total: generalTotal,
          percentage: generalTotal > 0 ? Math.round((generalCorrect / generalTotal) * 100) : 0,
        },
        design: {
          correct: designCorrect,
          total: designTotal,
          percentage: designTotal > 0 ? Math.round((designCorrect / designTotal) * 100) : 0,
        },
        maintenance: {
          correct: maintCorrect,
          total: maintTotal,
          percentage: maintTotal > 0 ? Math.round((maintCorrect / maintTotal) * 100) : 0,
        },
      },
      userAnswers: answers,
      completedAt: new Date().toLocaleString('ko-KR'),
      weakestDomain,
      strongestDomain,
      previousLevel: previousResult?.level,
      previousScore: previousResult?.totalScore,
      levelDelta: previousResult ? level - previousResult.level : undefined,
      scoreDelta: previousResult ? totalScore - previousResult.totalScore : undefined,
    };

    onComplete(result);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner / Progress & Timer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
              제{cycle}차 성취도 진단평가
            </span>
            {cycle > 1 && previousResult && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 이전 기록: Level {previousResult.level} ({previousResult.percentage}%)
              </span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              신규 30문항 세트 · 공조냉동기계기능사 기준
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {cycle === 1
              ? '냉동공조공학 기초역량 종합 진단평가'
              : `제${cycle}차 성취수준 성장 & 레벨업 재진단평가`}
          </h1>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Quick Demo Autofill presets */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold px-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 데모 채우기:
            </span>
            <button
              onClick={() => fillSampleAnswers('basic')}
              className="px-2 py-1 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300 font-semibold transition cursor-pointer"
            >
              1단계 (35%)
            </button>
            <button
              onClick={() => fillSampleAnswers('intermediate')}
              className="px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/60 dark:text-blue-300 font-semibold transition cursor-pointer"
            >
              3단계 (67%)
            </button>
            <button
              onClick={() => fillSampleAnswers('advanced')}
              className="px-2 py-1 rounded bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold transition cursor-pointer"
            >
              5단계 (93%)
            </button>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-mono text-sm font-bold">{formatTime(secondsElapsed)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            진단 제출 ({answeredCount}/{totalQ})
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
          <span>
            진행률: <strong className="text-slate-900 dark:text-white">{answeredCount}</strong> / {totalQ} 문제 완료
          </span>
          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/50">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Layout: Question Box + Question Grid Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question Details (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 flex items-center justify-center font-black text-sm">
                Q{currentIndex + 1}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                {currentQ.domain}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                난이도: {'★'.repeat(currentQ.level)}{'☆'.repeat(5 - currentQ.level)}
              </span>
            </div>

            <button
              onClick={() => toggleBookmark(currentQ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                bookmarked.has(currentQ.id)
                  ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/50 dark:border-amber-700 dark:text-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {bookmarked.has(currentQ.id) ? '검토 표시됨' : '나중에 검토'}
            </button>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* P-h Mollier Diagram (Dynamic SVG Rendering) */}
            {(currentQ.cycleData || currentQ.diagramType === 'mollier') && (
              <PhDiagramCard
                cycleData={currentQ.cycleData}
                title="P-h 몰리에르 선도 (상태점 검증 도식)"
              />
            )}

            {currentQ.diagramType && !currentQ.cycleData && currentQ.diagramType !== 'mollier' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-semibold">
                  <BarChart2 className="w-4 h-4" /> 참고 선도/다이어그램 관련 문제
                </span>
                <span className="text-slate-500">
                  냉동 사이클 및 기기 원리
                </span>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, oIndex) => {
              const isSelected = answers[currentQ.id] === oIndex;
              return (
                <button
                  key={oIndex}
                  onClick={() => handleSelectOption(oIndex)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-2 border-blue-600 text-blue-950 dark:bg-blue-950/50 dark:border-blue-400 dark:text-white shadow-xs font-semibold'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                  }`}
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
                </button>
              );
            })}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> 이전 문항
            </button>

            <span className="text-xs text-slate-500 font-mono">
              문항 {currentIndex + 1} / {totalQ}
            </span>

            {currentIndex < totalQ - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
              >
                다음 문항 <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
              >
                진단평가 완료 및 분석 보기 <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Palette / Navigator (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 문항 답안지 네비게이터
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {answeredCount}/{totalQ} 완료
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[q.id] !== undefined;
              const isMarked = bookmarked.has(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-10 rounded-xl text-xs font-bold relative transition flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-blue-600 bg-blue-50 text-blue-800 font-bold dark:bg-blue-950 dark:text-white shadow-xs'
                      : isAnswered
                      ? 'bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 font-semibold'
                      : 'bg-white text-slate-400 border border-slate-200 dark:bg-slate-950 dark:text-slate-600 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {idx + 1}
                  {isMarked && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:border-slate-700" />
                <span>답안 작성 완료</span>
              </div>
              <span className="font-mono text-slate-900 dark:text-white font-bold">{answeredCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                <span>미작성 문항</span>
              </div>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{totalQ - answeredCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>나중에 검토 표시</span>
              </div>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{bookmarked.size}</span>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition cursor-pointer mt-2"
          >
            결과 분석 보고서 확인하기
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">진단평가를 제출하시겠습니까?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  제출 즉시 5단계 성취수준 분석 리포트가 생성됩니다.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>총 진단 문항:</span>
                <span className="font-bold text-slate-900 dark:text-white">{totalQ} 문항</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>작성 완료:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{answeredCount} 문항</span>
              </div>
              {totalQ - answeredCount > 0 && (
                <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold">
                  <span>미작성 문항:</span>
                  <span>{totalQ - answeredCount} 문항 (오답 처리)</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                계속 풀기
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  calculateResults();
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
              >
                제출 및 분석하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
