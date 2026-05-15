import { Link } from 'react-router-dom';
import { playSound } from '@/utils/soundEffects';

const principles = [
  {
    title: '代码必须经过手',
    description: 'AI 可以补全答案，但语法节奏、符号位置、常见结构仍需要身体记住。CodeStep 让高频代码模式反复经过你的手指。',
    tone: 'text-accent-primary',
  },
  {
    title: '短循环优于长章节',
    description: '默认训练以 30 秒到 3 分钟为单位。每轮只练一个明确模式，降低启动成本，也更容易复刷。',
    tone: 'text-accent-success',
  },
  {
    title: '反馈服务于专注',
    description: 'WPM、准确率、Combo 和弱点 token 都是为了帮助下一轮更准，不是为了制造噪音。',
    tone: 'text-accent-record',
  },
];

const loopSteps = [
  { label: '选模式', detail: '选择一个高频训练包' },
  { label: '跟敲', detail: '逐字符输入真实代码片段' },
  { label: '反馈', detail: '看到 WPM、准确率和错误 token' },
  { label: '复刷', detail: '再来一轮，把动作练顺' },
];

const boundaries = [
  '不是传统章节课，不把课程目录当成核心体验。',
  '不是炫技打字游戏，动效和音效只在关键反馈里出现。',
  '不是替代 AI，而是补上 AI 无法替你形成的手感。',
];

function PrincipleIcon({ tone }: { tone: string }) {
  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-tool border border-current/20 bg-current/10 ${tone}`}>
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.25-4.25A9 9 0 1112 3v4.5" />
      </svg>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="h-full overflow-y-auto bg-bg-app px-6 py-8 animate-fade-in">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="space-y-4">
          <div className="inline-flex items-center rounded-brand border border-primary-500/25 bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-300">
            CodeStep 理念
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl">
                训练代码手感，而不只是看懂代码。
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
                CodeStep 面向已经开始写代码、但还想把常用结构写得更稳的人。它把真实开发里的高频片段拆成短训练包，
                让你通过重复跟敲建立肌肉记忆：更少犹豫，更少符号错误，更快进入编码状态。
              </p>
            </div>
            <div className="rounded-tool border border-gray-700/40 bg-bg-panel p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-text-muted">当前产品重心</div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="text-xl font-bold text-text-primary">Typing Loop</div>
                  <div className="mt-1 text-xs text-text-muted">高频代码片段 · 即时反馈 · 可复刷</div>
                </div>
                <Link
                  to="/courses?mode=typing"
                  onClick={() => playSound('click')}
                  className="inline-flex w-full items-center justify-center rounded-tool bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
                >
                  开始训练
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-tool border border-gray-700/40 bg-bg-panel p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">训练循环</h2>
              <p className="mt-1 text-xs text-text-muted">每一轮都围绕一个具体代码动作展开。</p>
            </div>
            <span className="rounded bg-bg-app px-2 py-1 text-[10px] font-medium text-text-muted">
              30s / 3min / Challenge
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {loopSteps.map((step, index) => (
              <div key={step.label} className="rounded-tool border border-gray-700/35 bg-bg-app/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-primary-500/15 text-xs font-bold text-primary-300">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary">{step.label}</h3>
                </div>
                <p className="text-xs leading-5 text-text-muted">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-text-primary">设计原则</h2>
            <p className="mt-1 text-xs text-text-muted">界面和功能都围绕训练效率做取舍。</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {principles.map((item) => (
              <div key={item.title} className="rounded-tool border border-gray-700/40 bg-bg-panel p-4">
                <PrincipleIcon tone={item.tone} />
                <h3 className="mt-4 text-sm font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-xs leading-6 text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-tool border border-gray-700/40 bg-bg-panel p-5">
            <h2 className="text-lg font-semibold text-text-primary">我们刻意不做什么</h2>
            <div className="mt-4 space-y-3">
              {boundaries.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-text-muted" />
                  <p className="text-xs leading-6 text-text-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-tool border border-primary-500/25 bg-primary-500/5 p-5">
            <h2 className="text-lg font-semibold text-text-primary">下一步会变得更具体</h2>
            <p className="mt-3 text-xs leading-6 text-text-muted">
              当前版本先打磨 JavaScript、Python 和 Spring 的训练体验。后续会补齐 React Hooks、SQL Join、Vim Motion 等更具传播性的高频训练包，
              并把弱点 token、熟练度趋势和复刷建议做得更精确。
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['React Hooks', 'SQL Join', 'Vim Motion'].map((item) => (
                <span key={item} className="rounded-brand border border-primary-500/20 bg-bg-app px-2.5 py-1 text-[10px] font-medium text-primary-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
