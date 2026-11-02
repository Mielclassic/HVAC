import React, { useState, useMemo } from 'react';
import { Activity, Gauge, Flame, Snowflake, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';

export const MollierSimulator: React.FC = () => {
  // State for cycle parameters
  const [evapTemp, setEvapTemp] = useState<number>(-10); // ℃
  const [condTemp, setCondTemp] = useState<number>(40); // ℃
  const [superheat, setSuperheat] = useState<number>(5); // ℃ 과열도
  const [subcooling, setSubcooling] = useState<number>(5); // ℃ 과냉각도
  const [refrigerant, setRefrigerant] = useState<string>('R-134a');

  // Realistic thermodynamic approximations for pedagogical simulation
  const cycleCalc = useMemo(() => {
    // Pressures (MPa abs) approximation
    let pEvap = 0.2;
    let pCond = 1.0;
    let baseH1 = 150;
    let baseH3 = 60;

    if (refrigerant === 'R-134a') {
      pEvap = Number((0.20 + (evapTemp + 10) * 0.007).toFixed(3));
      pCond = Number((1.01 + (condTemp - 40) * 0.025).toFixed(3));
      baseH1 = 145 + evapTemp * 0.3 + superheat * 0.25;
      baseH3 = 60 + (condTemp - 40) * 0.35 - subcooling * 0.35;
    } else if (refrigerant === 'R-410A') {
      pEvap = Number((0.35 + (evapTemp + 10) * 0.012).toFixed(3));
      pCond = Number((1.65 + (condTemp - 40) * 0.04).toFixed(3));
      baseH1 = 155 + evapTemp * 0.35 + superheat * 0.3;
      baseH3 = 65 + (condTemp - 40) * 0.4 - subcooling * 0.4;
    } else {
      // R-717 (Ammonia)
      pEvap = Number((0.29 + (evapTemp + 10) * 0.009).toFixed(3));
      pCond = Number((1.55 + (condTemp - 40) * 0.035).toFixed(3));
      baseH1 = 390 + evapTemp * 0.8 + superheat * 0.6;
      baseH3 = 130 + (condTemp - 40) * 1.1 - subcooling * 1.1;
    }

    const h1 = Number(baseH1.toFixed(1));
    const h3 = Number(baseH3.toFixed(1));
    const h4 = h3; // 등엔탈피 팽창 (h4 = h3)

    // Compression work: depends on pressure ratio and isentropic efficiency
    const pr = Math.max(1.1, pCond / Math.max(0.05, pEvap));
    const aw = Number((20 * Math.pow(pr, 0.28) + (condTemp - evapTemp) * 0.15).toFixed(1));
    const h2 = Number((h1 + aw).toFixed(1));

    const qe = Number((h1 - h4).toFixed(1)); // 단위 냉동효과
    const qc = Number((h2 - h3).toFixed(1)); // 단위 응축부하
    const cop = Number((qe / Math.max(0.1, aw)).toFixed(2)); // 성적계수

    return {
      pEvap: Math.max(0.05, pEvap),
      pCond: Math.max(pEvap + 0.1, pCond),
      pr: Number(pr.toFixed(2)),
      h1,
      h2,
      h3,
      h4,
      qe,
      qc,
      aw,
      cop,
    };
  }, [evapTemp, condTemp, superheat, subcooling, refrigerant]);

  // SVG dimensions for P-h plot
  const svgW = 600;
  const svgH = 340;
  const padX = 60;
  const padY = 40;

  // Coordinate mapping for SVG
  const hMin = refrigerant === 'R-717' ? 80 : 30;
  const hMax = refrigerant === 'R-717' ? 460 : 200;
  const pMin = 0.05;
  const pMax = refrigerant === 'R-410A' ? 2.5 : 2.0;

  const getX = (h: number) => padX + ((h - hMin) / (hMax - hMin)) * (svgW - padX * 1.5);
  // Log scale for pressure
  const getY = (p: number) => {
    const logP = Math.log(p);
    const logMin = Math.log(pMin);
    const logMax = Math.log(pMax);
    const norm = (logP - logMin) / (logMax - logMin);
    return svgH - padY - norm * (svgH - padY * 2);
  };

  const x1 = getX(cycleCalc.h1);
  const y1 = getY(cycleCalc.pEvap);

  const x2 = getX(cycleCalc.h2);
  const y2 = getY(cycleCalc.pCond);

  const x3 = getX(cycleCalc.h3);
  const y3 = getY(cycleCalc.pCond);

  const x4 = getX(cycleCalc.h4);
  const y4 = getY(cycleCalc.pEvap);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-wide">
              인터랙티브 P-h (몰리에르) 선도 시뮬레이터
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            증발온도, 응축온도, 과열도, 과냉각도를 조절하며 냉동 4대 사이클과 COP(성적계수)의 변화를 실시간으로 탐구합니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">냉매 선택:</label>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {['R-134a', 'R-410A', 'R-717'].map((ref) => (
              <button
                key={ref}
                onClick={() => setRefrigerant(ref)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  refrigerant === ref
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {ref}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setEvapTemp(-10);
              setCondTemp(40);
              setSuperheat(5);
              setSubcooling(5);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="기본값 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Controls + SVG Plot + Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders Controller (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center justify-between">
            <span>사이클 변수 제어</span>
            <span className="text-[11px] text-slate-500 font-normal">슬라이더 드래그</span>
          </div>

          {/* Evaporator Temp */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Snowflake className="w-3.5 h-3.5 text-sky-400" /> 증발온도 (Te)
              </span>
              <span className="font-mono font-bold text-sky-400">{evapTemp} ℃</span>
            </div>
            <input
              type="range"
              min="-30"
              max="10"
              step="1"
              value={evapTemp}
              onChange={(e) => setEvapTemp(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-30℃ (냉동)</span>
              <span>10℃ (에어컨)</span>
            </div>
          </div>

          {/* Condenser Temp */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> 응축온도 (Tc)
              </span>
              <span className="font-mono font-bold text-rose-400">{condTemp} ℃</span>
            </div>
            <input
              type="range"
              min="25"
              max="55"
              step="1"
              value={condTemp}
              onChange={(e) => setCondTemp(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>25℃ (수랭식 저온)</span>
              <span>55℃ (공랭식 혹서)</span>
            </div>
          </div>

          {/* Superheat */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-400" /> 흡입 과열도 (ΔT_sh)
              </span>
              <span className="font-mono font-bold text-amber-400">{superheat} ℃</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={superheat}
              onChange={(e) => setSuperheat(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-500 leading-tight">
              압축기로 액 냉매가 흡입되는 액백(Liquid Back)을 막아줍니다. (권장: 3~7℃)
            </p>
          </div>

          {/* Subcooling */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> 응축 과냉각도 (ΔT_sc)
              </span>
              <span className="font-mono font-bold text-emerald-400">{subcooling} ℃</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={subcooling}
              onChange={(e) => setSubcooling(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-500 leading-tight">
              플래시 가스를 억제하고 단위 냉동효과 qe를 증대시킵니다. (권장: 3~5℃)
            </p>
          </div>

          {/* State Points Summary Table */}
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono space-y-1">
            <div className="text-slate-400 font-semibold font-sans mb-1 text-xs">상태점 엔탈피 (kcal/kg):</div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-sky-400 font-bold">1(흡입):</span> {cycleCalc.h1}
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-rose-400 font-bold">2(토출):</span> {cycleCalc.h2}
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">3(응축):</span> {cycleCalc.h3}
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-purple-400 font-bold">4(팽창):</span> {cycleCalc.h4}
              </div>
            </div>
          </div>
        </div>

        {/* SVG P-h Canvas Plot (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-hidden shadow-inner">
            <div className="flex justify-between items-center px-2 py-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">P-h 선도 (Mollier Diagram)</span>
              <span className="text-[11px] font-mono">가로: 엔탈피 h (kcal/kg) | 세로: 압력 P (MPa abs, Log)</span>
            </div>

            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto select-none">
              <defs>
                <linearGradient id="vaporDomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padX} y1={svgH - padY} x2={svgW - padX / 2} y2={svgH - padY} stroke="#334155" strokeWidth="1" />
              <line x1={padX} y1={padY} x2={padX} y2={svgH - padY} stroke="#334155" strokeWidth="1" />

              {/* Saturation Dome (Approximate bell curve) */}
              <path
                d={`M ${getX(hMin + 15)} ${svgH - padY} 
                    Q ${getX((hMin + hMax) / 2 - 20)} ${getY(pMax * 0.95)} ${getX((hMin + hMax) / 2)} ${getY(pMax * 0.98)} 
                    Q ${getX((hMin + hMax) / 2 + 30)} ${getY(pMax * 0.95)} ${getX(hMax - 15)} ${svgH - padY}`}
                fill="url(#vaporDomeGrad)"
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* Dome Annotation */}
              <text x={getX((hMin + hMax) / 2)} y={getY(pMax * 0.98) - 10} fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                임계점 (Critical Point)
              </text>
              <text x={getX(hMin + 35)} y={svgH - padY - 20} fill="#64748b" fontSize="10" fontWeight="600">
                포화액선
              </text>
              <text x={getX(hMax - 55)} y={svgH - padY - 20} fill="#64748b" fontSize="10" fontWeight="600">
                건포화증기선
              </text>

              {/* Isobar lines for Condenser and Evaporator */}
              <line x1={padX} y1={y2} x2={svgW - padX / 2} y2={y2} stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <line x1={padX} y1={y1} x2={svgW - padX / 2} y2={y1} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

              <text x={padX + 5} y={y2 - 6} fill="#f43f5e" fontSize="10" fontWeight="bold">
                응축압력 Pc: {cycleCalc.pCond} MPa
              </text>
              <text x={padX + 5} y={y1 - 6} fill="#38bdf8" fontSize="10" fontWeight="bold">
                증발압력 Pe: {cycleCalc.pEvap} MPa
              </text>

              {/* Cycle Process Lines */}
              {/* 4 -> 1: Evaporation (Horizontal to the right) */}
              <line x1={x4} y1={y4} x2={x1} y2={y1} stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
              {/* 1 -> 2: Compression (Up and to the right) */}
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" />
              {/* 2 -> 3: Condensation (Horizontal to the left) */}
              <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
              {/* 3 -> 4: Throttling / Expansion (Vertical line straight down) */}
              <line x1={x3} y1={y3} x2={x4} y2={y4} stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="6 3" />

              {/* State Point Markers */}
              {/* Point 1: Compressor Suction */}
              <circle cx={x1} cy={y1} r="6" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
              <text x={x1 + 10} y={y1 + 16} fill="#38bdf8" fontSize="11" fontWeight="bold">
                1 (흡입, h1={cycleCalc.h1})
              </text>

              {/* Point 2: Compressor Discharge */}
              <circle cx={x2} cy={y2} r="6" fill="#fb923c" stroke="#0f172a" strokeWidth="2" />
              <text x={x2 + 10} y={y2 - 8} fill="#fb923c" fontSize="11" fontWeight="bold">
                2 (토출, h2={cycleCalc.h2})
              </text>

              {/* Point 3: Condenser Outlet */}
              <circle cx={x3} cy={y3} r="6" fill="#f43f5e" stroke="#0f172a" strokeWidth="2" />
              <text x={x3 - 8} y={y3 - 8} fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="end">
                3 (응축액, h3={cycleCalc.h3})
              </text>

              {/* Point 4: Expansion Valve Outlet */}
              <circle cx={x4} cy={y4} r="6" fill="#c084fc" stroke="#0f172a" strokeWidth="2" />
              <text x={x4 - 8} y={y4 + 16} fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="end">
                4 (팽창, h4={cycleCalc.h4})
              </text>

              {/* Process Descriptions */}
              <text x={(x4 + x1) / 2} y={y1 + 16} fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">
                증발 과정 (흡열 qe={cycleCalc.qe} kcal/kg) →
              </text>
              <text x={(x3 + x2) / 2} y={y2 - 10} fill="#f43f5e" fontSize="10" textAnchor="middle" fontWeight="bold">
                ← 응축 방열 과정 (qc={cycleCalc.qc} kcal/kg)
              </text>
              <text x={x3 - 10} y={(y3 + y4) / 2} fill="#c084fc" fontSize="10" textAnchor="end" fontWeight="bold">
                교축 팽창 (h3=h4) ↓
              </text>
              <text x={(x1 + x2) / 2 + 15} y={(y1 + y2) / 2} fill="#fb923c" fontSize="10" fontWeight="bold">
                압축 일 (Aw={cycleCalc.aw}) ↗
              </text>
            </svg>
          </div>

          {/* Real-time Calculated Thermodynamic Results */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">단위 냉동효과 (qe)</span>
              <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 font-mono mt-0.5 block">
                {cycleCalc.qe}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">kcal/kg (h1 - h4)</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">압축 소요일 (Aw)</span>
              <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 font-mono mt-0.5 block">
                {cycleCalc.aw}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">kcal/kg (h2 - h1)</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">압축비 (Pd / Ps)</span>
              <span className={`text-xl font-extrabold font-mono mt-0.5 block ${cycleCalc.pr > 6 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-700 dark:text-blue-400'}`}>
                {cycleCalc.pr}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{cycleCalc.pr > 6 ? '고압축비(2단 압축 권장)' : '정상 범위'}</span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-center">
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold block">성적계수 (COP)</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block">
                {cycleCalc.cop}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-500/90 font-semibold">qe / Aw</span>
            </div>
          </div>

          {/* Quick Theory Insight */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">냉동공학 원포인트 핵심: </span>
              증발온도(Te)를 올리거나 응축온도(Tc)를 낮추면 압축비가 감소하고 단위 냉동효과 qe가 늘어나{' '}
              <strong className="text-emerald-700 dark:text-emerald-400">성적계수(COP)가 대폭 향상</strong>됩니다. 또한 적절한 과냉각(Subcooling)은 팽창밸브 통과 시 플래시 가스를 억제하여 에너지 효율을 높입니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
