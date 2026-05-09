import { useState, useRef, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { CodingStep, ExecutionResult } from '@/types';
import { evaluateValidation, evaluateCodingStep } from '@/utils/validation';

interface CodeEditorProps {
  step: CodingStep;
  language: string;
  onComplete: () => void;
}

export function CodeEditor({ step, language, onComplete }: CodeEditorProps) {
  const [code, setCode] = useState(step.starter || '');
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [validationMsg, setValidationMsg] = useState<{ passed: boolean; message: string } | null>(null);
  const [passed, setPassed] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const completedRef = useRef(false);

  // 切换步骤时重置状态
  useEffect(() => {
    setCode(step.starter || '');
    setExecResult(null);
    setValidationMsg(null);
    setPassed(false);
    setShowAnswer(false);
    completedRef.current = false;
  }, [step]);

  const handleReset = useCallback(() => {
    setCode(step.starter || '');
    setExecResult(null);
    setValidationMsg(null);
    setPassed(false);
  }, [step]);

  const handleShowAnswer = useCallback(() => {
    if (showAnswer) {
      setShowAnswer(false);
    } else {
      const confirmed = window.confirm('确定查看答案？查看后将无法获得该步骤的学习成就。');
      if (confirmed) {
        setCode(step.answer);
        setShowAnswer(true);
      }
    }
  }, [showAnswer, step.answer]);

  const handleRun = useCallback(async () => {
    if (isRunning || passed) return;

    setIsRunning(true);
    setValidationMsg(null);
    setExecResult(null);

    // 步骤1：前端验证
    const vr = evaluateValidation(code, step.validation);
    setValidationMsg(vr);
    if (!vr.passed) {
      setIsRunning(false);
      return;
    }

    // 步骤2：执行代码
    try {
      const result = await invoke<ExecutionResult>('execute_code', {
        language,
        code,
        stdin: step.stdin || null,
      });
      setExecResult(result);

      // 步骤3：综合评估
      const evalResult = evaluateCodingStep({
        executionSuccess: result.success,
        stdout: result.output,
        expectedOutput: step.expectedOutput,
        sourceCode: code,
        validation: step.validation,
      });

      if (evalResult.passed && !completedRef.current) {
        completedRef.current = true;
        setPassed(true);
        onComplete();
      }
    } catch (err) {
      setExecResult({
        success: false,
        output: '',
        error: String(err),
        execution_time_ms: 0,
        error_type: 'RuntimeError',
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, step, language, isRunning, passed, onComplete]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
        <span className="text-xs text-gray-400 font-mono">
          {language === 'java' ? 'Main.java' : language === 'python' ? 'main.py' : 'main.js'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || passed}
            className="px-3 py-1 text-xs bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isRunning ? (
              <>
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                运行中...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                运行
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded transition-colors"
          >
            重置
          </button>
          <button
            onClick={handleShowAnswer}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              showAnswer
                ? 'text-warning-400 bg-warning-500/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
            }`}
          >
            {showAnswer ? '已查看答案' : '查看答案'}
          </button>
        </div>
      </div>

      {/* 代码编辑区 */}
      <textarea
        value={code}
        onChange={(e) => {
          if (!passed) setCode(e.target.value);
        }}
        disabled={passed}
        className={`flex-1 p-4 bg-gray-900/50 text-gray-200 font-mono text-sm resize-none outline-none border-none
          ${passed ? 'opacity-60 cursor-not-allowed' : 'focus:bg-gray-900/70'}
          whitespace-pre overflow-auto`}
        spellCheck={false}
        placeholder="在此输入代码..."
      />

      {/* 结果区域 */}
      <div className="border-t border-gray-700/50 bg-gray-900/50 overflow-auto" style={{ maxHeight: '12rem' }}>
        {execResult || validationMsg ? (
          <div className="p-3 space-y-2 text-xs">
            {/* 校验结果 */}
            {validationMsg && (
              <div className={`flex items-center gap-2 ${validationMsg.passed ? 'text-success-400' : 'text-error-400'}`}>
                {validationMsg.passed ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                )}
                <span>校验: {validationMsg.message}</span>
              </div>
            )}

            {/* 执行结果 */}
            {execResult && (
              <>
                <div className={`flex items-center gap-2 ${execResult.success ? 'text-success-400' : 'text-error-400'}`}>
                  {execResult.success ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                  <span>
                    {execResult.success ? '执行成功' : '执行失败'} ({execResult.execution_time_ms}ms)
                  </span>
                </div>

                {/* 输出 */}
                {execResult.output && (
                  <>
                    <div className="text-gray-500">输出：</div>
                    <pre className="text-gray-300 font-mono whitespace-pre-wrap bg-gray-800/50 p-2 rounded">
                      {execResult.output || '(无输出)'}
                    </pre>
                  </>
                )}

                {/* 错误信息 */}
                {execResult.error && (
                  <>
                    <div className="text-gray-500">错误信息：</div>
                    <pre className="text-red-400 font-mono whitespace-pre-wrap bg-gray-800/50 p-2 rounded">
                      {execResult.error}
                    </pre>
                  </>
                )}
              </>
            )}

            {/* 步骤通过提示 */}
            {passed && (
              <div className="flex items-center gap-2 text-success-400 font-semibold pt-1 border-t border-success-500/20">
                <span>🎯 步骤通过！</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-xs text-gray-500">
            点击「运行」按钮验证代码
          </div>
        )}
      </div>
    </div>
  );
}
