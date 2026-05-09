import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTypingStatsStore } from '@/stores/typingStatsStore';
import { useComboStore } from '@/stores/comboStore';
import { normalizeCourseMode } from '@/services/courseService';

export function CompletePage() {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const coursesQuery = modeParam ? `?mode=${normalizeCourseMode(modeParam)}` : '';
  const typingStats = useTypingStatsStore((s) => s.typingStats);
  const { maxCombo } = useComboStore();
  const [showCombo, setShowCombo] = useState(false);

  useEffect(() => {
    // 课程完成后显示最大连击
    if (maxCombo > 0) {
      setShowCombo(true);
    }
  }, [maxCombo]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 animate-fade-in">
      <div className="max-w-md text-center space-y-6">
        <div className="text-6xl">&#127881;</div>
        <h1 className="text-3xl font-bold text-primary-300">
          课程完成！
        </h1>
        <p className="text-gray-400">
          恭喜你完成了这门课程的所有步骤！继续加油，坚持练习。
        </p>

        {/* 统计数据展示 */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {/* 最大连击 */}
          {showCombo && maxCombo > 0 && (
            <div className="flex flex-col items-center p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
              <div className="text-2xl font-bold text-primary-400">x{maxCombo}</div>
              <div className="text-xs text-gray-400 mt-1">最大连击</div>
            </div>
          )}
          {/* 平均 WPM */}
          {typingStats.wpm > 0 && (
            <div className="flex flex-col items-center p-4 rounded-lg bg-success-500/10 border border-success-500/20">
              <div className="text-2xl font-bold text-success-400">{typingStats.wpm}</div>
              <div className="text-xs text-gray-400 mt-1">平均 WPM</div>
            </div>
          )}
          {/* 准确率 */}
          {typingStats.totalKeystrokes > 0 && (
            <div className={`flex flex-col items-center p-4 rounded-lg border ${typingStats.accuracy >= 90
                ? 'bg-success-500/10 border-success-500/20'
                : 'bg-warning-500/10 border-warning-500/20'
              }`}>
              <div className={`text-2xl font-bold ${typingStats.accuracy >= 90 ? 'text-success-400' : 'text-warning-400'}`}>
                {typingStats.accuracy}%
              </div>
              <div className="text-xs text-gray-400 mt-1">准确率</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            to={`/courses${coursesQuery}`}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            继续学习
          </Link>
          <Link
            to="/"
            className="px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg font-medium transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
