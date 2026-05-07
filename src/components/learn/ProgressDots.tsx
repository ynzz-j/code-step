interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i < current
              ? 'bg-primary-400'
              : i === current
                ? 'bg-primary-500 ring-2 ring-primary-500/30'
                : 'bg-gray-600'
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-gray-500">
        {current + 1}/{total}
      </span>
    </div>
  );
}
