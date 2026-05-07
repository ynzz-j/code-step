import type { Step } from '@/types';

interface InstructionPanelProps {
  step: Step;
}

export function InstructionPanel({ step }: InstructionPanelProps) {
  return (
    <div className="w-80 flex-shrink-0 flex flex-col p-6 border-r border-gray-700/50 overflow-auto bg-gray-800/20">
      {/* 步骤标签 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 text-xs rounded bg-primary-500/20 text-primary-300">
          {step.concept}
        </span>
        <span className="px-2 py-0.5 text-xs rounded bg-gray-700/50 text-gray-400">
          {step.type === 'coding' ? 'coding' : 'typing'}
        </span>
      </div>

      {/* 步骤标题 */}
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        {step.title}
      </h2>

      {/* 步骤说明 */}
      <div className="text-sm text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
        {step.instruction}
      </div>

      {/* 提示框 */}
      {step.hint && (
        <div className="p-4 rounded-lg bg-primary-500/5 border border-primary-500/20">
          <p className="text-xs text-primary-300 font-medium mb-1">提示</p>
          <p className="text-sm text-gray-300 font-mono">{step.hint}</p>
        </div>
      )}

      {/* 鼓励文字 */}
      {step.encouragement && (
        <p className="mt-auto pt-6 text-sm text-gray-500 italic">
          {step.encouragement}
        </p>
      )}
    </div>
  );
}
