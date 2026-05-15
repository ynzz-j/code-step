import { useState } from 'react';
import type { Step } from '@/types';

interface InstructionPanelProps {
  step: Step;
}

export function InstructionPanel({ step }: InstructionPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`flex-shrink-0 flex flex-col border-r border-bg-surface/50 overflow-auto bg-bg-panel/20 transition-all duration-300 ${collapsed ? 'w-10' : 'w-64'}`}>
      {/* 折叠/展开按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-8 w-full hover:bg-bg-surface/30 transition-colors text-text-muted hover:text-text-primary"
        title={collapsed ? '展开说明' : '折叠说明'}
      >
        <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {collapsed ? (
        /* 折叠状态：只显示概念标签 */
        <div className="flex flex-col items-center gap-2 py-4">
          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-tool bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
            {step.concept.substring(0, 2)}
          </span>
        </div>
      ) : (
        /* 展开状态 */
        <div className="flex flex-col p-4 overflow-auto">
          {/* 步骤标签 */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="px-2 py-0.5 text-xs font-medium rounded-tool bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
              {step.concept}
            </span>
            <span className="px-2 py-0.5 text-[10px] rounded-tool bg-bg-surface/50 text-text-secondary border border-bg-elevated/30">
              {step.type === 'coding' ? '代码' : '打字'}
            </span>
          </div>

          {/* 步骤标题 */}
          <h2 className="text-sm font-bold text-text-primary mb-3 leading-tight line-clamp-2">
            {step.title}
          </h2>

          {/* 步骤说明 - 可折叠长说明 */}
          <div className="text-xs text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap flex-1 overflow-auto">
            {step.instruction}
          </div>

          {/* 提示框 */}
          {step.hint && (
            <details className="mb-3 group">
              <summary className="text-xs text-accent-primary cursor-pointer hover:text-primary-300 transition-colors flex items-center gap-1 select-none">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                提示
              </summary>
              <p className="text-xs text-text-secondary font-mono bg-bg-app/50 p-2 rounded-tool border border-bg-surface/30 mt-2">
                {step.hint}
              </p>
            </details>
          )}

          {/* 鼓励文字 */}
          {step.encouragement && (
            <p className="mt-auto text-[11px] text-text-muted italic flex items-center gap-1">
              {step.encouragement}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
