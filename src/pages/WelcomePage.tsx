import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playSound } from '@/utils/soundEffects';

export function WelcomePage() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; duration: number }>>([]);

  // 生成背景粒子
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const handleButtonClick = (mode: string) => {
    playSound('click');
    console.log(`Selected mode: ${mode}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full px-8 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* 背景粒子 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* 主内容 */}
      <div className="relative z-10 max-w-4xl text-center space-y-8 animate-fade-in">
        {/* Logo + 标题 */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/25 animate-pulse-slow">
              CS
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
            CodeStep
          </h1>
          <p className="text-xl text-gray-300 font-light">
            用高频代码片段建立编程肌肉记忆
          </p>
        </div>

        {/* 特性介绍 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {[
            { icon: '🎯', title: '短片段循环', desc: '用 30 秒节奏反复练习常用写法' },
            { icon: '⌨️', title: '逐字跟敲', desc: '把语法和符号变成自然动作' },
            { icon: '✅', title: '即时反馈', desc: '错误、准确率和连击实时反馈' },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-blue-500/30 hover:bg-gray-800/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-sm font-semibold text-gray-200 mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* 模式选择按钮 */}
        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <Link
            to="/courses?mode=typing"
            onClick={() => handleButtonClick('typing')}
            className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.1-2.846a4.5 4.5 0 00-1.7-1.7L5.25 15l2.846-.1a4.5 4.5 0 001.7-1.7L9.75 11l2.846.1a4.5 4.5 0 001.7 1.7L15 14.25l-2.846.1a4.5 4.5 0 00-1.7 1.7zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 11-1.676-1.676L14.25 9l1.035-.259a3.375 3.375 0 111.676-1.676L17.25 6l-.259 1.035a3.375 3.375 0 001.676 1.68z" />
            </svg>
            开始打字训练
          </Link>

          <div
            className="px-8 py-4 border border-gray-700/70 bg-gray-800/40 text-gray-400 rounded-xl font-medium flex items-center gap-2 cursor-not-allowed"
            aria-disabled="true"
            title="编程实战模式后续开放，当前先专注肌肉记忆训练。"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            编程实战 Coming Soon
          </div>

          <Link
            to="/about"
            onClick={() => handleButtonClick('about')}
            className="px-8 py-4 border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-medium transition-all duration-300 hover:bg-gray-800/50 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            了解更多
          </Link>
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Typing 优先</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>即时反馈</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.1-2.846a4.5 4.5 0 00-1.7-1.7L5.25 15l2.846-.1a4.5 4.5 0 001.7-1.7L9.75 11l2.846.1a4.5 4.5 0 001.7 1.7L15 14.25l-2.846.1a4.5 4.5 0 00-1.7 1.7z" />
            </svg>
            <span>多语言支持</span>
          </div>
        </div>
      </div>
    </div>
  );
}
