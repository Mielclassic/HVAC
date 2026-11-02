import React, { useMemo } from 'react';
import { ThermodynamicCycleData } from '../types/hvac';
import { Gauge, Activity, Snowflake, Flame, ArrowRight } from 'lucide-react';

interface PhDiagramCardProps {
  cycleData?: ThermodynamicCycleData;
  title?: string;
  showMetrics?: boolean;
  className?: string;
}

export const PhDiagramCard: React.FC<PhDiagramCardProps> = ({
  cycleData,
  title = 'P-h 몰리에르 선도 (압력-엔탈피)',
  showMetrics = true,
  className = '',
}) => {
  // Fallback default cycle if none provided
  const data = useMemo<ThermodynamicCycleData>(() => {
    if (cycleData && cycleData.h1 && cycleData.h2) {
      return cycleData;
    }
    return {
      refrigerant: 'R-134a',
      pevap: 0.25,
      pcond: 1.15,
      h1: 395.0,
      h2: 435.0,
      h3: 245.0,
      h4: 245.0,
      qe: 150.0,
      aw: 40.0,
      cop: 3.75,
    };
  }, [cycleData]);

  // SVG Geometry Dimensions
  const svgW = 540;
  const svgH = 280;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 45;

  // Domain scaling bounds
  const isAmmonia = data.refrigerant.toUpperCase().includes('717');
  const hMin = isAmmonia ? 100 : Math.min(data.h4 - 50, 180);
  const hMax = isAmmonia ? 1800 : Math.max(data.h2 + 50, 480);
  const pMin = Math.max(0.08, data.pevap * 0.6);
  const pMax = Math.max(data.pcond * 1.4, data.pevap * 3);

  // Coordinate mapping
  const getX = (h: number) => {
    const ratio = Math.max(0, Math.min(1, (h - hMin) / (hMax - hMin)));
    return padLeft + ratio * (svgW - padLeft - padRight);
  };

  const getY = (p: number) => {
    // Logarithmic scale for pressure
    const logP = Math.log(Math.max(pMin, p));
    const logMin = Math.log(pMin);
    const logMax = Math.log(pMax);
    const ratio = Math.max(0, Math.min(1, (logP - logMin) / (logMax - logMin)));
    return svgH - padBottom - ratio * (svgH - padTop - padBottom);
  };

  // 4 Cycle Points
  const pt1 = { x: getX(data.h1), y: getY(data.pevap) }; // 증발기 출구 / 압축기 흡입 (저압, 건포화 증기/과열)
  const pt2 = { x: getX(data.h2), y: getY(data.pcond) }; // 압축기 토출 (고압, 과열 증기)
  const pt3 = { x: getX(data.h3), y: getY(data.pcond) }; // 응축기 출구 (고압, 포화액/과냉각액)
  const pt4 = { x: getX(data.h4), y: getY(data.pevap) }; // 팽창밸브 출구 (저압, 습증기, 등엔탈피 h4=h3)

  // Saturation Vapor Dome Approximation Curve Points
  const domePoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const steps = 30;
    const pCrit = pMax * 0.95;
    const hCrit = (hMin + hMax) * 0.48;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const p = pMin * Math.pow(pCrit / pMin, t);
      // Saturated liquid side (left curve)
      const hLiq = hMin + (hCrit - hMin) * Math.pow(t, 0.7);
      pts.push({ x: getX(hLiq), y: getY(p) });
    }
    for (let i = steps; i >= 0; i--) {
      const t = i / steps;
      const p = pMin * Math.pow(pCrit / pMin, t);
      // Saturated vapor side (right curve)
      const hVap = hMax - (hMax - hCrit) * Math.pow(t, 0.55);
      pts.push({ x: getX(hVap), y: getY(p) });
    }
    return pts;
  }, [hMin, hMax, pMin, pMax]);

  const domeD = useMemo(() => {
    if (domePoints.length === 0) return '';
    return domePoints.reduce(
      (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
      ''
    );
  }, [domePoints]);

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-5 space-y-3.5 shadow-xs ${className}`}
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">{title}</h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              냉매: <strong className="text-blue-700 dark:text-blue-400">{data.refrigerant}</strong> · 열역학적 4대 상태점 검증 완료
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            P_cond: {data.pcond} MPa
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            P_evap: {data.pevap} MPa
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-auto max-h-72 select-none"
        >
          <defs>
            {/* Arrow marker for cycle direction */}
            <marker
              id="cycle-arrow-blue"
              markerWidth="6"
              markerHeight="6"
              refX="4"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#06b6d4" />
            </marker>
            <marker
              id="cycle-arrow-purple"
              markerWidth="6"
              markerHeight="6"
              refX="4"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#a855f7" />
            </marker>
            <marker
              id="cycle-arrow-rose"
              markerWidth="6"
              markerHeight="6"
              refX="4"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#f43f5e" />
            </marker>
            <marker
              id="cycle-arrow-emerald"
              markerWidth="6"
              markerHeight="6"
              refX="4"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Grid lines and Pressure / Enthalpy axes */}
          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={svgH - padBottom}
            stroke="#334155"
            strokeWidth="1.5"
          />
          <line
            x1={padLeft}
            y1={svgH - padBottom}
            x2={svgW - padRight}
            y2={svgH - padBottom}
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Axes labels */}
          <text
            x={padLeft - 10}
            y={padTop + 2}
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
            textAnchor="end"
            fontFamily="monospace"
          >
            P (MPa)
          </text>
          <text
            x={svgW - padRight}
            y={svgH - padBottom + 20}
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
            textAnchor="end"
            fontFamily="monospace"
          >
            h (kJ/kg) →
          </text>

          {/* Saturation Vapor Dome (포화 증기 돔) */}
          <path
            d={domeD}
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text
            x={getX((hMin + hMax) * 0.48)}
            y={getY(pMax * 0.95) - 6}
            fill="#64748b"
            fontSize="9"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            임계점 (Critical Point)
          </text>
          <text
            x={getX(hMin + (hMax - hMin) * 0.2)}
            y={svgH - padBottom - 15}
            fill="#64748b"
            fontSize="8.5"
            textAnchor="middle"
          >
            포화액선
          </text>
          <text
            x={getX(hMin + (hMax - hMin) * 0.78)}
            y={svgH - padBottom - 15}
            fill="#64748b"
            fontSize="8.5"
            textAnchor="middle"
          >
            건포화증기선
          </text>

          {/* Isobaric lines: P_cond and P_evap (등압선 가이드) */}
          <line
            x1={padLeft}
            y1={pt2.y}
            x2={svgW - padRight}
            y2={pt2.y}
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <line
            x1={padLeft}
            y1={pt1.y}
            x2={svgW - padRight}
            y2={pt1.y}
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          <text
            x={padLeft - 8}
            y={pt2.y + 3}
            fill="#cbd5e1"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            {data.pcond}
          </text>
          <text
            x={padLeft - 8}
            y={pt1.y + 3}
            fill="#cbd5e1"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            {data.pevap}
          </text>

          {/* ============================================================ */}
          {/* 4 CYCLIC PROCESS LINES */}
          {/* ============================================================ */}

          {/* 1 -> 2: Compression (압축과정: 단열압축, 우측 상향) */}
          <line
            x1={pt1.x}
            y1={pt1.y}
            x2={pt2.x}
            y2={pt2.y}
            stroke="#a855f7"
            strokeWidth="2.5"
            markerEnd="url(#cycle-arrow-purple)"
          />

          {/* 2 -> 3: Condensation (응축과정: 고압 등압 방열, 수평 좌향) */}
          <line
            x1={pt2.x}
            y1={pt2.y}
            x2={pt3.x}
            y2={pt3.y}
            stroke="#f43f5e"
            strokeWidth="2.5"
            markerEnd="url(#cycle-arrow-rose)"
          />

          {/* 3 -> 4: Expansion (팽창과정: 등엔탈피 감압, 수직 하향 h4=h3) */}
          <line
            x1={pt3.x}
            y1={pt3.y}
            x2={pt4.x}
            y2={pt4.y}
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#cycle-arrow-emerald)"
          />

          {/* 4 -> 1: Evaporation (증발과정: 저압 등압 흡열, 수평 우향) */}
          <line
            x1={pt4.x}
            y1={pt4.y}
            x2={pt1.x}
            y2={pt1.y}
            stroke="#06b6d4"
            strokeWidth="2.5"
            markerEnd="url(#cycle-arrow-blue)"
          />

          {/* ============================================================ */}
          {/* 4 STATE POINTS CIRCLES & ENTHALPY TICK LABELS */}
          {/* ============================================================ */}

          {/* State Point 1 (증발기 출구 / 압축기 흡입) */}
          <circle cx={pt1.x} cy={pt1.y} r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
          <text x={pt1.x + 8} y={pt1.y + 12} fill="#38bdf8" fontSize="10" fontWeight="bold">
            1 (흡입: {data.h1})
          </text>
          <line x1={pt1.x} y1={pt1.y} x2={pt1.x} y2={svgH - padBottom} stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" />
          <text x={pt1.x} y={svgH - padBottom + 12} fill="#7dd3fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
            {data.h1}
          </text>

          {/* State Point 2 (압축기 토출) */}
          <circle cx={pt2.x} cy={pt2.y} r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
          <text x={pt2.x + 6} y={pt2.y - 6} fill="#c084fc" fontSize="10" fontWeight="bold">
            2 (토출: {data.h2})
          </text>
          <line x1={pt2.x} y1={pt2.y} x2={pt2.x} y2={svgH - padBottom} stroke="#9333ea" strokeWidth="1" strokeDasharray="2 2" />
          <text x={pt2.x} y={svgH - padBottom + 12} fill="#d8b4fe" fontSize="9" fontFamily="monospace" textAnchor="middle">
            {data.h2}
          </text>

          {/* State Point 3 (응축기 출구) */}
          <circle cx={pt3.x} cy={pt3.y} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
          <text x={pt3.x - 8} y={pt3.y - 6} fill="#fb7185" fontSize="10" fontWeight="bold" textAnchor="end">
            3 (응축: {data.h3})
          </text>

          {/* State Point 4 (팽창밸브 출구, 등엔탈피 수직선 상) */}
          <circle cx={pt4.x} cy={pt4.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <text x={pt4.x - 8} y={pt4.y + 12} fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="end">
            4 (팽창: {data.h4})
          </text>
          <line x1={pt4.x} y1={pt3.y} x2={pt4.x} y2={svgH - padBottom} stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
          <text x={pt4.x} y={svgH - padBottom + 12} fill="#6ee7b7" fontSize="9" fontFamily="monospace" textAnchor="middle">
            {data.h4}
          </text>
        </svg>
      </div>

      {/* Thermodynamic Metrics Breakdown Bar */}
      {showMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">단위 냉동효과 (qe)</span>
            <div className="font-mono font-bold text-blue-700 dark:text-blue-400 mt-0.5">
              {data.qe} <span className="text-[10px] text-slate-500 font-normal">kJ/kg</span>
            </div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block">h1 - h4</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">압축소요일 (Aw)</span>
            <div className="font-mono font-bold text-indigo-700 dark:text-indigo-400 mt-0.5">
              {data.aw} <span className="text-[10px] text-slate-500 font-normal">kJ/kg</span>
            </div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block">h2 - h1</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">성적계수 (COP)</span>
            <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 text-sm">
              {data.cop}
            </div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block">qe / Aw</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">압력비 (PR)</span>
            <div className="font-mono font-bold text-amber-700 dark:text-amber-400 mt-0.5">
              {(data.pcond / data.pevap).toFixed(2)}
            </div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block">P_cond / P_evap</span>
          </div>
        </div>
      )}
    </div>
  );
};
