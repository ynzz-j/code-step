import { useEffect, useRef } from 'react';
import { useChartStore } from '@/stores/chartStore';

interface WpmChartProps {
  wpm: number;
  accuracy: number;
}

const W = 200;
const H = 60;
const PAD = 6;
const CHART_COLORS = {
  grid: '#334155',
  wpm: '#0ea5e9',
  accuracy: '#22c55e',
};

function toSvgPoints(data: number[], max: number): string {
  if (data.length === 0) return '';
  return data
    .map((v, i) => {
      const x = PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2);
      const y = PAD + (1 - Math.min(v, max) / max) * (H - PAD * 2);
      return `${x},${y}`;
    })
    .join(' ');
}

export function WpmChart({ wpm, accuracy }: WpmChartProps) {
  const wpmHistory = useChartStore((s) => s.wpmHistory);
  const accuracyHistory = useChartStore((s) => s.accuracyHistory);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('.chart-line-animated');
    paths.forEach((p) => {
      const len = (p as SVGPathElement).getTotalLength?.() ?? 0;
      if (len > 0) {
        (p as SVGElement).style.strokeDasharray = String(len);
        (p as SVGElement).style.strokeDashoffset = String(len);
        (p as SVGElement).getBoundingClientRect();
        (p as SVGElement).style.transition = 'stroke-dashoffset 0.8s ease-out';
        (p as SVGElement).style.strokeDashoffset = '0';
      }
    });
  }, [wpmHistory, accuracyHistory]);

  const wpmPts = toSvgPoints(wpmHistory, 130);
  const accPts = toSvgPoints(accuracyHistory, 100);

  const curWpm = wpmHistory.length > 0 ? wpmHistory[wpmHistory.length - 1] : wpm;
  const curAcc = accuracyHistory.length > 0 ? accuracyHistory[accuracyHistory.length - 1] : accuracy;

  return (
    <div className="w-full max-w-md bg-bg-panel/40 border border-bg-surface/30 rounded-tool">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-bg-surface/20">
        <span className="text-[10px] font-medium text-text-secondary">实时表现</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-accent-primary font-mono font-bold">{curWpm} WPM</span>
          <span className="text-accent-success font-mono font-bold">{curAcc}%</span>
        </div>
      </div>

      <div className="p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
        >
          {/* 网格线 - 更轻 */}
          <line x1={PAD} y1={H * 0.33} x2={W - PAD} y2={H * 0.33} stroke={CHART_COLORS.grid} strokeWidth="0.3" />
          <line x1={PAD} y1={H * 0.66} x2={W - PAD} y2={H * 0.66} stroke={CHART_COLORS.grid} strokeWidth="0.3" />

          {/* WPM 折线 */}
          {wpmPts && (
            <polyline
              points={wpmPts}
              fill="none"
              stroke={CHART_COLORS.wpm}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chart-line-animated"
            />
          )}

          {/* 准确率折线 */}
          {accPts && (
            <polyline
              points={accPts}
              fill="none"
              stroke={CHART_COLORS.accuracy}
              strokeWidth="1.5"
              strokeDasharray="3,2"
              strokeLinecap="round"
              className="chart-line-animated"
            />
          )}

          {/* 图例 */}
          <text x={PAD + 1} y={H * 0.2 + 3} fill={CHART_COLORS.wpm} fontSize="6" fontWeight="bold">WPM</text>
          <text x={PAD + 1} y={H - 2} fill={CHART_COLORS.accuracy} fontSize="6" fontWeight="bold">ACC</text>
        </svg>
      </div>
    </div>
  );
}
