import type { Step } from '@/types';

interface InstructionPanelProps {
  step: Step;
}

export function InstructionPanel({ step }: InstructionPanelProps) {
  return (
    <div className="w-80 flex-shrink-0 flex flex-col p-6 border-r border-gray-700/50 overflow-auto bg-gradient-to-b from-gray-800/30 to-gray-900/30">
      {/* 步骤标签 */}
      <div className="flex items-center gap-2 mb-5">
        <span className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10">
          {step.concept}
        </span>
        <span className="px-2.5 py-0.5 text-xs rounded-md bg-gray-700/50 text-gray-400 border border-gray-600/30">
          {step.type === 'coding' ? '代码练习' : '打字练习'}
        </span>
      </div>

      {/* 步骤标题 */}
      <h2 className="text-xl font-bold text-gray-100 mb-5 leading-tight">
        {step.title}
      </h2>

      {/* 步骤说明 */}
      <div className="text-sm text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap flex-1">
        {step.instruction}
      </div>

      {/* 提示框 */}
      {step.hint && (
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 shadow-lg shadow-blue-500/5 mb-4 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-200">
          <p className="text-xs text-blue-300 font-medium mb-2 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            提示
          </p>
          <p className="text-sm text-gray-300 font-mono bg-gray-900/50 p-3 rounded-lg border border-gray-700/30">
            {step.hint}
          </p>
        </div>
      )}

      {/* 鼓励文字 */}
      {step.encouragement && (
        <p className="mt-auto pt-6 text-sm text-gray-500 italic flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-500/50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {step.encouragement}
        </p>
      )}
    </div>
  );
}
