import { useRef, useEffect, useCallback, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { invoke } from '@tauri-apps/api/core';
import type { CodingStep, ExecutionResult } from '@/types';
import { useCourseStore } from '@/stores/courseStore';

interface CodeEditorProps {
  step: CodingStep;
  onComplete: () => void;
}

// CodeMirror 扩展：禁用输入法/中文输入
const disableIME: Extension = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    const doc = update.state.doc;
    const content = doc.toString();
    // 移除所有非ASCII字符（中文等）
    const cleanContent = content.replace(/[^\x00-\x7F]/g, '');
    if (cleanContent !== content) {
      update.view.dispatch({
        changes: {
          from: 0,
          to: doc.length,
          insert: cleanContent,
        },
      });
    }
  }
});

export function CodeEditor({ step, onComplete }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { currentCourse } = useCourseStore();
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);

  const getLanguageExtension = useCallback(() => {
    switch (currentCourse?.language) {
      case 'java':
        return java();
      case 'python':
        return python();
      case 'javascript':
        return javascript();
      default:
        return java();
    }
  }, [currentCourse?.language]);

  const getCode = useCallback(() => {
    return viewRef.current?.state.doc.toString() || '';
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: step.starter || '',
      extensions: [
        basicSetup,
        getLanguageExtension(),
        oneDark,
        disableIME,
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [step, getLanguageExtension]);

  const handleReset = () => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: step.starter || '',
        },
      });
    }
    setExecResult(null);
  };

  const handleRun = async () => {
    if (!currentCourse || isRunning) return;

    setIsRunning(true);
    setExecResult(null);

    try {
      const code = getCode();
      const result = await invoke<ExecutionResult>('execute_code', {
        language: currentCourse.language,
        code,
      });
      setExecResult(result);

      // 编译成功即可下一步
      if (result.success) {
        onComplete();
      }
    } catch (err) {
      setExecResult({
        success: false,
        output: '',
        error: String(err),
        execution_time_ms: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
        <span className="text-xs text-gray-400 font-mono">
          {currentCourse?.language === 'java' ? 'Main.java' : 'main.py'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
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
        </div>
      </div>

      {/* 编辑器 */}
      <div ref={editorRef} className="flex-1 overflow-hidden" />

      {/* 输出终端 */}
      <div className="h-32 border-t border-gray-700/50 bg-gray-900/50 overflow-auto">
        {execResult ? (
          <div className="p-3">
            {execResult.success ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-success-400 text-xs mb-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  编译成功！已自动进入下一步
                </div>
                {execResult.output && (
                  <>
                    <div className="text-xs text-gray-500 mb-1">输出：</div>
                    <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                      {execResult.output || '(无输出)'}
                    </pre>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-error-400 text-xs mb-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  编译失败
                </div>
                {execResult.error && (
                  <>
                    <div className="text-xs text-gray-500 mb-1">错误信息：</div>
                    <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap">
                      {execResult.error}
                    </pre>
                  </>
                )}
              </div>
            )}
            <div className="text-xs text-gray-600 mt-2">
              耗时: {execResult.execution_time_ms}ms
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-gray-500">
            点击「运行」按钮编译代码
          </div>
        )}
      </div>
    </div>
  );
}
