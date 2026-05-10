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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {language === 'java' ? 'Main.java' : language === 'python' ? 'main.py' : 'main.js'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || passed}
            className="px-4 py-1.5 text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-400 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 font-medium border border-green-500/30 hover:shadow-lg hover:shadow-green-500/20"
          >
            {isRunning ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                运行中...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                运行
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-gray-700/30 hover:border-gray-600/50"
          >
            重置
          </button>
          <button
            onClick={handleShowAnswer}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 ${
              showAnswer
                ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 border border-gray-700/30 hover:border-gray-600/50'
            }`}
          >
            {showAnswer ? '已查看答案' : '查看答案'}
          </button>
        </div>
      </div>

      {/* 代码编辑区 */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => {
          if (!passed) setCode(e.target.value);
        }}
        disabled={passed}
        className={`flex-1 p-4 bg-gray-900/70 text-gray-200 font-mono text-sm resize-none outline-none border-none
          ${passed ? 'opacity-60 cursor-not-allowed' : 'focus:bg-gray-900/90'}
          whitespace-pre overflow-auto
          scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent`}
        spellCheck={false}
        placeholder="在此输入代码..."
        style={{
          lineHeight: '1.6',
          tabSize: 2,
        }}
      />

      {/* 结果区域 */}
      <div className="border-t border-gray-700/50 bg-gray-900/50 overflow-auto" style={{ maxHeight: '12rem' }}>
        {execResult || validationMsg ? (
          <div className="p-4 space-y-3 text-xs">
            {/* 校验结果 */}
            {validationMsg && (
              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                validationMsg.passed 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {validationMsg.passed ? (
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <div className={`p-2 rounded-lg ${
                execResult.success 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <div className={`flex items-center gap-2 ${
                  execResult.success ? 'text-green-400' : 'text-red-400'
                }`}>
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
                  <span className="font-medium">
                    {execResult.success ? '执行成功' : '执行失败'}
                  </span>
                  <span className="text-gray-500 ml-auto">
                    {execResult.execution_time_ms}ms
                  </span>
                </div>

                {/* 输出 */}
                {execResult.output && (
                  <div className="mt-2">
                    <div className="text-gray-500 mb-1">输出：</div>
                    <pre className="text-gray-300 font-mono whitespace-pre-wrap bg-gray-900/70 p-3 rounded-lg border border-gray-700/30">
                      {execResult.output || '(无输出)'}
                    </pre>
                  </div>
                )}

                {/* 错误信息 */}
                {execResult.error && (
                  <div className="mt-2">
                    <div className="text-gray-500 mb-1">错误信息：</div>
                    <pre className="text-red-400 font-mono whitespace-pre-wrap bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                      {execResult.error}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* 步骤通过提示 */}
            {passed && (
              <div className="flex items-center gap-2 text-green-400 font-semibold pt-2 pb-1 border-t border-green-500/20">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>🎯 步骤通过！</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            点击「运行」按钮验证代码
          </div>
        )}
      </div>
    </div>
  );
}
