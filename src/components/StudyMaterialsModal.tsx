import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Layers,
  Flame,
  Snowflake,
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
  Wrench,
  Activity,
  Award,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { CURRICULUM_STANDARDS } from '../data/curriculumStandards';

interface StudyMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyMaterialsModal: React.FC<StudyMaterialsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'design' | 'maintenance' | 'standards' | 'creditSystem'>('general');
  const [standardSearch, setStandardSearch] = useState<string>('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'all' | '일반' | '설계' | '유지보수'>('all');

  if (!isOpen) return null;

  const filteredStandards = CURRICULUM_STANDARDS.filter((s) => {
    const matchesSubject =
      selectedSubjectFilter === 'all' ||
      (selectedSubjectFilter === '일반' && s.subject === '냉동 공조 일반') ||
      (selectedSubjectFilter === '설계' && s.subject === '냉동 공조 설계') ||
      (selectedSubjectFilter === '유지보수' && s.subject === '냉동 공조 유지 보수 관리');

    const matchesQuery =
      standardSearch === '' ||
      s.code.toLowerCase().includes(standardSearch.toLowerCase()) ||
      s.area.toLowerCase().includes(standardSearch.toLowerCase()) ||
      s.element.toLowerCase().includes(standardSearch.toLowerCase()) ||
      s.statement.toLowerCase().includes(standardSearch.toLowerCase()) ||
      s.keyConcepts.some((k) => k.toLowerCase().includes(standardSearch.toLowerCase()));

    return matchesSubject && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  교육부 2022 개정 직업계고 전문교과
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">기계 계열</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                냉동공조 고교 교육과정 & 공식 핸드북
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                [과목 7. 냉동 공조 일반] &bull; [과목 27. 냉동 공조 설계] &bull; [과목 28. 유지 보수 관리] 성취기준 및 핵심 이론 요약
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 px-4 pt-2 gap-2 overflow-x-auto flex-shrink-0">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            [과목 7] 냉동 공조 일반
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'design'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Snowflake className="w-4 h-4 text-blue-500" />
            [과목 27] 냉동 공조 설계
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'maintenance'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-500" />
            [과목 28] 유지 보수 관리
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'standards'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-500" />
            성취기준 코드표 [냉일/냉설/냉유]
          </button>

          <button
            onClick={() => setActiveTab('creditSystem')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'creditSystem'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-purple-500" />
            고교학점제 성취수준 가이드
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 flex-1">
          {/* TAB 0: [과목 7] 냉동 공조 일반 */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl">
                <span className="font-extrabold text-indigo-900 dark:text-indigo-300 text-sm block mb-1">
                  과목 7: [전공 일반] 냉동 공조 일반의 성격 및 목표 (2022 개정 교육과정)
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  공업 계열 고등학교 학생들에게 냉동 및 공기 조화의 기초 원리, 열역학 기본 법칙, 공기 조화 부하 산출, 냉동 사이클 구성 4대 핵심 기기 및 부속기기, 공조기 및 배관·송풍기 시스템, 자동 제어 장치 및 전동기 기동 회로의 원리를 체계적으로 학습시키는 전공 일반 필수 기초 과목입니다.
                </p>
              </div>

              {/* 1. 냉동 및 공기 조화 기초 & 친환경 냉매 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Snowflake className="w-4 h-4 text-indigo-500" /> 1. 기초 원리 및 친환경 대체냉매 [냉일 01]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">냉동톤(RT) 단위 환산</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">1 한국/일본 냉동톤(RT) = 3,320 kcal/h = 3.86 kW</code>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">1 미국 냉동톤(USRT) = 3,024 kcal/h = 3.52 kW</code>
                    <p className="text-[11px] text-slate-500">0℃ 물 1,000kg(1톤)을 24시간 동안 0℃ 얼음으로 만드는 냉동 능력 (얼음 융해잠열 79.68 kcal/kg).</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">환경 지수 규제 (몬트리올/키갈리 협약)</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                      <li><strong>ODP(오존층 파괴지수):</strong> R-11=1.0 기준. HFC/HFO=0.</li>
                      <li><strong>GWP(지구온난화지수):</strong> CO₂=1.0 기준. 친환경 냉매 전환 필수.</li>
                      <li><strong>자연 냉매:</strong> 암모니아(NH₃, R-717), 이산화탄소(CO₂, R-744), 프로판(R-290).</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. 열역학 기초 & COP */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Flame className="w-4 h-4 text-rose-500" /> 2. 열역학 기초 및 성능계수(COP) [냉일 02]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">절대압력과 열량 산출 공식</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">P_abs = P_atm + P_gauge (게이지압) = P_atm - P_vac (진공압)</code>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">현열 Q = m · c · ΔT  |  잠열 Q = m · r</code>
                    <p className="text-[11px] text-slate-500">표준대기압 = 1 atm = 760 mmHg = 10,332 mmAq = 101.325 kPa.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">카르노 및 실제 사이클 COP</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">COP_carnot = T_L / (T_H - T_L)  (절대온도 K 기준)</code>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">실제 COP = (h1 - h4) / (h2 - h1) = 냉동효과(qe) / 압축일량(Aw)</code>
                    <p className="text-[11px] text-slate-500">증발온도 상승 또는 응축온도 하강 시 COP가 비약적으로 향상됩니다.</p>
                  </div>
                </div>
              </div>

              {/* 3. 공조 부하 & 습공기선도 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Layers className="w-4 h-4 text-cyan-500" /> 3. 공기 조화 부하 및 습공기 상태선 [냉일 03]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">습공기 7대 상태값</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      건구온도(DB), 습구온도(WB), 노점온도(DP), 절대습도(x), 상대습도(RH), 엔탈피(h), 비체적(v). 2가지 독립 상태값이 주어지면 나머지 5가지 상태값이 고정됩니다.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">외기-환기 공기 혼합 및 송풍량 공식</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">t_mix = (Q_ra · t_ra + Q_oa · t_oa) / (Q_ra + Q_oa)</code>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">급기 풍량 Q_air = Qs / (0.29 · ΔT) [m³/h]</code>
                  </div>
                </div>
              </div>

              {/* 4. 냉동 시스템 4대 핵심 기기 & 부속기기 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Snowflake className="w-4 h-4 text-blue-500" /> 4. 냉동 시스템 구성 요소 기기 [냉일 04]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">4대 기본 사이클 기기</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                      <li><strong>압축기:</strong> 저온저압 가스를 고온고압 가스로 압축 (왕복동, 스크롤, 스크루, 원심식).</li>
                      <li><strong>응축기:</strong> 고온고압 냉매가스를 냉각·액화시켜 열 방출 (공랭식, 수랭식, 증발식).</li>
                      <li><strong>팽창밸브:</strong> 고압 액냉매를 감압·교축 팽창 (온도식 TXV, 전자식 EEV, 모세관).</li>
                      <li><strong>증발기:</strong> 저온저압 액냉매가 주위 열을 흡수 증발 (건식, 만액식).</li>
                    </ul>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">시스템 보호 필수 부속기기</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                      <li><strong>유분리기:</strong> 토출가스 내 윤활유를 분리하여 크랭크케이스로 회수.</li>
                      <li><strong>수액기(Receiver):</strong> 응축된 액냉매를 임시 저장하여 부하 변동 완충.</li>
                      <li><strong>액분리기(Accumulator):</strong> 증발기 출구 미증발 액체를 분리하여 액백(Liquid Back) 방지.</li>
                      <li><strong>안전밸브/가용전:</strong> 이상 고압 발생 시 냉매를 방출하여 용기 파열 예방.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 5. 공조 시스템 기기 및 펌프·송풍기 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Activity className="w-4 h-4 text-emerald-500" /> 5. 공기 조화 시스템 구성 요소 기기 [냉일 05]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">송풍기 상사법칙 (Fan Affinity Laws)</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">풍량 Q2/Q1 = N2/N1 (회전수 1승 비례)</code>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">풍압 P2/P1 = (N2/N1)² (회전수 2승 비례)</code>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">축동력 L2/L1 = (N2/N1)³ (회전수 3승 비례)</code>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">순환 펌프 양정 및 캐비테이션 방지</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">NPSHa &gt; NPSHr × 1.3 (30% 이상 안전 마진)</code>
                    <p className="text-[11px] text-slate-500">
                      유효흡입양정(NPSHa)이 필요흡입양정(NPSHr)보다 작아지면 액체가 기화하여 기포가 임펠러를 침식하는 캐비테이션(공동현상)이 발생합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 6. 자동 제어 장치 & 모터 회로 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500" /> 6. 자동 제어 장치 및 전동기 기동 회로 [냉일 06]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">3상 유도전동기 와이-델타(Y-Δ) 기동 회로</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                      <li>기동 시(Y결선): 기동전류 및 기동토크가 직입기동(Δ)의 <strong>1/3로 감소</strong>.</li>
                      <li>정상 운전 시(Δ결선): 전압 100% 인가하여 정격 출력 발휘.</li>
                      <li>5.5 kW(7.5 HP) 이상 공조 모터에 법적 의무 또는 표준 적용.</li>
                    </ul>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">자동제어 3대 구성요소 & 동작 방식</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                      <li><strong>검출부(센서) → 조절부(DDC 컨트롤러) → 조작부(모터밸브/댐퍼구동기).</strong></li>
                      <li><strong>2위치 동작(ON-OFF):</strong> 구조 단순, 잔류편차 발생.</li>
                      <li><strong>PID 제어:</strong> P(비례)+I(적분: 오프셋 제거)+D(미분: 급격한 외란 억제)로 최고 정밀도 유지.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: 냉동 공조 설계 */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
                <span className="font-extrabold text-blue-900 dark:text-blue-300 text-sm block mb-1">
                  과목 27: 냉동 공조 설계의 성격 및 목표
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  공업 분야 고등학교 공조산업설비 관련 학과 학생들에게 냉난방 부하 계산, 냉동·냉장 부하 계산, 공조 프로세스(습공기선도) 분석, 기본 및 특수 냉동 사이클 분석, 공조 급배수 설계 도면 작성에 이르는 실무 기술을 지도합니다.
                </p>
              </div>

              {/* 1. 부하 계산 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Flame className="w-4 h-4 text-amber-500" /> 1. 냉난방 및 냉동·냉장 부하 계산 공식 [냉설 01, 02]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block">구조체 열관류 손실 (벽체·지붕)</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">Q = K · A · ΔT [kcal/h]</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">K: 열관류율(kcal/m²·h·℃), A: 면적(m²), ΔT: 실내외 온도차</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block">외기 도입 현열 냉방 부하</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">Qs = 0.29 · Q_air · (to - ti) [kcal/h]</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">0.29: 공기 용적비열(kcal/m³·℃), Q_air: 외기 풍량(m³/h)</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block">식품 냉동 동결 부하 (3단계)</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">Q = m·c1·Δt1 + m·r + m·c2·Δt2</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">동결 전 현열 + 동결 잠열(얼음 80 kcal/kg) + 동결 후 냉각 현열</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block">응축기 총 열부하 (Qc)</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">Qc = Qe + 860 · P_kW [kcal/h]</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">냉각수 순환량 G_cw = Qc / (c · ΔT_w) (표준 RT당 13 LPM)</p>
                  </div>
                </div>
              </div>

              {/* 2. 냉동 사이클 및 P-h 선도 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Snowflake className="w-4 h-4 text-blue-500" /> 2. 냉동 사이클 해석 및 성적계수(COP) [냉설 04]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">단위 냉동효과 (qe)</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">qe = h1 - h4 [kJ/kg 또는 kcal/kg]</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">증발기 입출구 엔탈피 차이 (냉매 1kg당 흡열량)</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">압축 소요일 (Aw)</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">Aw = h2 - h1 [kJ/kg 또는 kcal/kg]</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">압축기가 냉매를 압축하기 위해 가한 일 (엔탈피 상승량)</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">냉동 성적계수 (COP_C)</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">COP_C = qe / Aw = (h1 - h4) / (h2 - h1)</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">히트펌프 난방 성적계수: COP_H = COP_C + 1</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">냉동톤 (1 USRT vs 1 RT)</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">1 USRT = 3,024 kcal/h = 3.86 kW</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">한국 1 RT = 3,320 kcal/h (0℃ 물 1톤을 24시간에 얼음으로 결빙)</p>
                  </div>
                </div>
              </div>

              {/* 3. 공조 프로세스 & 습공기 선도 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Activity className="w-4 h-4 text-purple-500" /> 3. 습공기 선도 및 공조기 송풍량 계산 [냉설 03]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-purple-600 dark:text-purple-400 block">공조기 급기 풍량 (CMH)</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">Q_air = Qs / [0.29 · (t_room - t_supply)]</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Qs: 실내 현열부하(kcal/h), 취출온도차: 통상 8~12℃</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-purple-600 dark:text-purple-400 block">공기 혼합 상태점 온도</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono block bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">t_mix = (Q1·t1 + Q2·t2) / (Q1 + Q2)</code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">외기(OA)와 환기(RA)의 풍량 반비례 내분점</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 냉동 공조 유지 보수 관리 */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl">
                <span className="font-extrabold text-emerald-900 dark:text-emerald-300 text-sm block mb-1">
                  과목 28: 냉동 공조 유지 보수 관리의 성격 및 목표
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  냉동 공조 설비를 최적 상태로 유지하기 위한 점검 및 진단, 산업안전보건법 및 고압가스·에너지이용합리화법 준수, 공조기·보일러·냉각탑·EHP 운전 및 트러블슈팅, 계측기 검교정과 자재 관리 능력을 기릅니다.
                </p>
              </div>

              {/* 1. 안전 및 법규 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500" /> 1. 운영 안전 관리 & 관련 법규 [냉유 01, 02]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-rose-600 dark:text-rose-400 block">밀폐공간 질식 예방 안전 수칙</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 list-disc list-inside">
                      <li>작업 전 산소 농도 18% 이상 및 유해가스 측정</li>
                      <li>작업 중 환기팬으로 신선 공기 연속 급기</li>
                      <li>송기마스크, 구명밧줄 구비 및 외부 감시인 배치</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-rose-600 dark:text-rose-400 block">법정 검사 및 안전관리자 선임 규정</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 list-disc list-inside">
                      <li>보일러: 에너지이용합리화법 1년 주기 개방·계속사용검사</li>
                      <li>고압 냉동기: 고압가스안전관리법 완성검사 및 안전관리자 선임</li>
                      <li>압력용기: 안전밸브 분출압력 주기적 시험 및 가용전 점검</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. 공조 및 냉동 설비 점검 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Wrench className="w-4 h-4 text-emerald-500" /> 2. 공조기·냉동기·냉각탑 점검 관리 [냉유 03, 04, 05]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">공조기 필터 차압 기준</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      신품 장착 초기 차압의 <strong className="text-slate-900 dark:text-white font-bold">2배 이상 상승 시</strong> 세정 또는 신품 교체
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">드레인 U-트랩 봉수 수두</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      유효 봉수 수두 H &gt; <strong className="text-slate-900 dark:text-white font-bold">공조기 내부 정압(mmAq) + 25mm</strong> (봉수 파괴 시 배수 역류 및 악취)
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">동절기 공조기 동파 방지</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      외기온도 <strong className="text-slate-900 dark:text-white font-bold">-5℃ 이하 시</strong> 외기(OA) 댐퍼 닫힘 및 난방 코일 순환 밸브 전개
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">냉각탑 수질 & 레지오넬라</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      살균제 정기 투여, 농축수 강제 블로우다운(Blow-down), 하부 수조 슬라임 청소
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. 보일러 및 증기 설비 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Flame className="w-4 h-4 text-amber-500" /> 3. 보일러 및 증기 배관 관리 [냉유 06]
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-amber-600 dark:text-amber-400 block">워터 해머링 방지</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      통기 전 드레인 밸브 개방, 밸브 완만 서서히 개방, 스팀트랩 및 순구배 유지
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-amber-600 dark:text-amber-400 block">프라이밍·포밍·캐리오버 방지</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      보일러수 용존 고형물 농축 방지, 주기적인 바닥 분출(블로우다운) 실시
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 성취기준 코드표 [냉설/냉유] */}
          {activeTab === 'standards' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="성취기준 코드([냉설 01..]), 영역명, 핵심 개념 검색"
                    value={standardSearch}
                    onChange={(e) => setStandardSearch(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                  <button
                    onClick={() => setSelectedSubjectFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedSubjectFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    전체 ({CURRICULUM_STANDARDS.length})
                  </button>
                  <button
                    onClick={() => setSelectedSubjectFilter('일반')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedSubjectFilter === '일반'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    냉동 공조 일반 (22)
                  </button>
                  <button
                    onClick={() => setSelectedSubjectFilter('설계')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedSubjectFilter === '설계'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    냉동 공조 설계 (17)
                  </button>
                  <button
                    onClick={() => setSelectedSubjectFilter('유지보수')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedSubjectFilter === '유지보수'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    유지 보수 관리 (30)
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredStandards.map((std) => (
                  <div
                    key={std.code}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 hover:border-blue-400 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-700 dark:text-amber-300 text-xs px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800/40">
                          {std.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                          std.subject === '냉동 공조 일반'
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40'
                            : std.subject === '냉동 공조 설계'
                            ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
                            : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                        }`}>
                          {std.subject}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {std.area} &gt; <strong className="text-slate-700 dark:text-slate-200">{std.element}</strong>
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                      {std.statement}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {std.keyConcepts.map((kc, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-slate-700 font-mono"
                        >
                          #{kc}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredStandards.length === 0 && (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                    검색 조건과 일치하는 교육과정 성취기준이 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: 고교학점제 최소 성취수준 가이드 */}
          {activeTab === 'creditSystem' && (
            <div className="space-y-6">
              <div className="p-4 bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-2xl space-y-2">
                <span className="font-extrabold text-purple-900 dark:text-purple-300 text-sm block">
                  고교학점제 최소 성취수준 보장 지도 규정 (PDF 711p, 740p)
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                  “고교학점제 도입을 고려하여 최소 성취수준 보장을 위한 학습 지원이나 평가 지도 방향을 고려하여 적용한다. 최소 성취수준 보장을 위해 교사가 피드백과 함께 맞춤형 과제를 부여하여 학습을 지원한다.”
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 최소 성취수준 도달 기준 (Pass)
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    <li>30문항 진단평가 <strong className="text-emerald-700 dark:text-emerald-400 font-bold">40% 이상(12점 이상)</strong> 득점</li>
                    <li>성취수준 <strong className="text-emerald-700 dark:text-emerald-400 font-bold">2단계(기본 형성)</strong> 이상 도달</li>
                    <li>냉동 4대 사이클과 보일러·공조기 기초 점검 능력 입증</li>
                    <li>도달 후: 상위 수준(3~5단계) 심화 문제(40~100제) 자율 학습 진행</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" /> 최소 성취수준 미도달 시 지원 (Need Support)
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    <li>30문항 진단평가 <strong className="text-amber-700 dark:text-amber-400 font-bold">40% 미만</strong> (1단계 기초 입문)</li>
                    <li>AI 코스웨어가 취약 성취기준 분석 기반 <strong className="text-amber-700 dark:text-amber-400 font-bold">1:1 보충 클리닉 25제</strong> 자동 처방</li>
                    <li>보충 과제 이수 후 새로운 회차 진단평가 재응시를 통해 성취수준 도달 확인</li>
                  </ul>
                </div>
              </div>

              {/* 5-Level Competency Rubric */}
              <div className="p-4 bg-white dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  냉동공조 5단계 성취평가제 평정 척도
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                    <div className="font-bold text-amber-800 dark:text-amber-300">1단계 (0~39%)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">기초 입문반</div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">미도달 (보충필요)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
                    <div className="font-bold text-blue-800 dark:text-blue-300">2단계 (40~59%)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">기본 형성반</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">최소수준 통과</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300">3단계 (60~74%)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">실무 발전반</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">기능사 합격권</div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
                    <div className="font-bold text-indigo-800 dark:text-indigo-300">4단계 (75~89%)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">심화 숙련반</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">우수 숙련자</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40">
                    <div className="font-bold text-purple-800 dark:text-purple-300">5단계 (90~100%)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">전문 마스터반</div>
                    <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">최고 기술자</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
