import React, { useState, useEffect, useMemo } from 'react';
import { DiagnosticResult, ACHIEVEMENT_LEVELS, DOMAINS, HVACDomain, StudentProfile } from '../types/hvac';
import { DIAGNOSTIC_QUESTIONS, getDiagnosticQuestionsForCycle } from '../data/diagnosticQuestions';
import { PhDiagramCard } from './PhDiagramCard';
import { CotStepsExplanation } from './CotStepsExplanation';


import {
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Sliders,
  RefreshCw,
  FileText,
  Printer,
  User,
} from 'lucide-react';

interface LevelAnalysisReportProps {
  result: DiagnosticResult;
  student?: StudentProfile | null;
  onStartPractice: (config: {
    targetLevel: number;
    count: number;
    domainFilter?: string;
    focusWeakness: boolean;
  }) => void;
  onRetakeDiagnostic: () => void;
}

export const LevelAnalysisReport: React.FC<LevelAnalysisReportProps> = ({
  result,
  student,
  onStartPractice,
  onRetakeDiagnostic,
}) => {
  const levelInfo = ACHIEVEMENT_LEVELS[result.level];

  // Customized Question Generation state (20 ~ 100 questions)
  const [selectedCount, setSelectedCount] = useState<number>(levelInfo.recommendedQuestions);
  const [generationMode, setGenerationMode] = useState<'recommended' | 'weakness' | 'all' | 'custom'>('recommended');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [showAnswerReview, setShowAnswerReview] = useState<boolean>(false);
  const [filterDomainReview, setFilterDomainReview] = useState<string>('all');

  const cycleQuestions = useMemo(() => getDiagnosticQuestionsForCycle(result.cycle || 1), [result.cycle]);

  // AI Diagnostic Coaching state
  const [aiReport, setAiReport] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Request AI deep analysis on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchAiAnalysis() {
      setIsAiLoading(true);
      try {
        const cycleQuestions = getDiagnosticQuestionsForCycle(result.cycle || 1);
        const wrongList = cycleQuestions.filter(
          (q) => result.userAnswers[q.id] !== q.answerIndex
        ).map((q) => ({ id: q.id, domain: q.domain, question: q.question }));

        const res = await fetch('/api/analyze-diagnostic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalScore: result.totalScore,
            maxScore: result.totalQuestions,
            level: result.level,
            domainScores: result.domainScores,
            wrongAnswers: wrongList,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            setAiReport(data.analysis);
          }
        }
      } catch (err) {
        console.warn('AI analysis unavailable, using pedagogical fallback rule engine.');
      } finally {
        if (isMounted) setIsAiLoading(false);
      }
    }
    fetchAiAnalysis();
    return () => {
      isMounted = false;
    };
  }, [result]);

  const handleLaunchPractice = () => {
    onStartPractice({
      targetLevel: result.level,
      count: selectedCount,
      domainFilter: generationMode === 'weakness' ? result.weakestDomain : selectedDomain,
      focusWeakness: generationMode === 'weakness',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Banner: Level Badge & Overall Score */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 text-xs font-semibold">
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 제{result.cycle || 1}차 30문항 진단평가 결과 분석 리포트
              </div>

              {student && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 text-xs font-semibold">
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{student.name} ({student.studentId})</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">· {student.gradeClass || student.department}</span>
                </div>
              )}

              {result.cycle > 1 && result.levelDelta !== undefined && (
                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-bold">
                  {result.levelDelta > 0
                    ? `🎉 +${result.levelDelta}단계 레벨업 성공!`
                    : result.levelDelta === 0
                    ? '안정적 성취 유지'
                    : '보완 학습 필요'}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {student ? `${student.name} 학생의 성취수준: ` : '학생 성취수준: '}
              <span className={levelInfo.textColor}>{levelInfo.name}</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {levelInfo.description}
            </p>

            {/* Growth delta banner if subsequent cycle */}
            {result.cycle > 1 && result.scoreDelta !== undefined && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400">성장 비교:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  이전 {result.cycle - 1}차 진단 ({result.previousScore || 0}점 / Level {result.previousLevel || 1}) 대비{' '}
                  <strong className={result.scoreDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                    {result.scoreDelta >= 0 ? `+${result.scoreDelta}` : result.scoreDelta}점 변화
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Level Metric Card */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 flex-shrink-0">
            <div className="text-center border-r border-slate-200 dark:border-slate-800 pr-5">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">총 득점</span>
              <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                {result.totalScore}
                <span className="text-sm text-slate-400 dark:text-slate-500 font-normal"> / {result.totalQuestions}</span>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{result.percentage}%</span>
            </div>

            <div className="text-center pl-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">판정 등급</span>
              <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400 mt-0.5 font-mono">
                Level {result.level}
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${levelInfo.badgeBg}`}>
                {levelInfo.gradeName}
              </span>
            </div>
          </div>
        </div>

        {/* 5-Level Progress Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            냉동공조공학 5단계 역량 체계 내 현재 위치
          </div>
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const info = ACHIEVEMENT_LEVELS[lvl];
              const isCurrent = result.level === lvl;
              const isPassed = result.level > lvl;

              return (
                <div
                  key={lvl}
                  className={`p-3 rounded-xl border transition-all text-center ${
                    isCurrent
                      ? `bg-blue-50/70 dark:bg-blue-950/40 border-2 border-blue-500 dark:border-blue-400 shadow-xs ring-2 ring-blue-500/20`
                      : isPassed
                      ? 'bg-slate-100/60 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      : 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/50 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-xs md:text-sm font-black ${isCurrent ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                      {lvl}단계
                    </span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-[11px] font-semibold truncate mt-0.5">
                    {info.shortName.split(' ')[1]}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 hidden sm:block">
                    {info.minScore}~{info.maxScore}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High School Credit System Minimum Competency Badge */}
        <div className={`mt-6 p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          result.percentage >= 40
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
            : 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
              result.percentage >= 40 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
            }`}>
              {result.percentage >= 40 ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                2022 개정 직업계고 전문교과 평가제
              </div>
              <div className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">
                고교학점제 최소 성취수준(40% 기준) 판정: {result.percentage >= 40 ? '도달 완료 (Pass)' : '미도달 (1:1 보충 지도 대상)'}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {result.percentage >= 40
                  ? '축하합니다! 최소 학업 성취수준(40점 이상, 2단계 기본 형성 이상)에 정상 도달하여 상위 수준 맞춤형 학습을 진행할 수 있습니다.'
                  : '최소 성취수준에 미도달(40점 미만)하였습니다. 고교학점제 지침에 따라 1:1 보충 클리닉 맞춤형 25문항을 먼저 이수해 주세요.'}
              </p>
            </div>
          </div>
          {result.percentage < 40 && (
            <button
              onClick={() => onStartPractice({ targetLevel: 1, count: 25, focusWeakness: true })}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer shadow-lg shadow-amber-500/20 flex-shrink-0"
            >
              보충 과제 25제 풀기 →
            </button>
          )}
        </div>

        {/* 3 Official Subject Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-indigo-700 dark:text-indigo-400">[전공 일반 7] 냉동 공조 일반</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">
                {result.subjectScores?.general ? result.subjectScores.general.correct : Math.round(result.totalScore / 3)} / {result.subjectScores?.general ? result.subjectScores.general.total : 10} 문항 ({result.subjectScores?.general ? result.subjectScores.general.percentage : result.percentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${result.subjectScores?.general ? result.subjectScores.general.percentage : result.percentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">냉동·공조 기초, 열역학, 공조 부하, 냉동 시스템 기기, 공조 기기, 자동 제어 [냉일 01~06]</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-700 dark:text-blue-400">[전공 실무 27] 냉동 공조 설계</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">
                {result.subjectScores?.design.correct ?? Math.round(result.totalScore / 3)} / {result.subjectScores?.design.total ?? 10} 문항 ({result.subjectScores?.design.percentage ?? result.percentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${result.subjectScores?.design.percentage ?? result.percentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">냉난방/냉동냉장 부하 계산, 냉동 사이클 분석, 습공기 선도, 설계 도면 [냉설 01~05]</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">[전공 실무 28] 냉동 공조 유지 보수 관리</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">
                {result.subjectScores?.maintenance.correct ?? Math.round(result.totalScore / 3)} / {result.subjectScores?.maintenance.total ?? 10} 문항 ({result.subjectScores?.maintenance.percentage ?? result.percentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${result.subjectScores?.maintenance.percentage ?? result.percentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">운영 안전 관리, 공조/냉동/보일러 설비 점검 및 고장 대책, 수처리, 자재 관리 [냉유 01~08]</div>
          </div>
        </div>
      </div>

      {/* Domain Analysis Grid (6 Domains) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOMAINS.map((domain) => {
          const dScore = result.domainScores[domain];
          const isWeakest = domain === result.weakestDomain;
          const isStrongest = domain === result.strongestDomain;

          let barColor = 'bg-blue-500';
          if (dScore.percentage >= 80) barColor = 'bg-emerald-500';
          else if (dScore.percentage >= 60) barColor = 'bg-cyan-500';
          else if (dScore.percentage >= 40) barColor = 'bg-amber-500';
          else barColor = 'bg-rose-500';

          return (
            <div
              key={domain}
              className={`p-5 rounded-2xl border transition-all ${
                isWeakest
                  ? 'bg-slate-900 border-rose-500/40 shadow-rose-950/20 shadow-lg'
                  : isStrongest
                  ? 'bg-slate-900 border-emerald-500/40 shadow-emerald-950/20 shadow-lg'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white truncate">{domain}</span>
                {isWeakest && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex-shrink-0 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> 최우선 보완
                  </span>
                )}
                {isStrongest && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex-shrink-0 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 강점 영역
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between mt-3 mb-1.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {dScore.percentage}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  정답 {dScore.correct} / {dScore.total} 문항
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${dScore.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Pedagogical Prescription & Learning Roadmap */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI 학습 코칭 & 맞춤형 처방 리포트</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                진단평가 30문항 분석 기반 학습 로드맵 및 영역별 강약점 분석
              </p>
            </div>
          </div>

          {isAiLoading && (
            <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> AI 심층 진단 분석 중...
            </span>
          )}
        </div>

        {/* Prescription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
              <TrendingUp className="w-4 h-4" /> 우수 역량 및 강점
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-slate-900 dark:text-white">{result.strongestDomain}</strong> 분야에서 높은 이해도를 입증했습니다. (정답률 {result.domainScores[result.strongestDomain]?.percentage}%)
              </li>
              {aiReport?.strengths ? (
                aiReport.strengths.map((s: string, idx: number) => <li key={idx}>{s}</li>)
              ) : (
                <>
                  <li>기본적인 냉동공조 핵심 용어와 기기 명칭 구분이 정확합니다.</li>
                  <li>자격증 시험의 단골 출제 유형에서 우수한 득점력을 보였습니다.</li>
                </>
              )}
            </ul>
          </div>

          {/* Weaknesses to Improve */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4" /> 집중 보완 필요 과제
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-slate-900 dark:text-white">{result.weakestDomain}</strong> 영역의 개념 정립 및 반복 훈련이 최우선입니다. (정답률 {result.domainScores[result.weakestDomain]?.percentage}%)
              </li>
              {aiReport?.weaknesses ? (
                aiReport.weaknesses.map((w: string, idx: number) => <li key={idx}>{w}</li>)
              ) : (
                <>
                  <li>P-h 몰리에르 선도 및 계산 공식(COP, 열량, 압축비) 적용 훈련이 필요합니다.</li>
                  <li>고장 진단 및 자동제어 회로 인터록 원리를 다시 점검하세요.</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* 3-Step Study Roadmap */}
        <div className="pt-2 space-y-3">
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> 단계별 맞춤형 추천 학습 로드맵
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(aiReport?.studyRoadmap || [
              {
                step: '1단계',
                title: `${result.weakestDomain} 집중 복습`,
                desc: '취약한 기본 개념과 오답 문항의 해설을 정독하고 핵심 키워드를 정리합니다.',
              },
              {
                step: '2단계',
                title: `${levelInfo.shortName} 맞춤형 문제 풀이`,
                desc: `현재 수준에 최적화된 ${levelInfo.recommendedQuestions}문제를 단계별로 해결하여 실전 응용력을 기릅니다.`,
              },
              {
                step: '3단계',
                title: 'P-h 선도 및 계산 시뮬레이션',
                desc: '몰리에르 시뮬레이터를 활용해 실시간 상태 변화와 공식을 체화하고 다음 레벨로 도약합니다.',
              },
            ]).map((stepItem: any, idx: number) => (
              <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  {stepItem.step}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{stepItem.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 20 ~ 100 문제 맞춤형 문제 자동 생성 게이트웨이 (핵심 기능) */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> AI 코스웨어 맞춤형 문제 자동 생성기
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              학생 성취수준({result.level}단계) 기반 실전 문제 자동 생성
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
              진단평가 결과에 따라 난이도를 정밀 조율하여 <strong>20문제부터 최대 100문제까지</strong> 개인 맞춤형으로 즉시 생성합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-2">권장 문항수:</span>
            <span className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">
              {levelInfo.recommendedQuestions}제
            </span>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Question Count Slider (6 cols) */}
          <div className="md:col-span-6 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 생성 문항 수 조절 (20 ~ 100문항)
              </span>
              <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">
                {selectedCount} <span className="text-xs font-normal text-slate-500">문제</span>
              </span>
            </div>

            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={selectedCount}
              onChange={(e) => setSelectedCount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <button
                onClick={() => setSelectedCount(20)}
                className={`hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer ${selectedCount === 20 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
              >
                20제 (빠른 점검)
              </button>
              <button
                onClick={() => setSelectedCount(levelInfo.recommendedQuestions)}
                className={`hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer ${selectedCount === levelInfo.recommendedQuestions ? 'text-blue-600 dark:text-blue-400 font-bold underline' : ''}`}
              >
                {levelInfo.recommendedQuestions}제 (추천)
              </button>
              <button
                onClick={() => setSelectedCount(50)}
                className={`hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer ${selectedCount === 50 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
              >
                50제 (기능사 실전)
              </button>
              <button
                onClick={() => setSelectedCount(100)}
                className={`hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer ${selectedCount === 100 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
              >
                100제 (마스터)
              </button>
            </div>
          </div>

          {/* Mode Selector (6 cols) */}
          <div className="md:col-span-6 space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              출제 모드 선택
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setGenerationMode('recommended');
                  setSelectedDomain('all');
                }}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  generationMode === 'recommended'
                    ? 'bg-blue-50 border-2 border-blue-600 text-blue-950 dark:bg-blue-950/60 dark:border-blue-400 dark:text-white font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                <div className="font-bold">전체 균형 출제</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">전 6대 영역 종합 출제</div>
              </button>

              <button
                onClick={() => {
                  setGenerationMode('weakness');
                  setSelectedDomain(result.weakestDomain);
                }}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  generationMode === 'weakness'
                    ? 'bg-rose-50 border-2 border-rose-600 text-rose-950 dark:bg-rose-950/60 dark:border-rose-400 dark:text-white font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                <div className="font-bold text-rose-700 dark:text-rose-300">취약 영역 집중 ({result.weakestDomain.split(' ')[0]})</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">최저 득점 영역 집중 타격</div>
              </button>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-cyan-500/20">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              선택한 설정: <strong className="text-white">{result.level}단계 난이도</strong> ·{' '}
              <strong className="text-cyan-400">{selectedCount}문제</strong> ·{' '}
              <strong className="text-slate-900 dark:text-white">
                {generationMode === 'weakness' ? `${result.weakestDomain} 집중` : '전 영역'}
              </strong>
            </span>
          </div>

          <button
            onClick={handleLaunchPractice}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>{selectedCount}문제 맞춤형 학습 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collapsible: Diagnostic 30 Questions Answer Review */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <button
          onClick={() => setShowAnswerReview(!showAnswerReview)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">진단평가 30문항 정답 및 상세 해설 검토</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                내가 선택한 답안과 정답, 출제위원 해설 및 실기/자격증 팁 확인
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>{showAnswerReview ? '접기' : '펼쳐보기'}</span>
            {showAnswerReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAnswerReview && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-6 bg-slate-50/50 dark:bg-slate-950/60">
            {/* Domain Filter inside review */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setFilterDomainReview('all')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer ${
                  filterDomainReview === 'all'
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                전체 (30문항)
              </button>
              {DOMAINS.map((dom) => (
                <button
                  key={dom}
                  onClick={() => setFilterDomainReview(dom)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer ${
                    filterDomainReview === dom
                      ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {cycleQuestions.filter(
                (q) => filterDomainReview === 'all' || q.domain === filterDomainReview
              ).map((q) => {
                const userAns = result.userAnswers[q.id];
                const isCorrect = userAns === q.answerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-800/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                          Q{cycleQuestions.findIndex((item) => item.id === q.id) + 1}.
                        </span>
                        {q.subject && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            q.subject === '냉동 공조 설계'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
                          }`}>
                            {q.subject}
                          </span>
                        )}
                        {q.standardCode && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800" title={q.standardName || '성취기준'}>
                            {q.standardCode}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                          {q.domain}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> 정답
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> 오답
                          </>
                        )}
                      </span>
                    </div>

                    <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-white mb-3 leading-relaxed">
                      {q.question}
                    </h4>

                    {/* P-h Mollier Diagram (Dynamic SVG Rendering) */}
                    {(q.cycleData || q.diagramType === 'mollier') && (
                      <div className="mb-4">
                        <PhDiagramCard
                          cycleData={q.cycleData}
                          title={`문항 Q${cycleQuestions.findIndex((item) => item.id === q.id) + 1} P-h 몰리에르 선도`}
                        />
                      </div>
                    )}

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = userAns === oIdx;
                        const isTheAnswer = q.answerIndex === oIdx;

                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                              isTheAnswer
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-200 font-semibold'
                                : isChosen && !isTheAnswer
                                ? 'bg-rose-50 border-rose-300 text-rose-950 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-200 line-through'
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px]">
                              {['①', '②', '③', '④'][oIdx]}
                            </span>
                            <span className="truncate">{opt}</span>
                            {isTheAnswer && (
                              <span className="ml-auto text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                                (정답)
                              </span>
                            )}
                            {isChosen && !isTheAnswer && (
                              <span className="ml-auto text-[10px] text-rose-700 dark:text-rose-400 font-bold">
                                (내가 고른 답)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Detailed Explanation */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> 해설:
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{q.explanation}</p>
                      {q.formula && (
                        <div className="pt-1 text-[11px] font-mono text-amber-800 dark:text-amber-300">
                          <strong>관련 공식:</strong> {q.formula}
                        </div>
                      )}
                      {q.practicalTip && (
                        <div className="pt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                          <strong>💡 실기/현장 팁:</strong> {q.practicalTip}
                        </div>
                      )}

                      {/* 4-Step Chain-of-Thought (CoT) Calculation Breakdown */}
                      {q.cotSteps && q.cotSteps.length > 0 && (
                        <div className="pt-2">
                          <CotStepsExplanation steps={q.cotSteps} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>

      {/* Action Buttons: Print Report Card & Retake */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {student ? `${student.name} 성적표 인쇄 / PDF 저장` : '성적표 인쇄'}
        </button>

        <button
          onClick={onRetakeDiagnostic}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> 30문제 진단평가 다시 치르기
        </button>
      </div>
    </div>
  );
};
