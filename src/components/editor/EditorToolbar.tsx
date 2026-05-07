interface EditorToolbarProps {
  fileName: string;
  onReset?: () => void;
  onRun?: () => void;
}

export function EditorToolbar({ fileName, onReset, onRun }: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
      <span className="text-xs text-gray-400 font-mono">{fileName}</span>
      <div className="flex items-center gap-2">
        {onRun && (
          <button
            onClick={onRun}
            className="px-2 py-1 text-xs text-success-400 hover:bg-success-500/10 rounded transition-colors"
          >
            运行
          </button>
        )}
        {onReset && (
          <button
            onClick={onReset}
            className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded transition-colors"
          >
            重置
          </button>
        )}
      </div>
    </div>
  );
}
