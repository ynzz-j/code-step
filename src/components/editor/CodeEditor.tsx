import { useRef, useEffect, useCallback } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import type { CodingStep } from '@/types';
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

export function CodeEditor({ step, onComplete: _onComplete }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { currentCourse } = useCourseStore();

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
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
        <span className="text-xs text-gray-400 font-mono">
          {currentCourse?.language === 'java' ? 'Main.java' : 'main.py'}
        </span>
        <button
          onClick={handleReset}
          className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded transition-colors"
        >
          重置
        </button>
      </div>

      {/* 编辑器 */}
      <div ref={editorRef} className="flex-1 overflow-hidden" />

      {/* 输出终端 */}
      {step.expectedOutput && (
        <div className="h-24 border-t border-gray-700/50 bg-gray-900/50 p-3 overflow-auto">
          <div className="text-xs text-gray-500 mb-1">期望输出：</div>
          <pre className="text-xs text-gray-300 font-mono">
            {step.expectedOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
