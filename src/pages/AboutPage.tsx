import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playSound } from '@/utils/soundEffects';

const values = [
  {
    icon: '🎯',
    title: '回归本质',
    description: '在 AI 时代回归编程动手实践的本质',
    color: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    icon: '⚡',
    title: '即时反馈',
    description: '逐字符验证，立即看到对错',
    color: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20 hover:border-green-500/40',
  },
  {
    icon: '⌨️',
    title: '肌肉记忆',
    description: '通过打字练习建立代码书写习惯',
    color: 'from-yellow-500/10 to-amber-500/10',
    border: 'border-yellow-500/20 hover:border-yellow-500/40',
  },
  {
    icon: '📈',
    title: '循序渐进',
    description: '分解复杂概念为小步骤，步步为营',
    color: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/20 hover:border-purple-500/40',
  },
];

export function AboutPage() {
  const [showItems, setShowItems] = useState<boolean[]>([]);

  useEffect(() => {
    // 逐个显示卡片
    values.forEach((_, i) => {
      setTimeout(() => {
        setShowItems(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 150 * i);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 animate-fade-in overflow-hidden">
      {/* 微弱背景光晕 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-10">
        {/* 标题区 */}
        <div className="text-center space-y-4 animate-slide-up-fade">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            学习理念
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">
            CodeStep 的灵感来源于语言学习应用 Duolingo，但专注于编程教育。
            我们相信，即使在 AI 辅助编程的时代，扎实的编程基础仍然不可或缺。
          </p>
        </div>

        {/* 理念卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map((value, i) => (
            <div
              key={value.title}
              className={`p-6 rounded-2xl bg-gradient-to-br ${value.color} border ${value.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                showItems[i] ? 'animate-slide-up-fade' : 'opacity-0'
              }`}
              style={{ animationDelay: showItems[i] ? `${i * 150}ms` : '0ms' }}
            >
              <div className="text-3xl mb-3">{value.icon}</div>
              <h3 className="text-lg font-bold text-gray-100 mb-2">{value.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-4 animate-slide-up-fade" style={{ animationDelay: `${values.length * 150 + 200}ms` }}>
          <Link
            to="/courses?mode=typing"
            onClick={() => playSound('click')}
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95"
          >
            开始打字训练 →
          </Link>
        </div>
      </div>
    </div>
  );
}
