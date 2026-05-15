import { useEffect, useRef, type CSSProperties } from 'react';
import { useChartStore } from '@/stores/chartStore';

interface WpmChartProps {
  wpm: number;
  accuracy: number;
}

// SVG 视口常量
const W = 220;
const H = 100;
const PAD = 8;

/** 将数据数组映射为 SVG polyline 点字符串（WPM: max=130; Accuracy: max=100）*/
function toSvgPoints(data: number[], max: number): string {
  if (data.length === 0) return '';
  return data
    .map((v, i) => {
      const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
      const y = PAD + (1 - v / max) * (H - PAD * 2);
      return `${x},${y}`;
    })
    .join(' ');
}

/** 生成面积填充多边形（从数据底线到右侧底部闭合）*/
function toAreaPoints(data: number[], max: number): string {
  if (data.length === 0) return '';
  const pts = data.map((v, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - v / max) * (H - PAD * 2);
    return `${x},${y}`;
  });
  const bottom = data.map((_, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    return `${x},${H - PAD}`;
  });
  return [...pts, ...bottom.reverse()].join(' ');
}

export function WpmChart({ wpm, accuracy }: WpmChartProps) {
  const wpmHistory = useChartStore((s) => s.wpmHistory);
  const accuracyHistory = useChartStore((s) => s.accuracyHistory);
  const svgRef = useRef<SVGSVGElement>(null);

  // 触发折线描绘动画（仅数据更新时执行一次）
  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('.chart-line-animated');
    paths.forEach((p) => {
      const len = (p as SVGPathElement).getTotalLength?.() ?? 0;
      if (len > 0) {
        (p as SVGElement).style.strokeDasharray = String(len);
        (p as SVGElement).style.strokeDashoffset = String(len);
        // 强制 reflow 后启动动画
        (p as SVGElement).getBoundingClientRect();
        (p as SVGElement).style.transition = 'stroke-dashoffset 1.2s ease-out';
        (p as SVGElement).style.strokeDashoffset = '0';
      }
    });
  }, [wpmHistory, accuracyHistory]);

  const wpmPts = toSvgPoints(wpmHistory, 130);
  const accPts = toSvgPoints(accuracyHistory, 100);
  const wpmArea = toAreaPoints(wpmHistory, 130);
  const accArea = toAreaPoints(accuracyHistory, 100);

  // 终点圆点坐标
  const lastWpm = wpmHistory.length > 0 ? wpmHistory[wpmHistory.length - 1] : wpm;
  const lastAcc = accuracyHistory.length > 0 ? accuracyHistory[accuracyHistory.length - 1] : accuracy;
  const dotX = wpmHistory.length > 0 ? PAD + ((wpmHistory.length - 1) / (wpmHistory.length - 1)) * (W - PAD * 2) : PAD;
  const wpmDotY = PAD + (1 - Math.min(lastWpm, 130) / 130) * (H - PAD * 2);
  const accDotY = PAD + (1 - Math.min(lastAcc, 100) / 100) * (H - PAD * 2);

  return (
    <div className="w-72 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg shadow-black/30 animate-slide-up">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/30">
        <span className="text-xs font-medium text-gray-300">📈 实时表现</span>
        {/* TODO: 折叠按钮 */}
      </div>

      <div className="p-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ overflow: 'visible' } as CSSProperties}
        >
          {/* SVG 滤镜定义（霓虹发光） */}
          <defs>
            <filter id="neonBlue" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neonGreen" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 网格线 */}
          <line x1={PAD} y1={H * 0.25} x2={W - PAD} y2={H * 0.25} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,3" />
          <line x1={PAD} y1={H * 0.5} x2={W - PAD} y2={H * 0.5} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,3" />
          <line x1={PAD} y1={H * 0.75} x2={W - PAD} y2={H * 0.75} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,3" />

          {/* 渐变填充区域 */}
          {wpmArea && (
            <polygon points={wpmArea} fill="url(#wpmGrad)" opacity="0.8" />
          )}
          {accArea && (
            <polygon points={accArea} fill="url(#accGrad)" opacity="0.6" />
          )}

          {/* WPM 折线（霓虹） */}
          {wpmPts && (
            <polyline
              points={wpmPts}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonBlue)"
              className="chart-line-animated"
            />
          )}

          {/* 准确率折线（霓虹虚线） */}
          {accPts && (
            <polyline
              points={accPts}
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="2"
              strokeDasharray="4,3"
              strokeLinecap="round"
              filter="url(#neonGreen)"
              className="chart-line-animated"
            />
          )}

          {/* 终点发光圆点 */}
          {wpmHistory.length > 0 && (
            <circle cx={dotX} cy={wpmDotY} r="3" fill="#818cf8" filter="url(#neonBlue)">
              <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
            </circle>
          )}
          {accuracyHistory.length > 0 && (
            <circle cx={dotX} cy={accDotY} r="3" fill="#2dd4bf" filter="url(#neonGreen)">
              <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
            </circle>
          )}

          {/* 图例标签 */}
          <text x={PAD + 2} y={H * 0.22 + 4} fill="#818cf8" fontSize="8" fontWeight="bold">WPM</text>
          <text x={PAD + 2} y={H * 0.97} fill="#2dd4bf" fontSize="8" fontWeight="bold">ACC%</text>
        </svg>

        {/* 数值显示 */}
        <div className="flex items-center justify-between mt-1.5 text-xs">
          <span className="text-indigo-400 font-bold">
            {wpmHistory.length > 0 ? wpmHistory[wpmHistory.length - 1] : wpm} WPM
          </span>
          <span className="text-teal-400 font-bold">
            {accuracyHistory.length > 0 ? accuracyHistory[accuracyHistory.length - 1] : accuracy}%
          </span>
        </div>
      </div>
    </div>
  );
}
