import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, type ReactNode } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { getSoundStatus, setSoundEnabled } from '@/utils/soundEffects';
import { useUserStore } from '@/stores/userStore';

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/about', label: '理念' },
  { path: '/courses', label: '课程' },
  { path: '/user-center', label: '学习中心' },
];

export function Header() {
  const location = useLocation();
  const [soundOn, setSoundOn] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const displayName = useUserStore((s) => s.displayName);

  useEffect(() => {
    setSoundOn(getSoundStatus().enabled);
  }, []);

  // 无边框窗口：跟踪最大化状态（浏览器 dev 环境下 API 不可用，静默忽略）
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let disposed = false;
    try {
      const win = getCurrentWindow();
      win.isMaximized().then((v) => { if (!disposed) setIsMaximized(v); }).catch(() => {});
      win.onResized(async () => {
        try { setIsMaximized(await win.isMaximized()); } catch { /* ignore */ }
      }).then((fn) => { if (disposed) fn(); else unlisten = fn; }).catch(() => {});
    } catch {
      /* browser dev */
    }
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // 课程入口默认进入 typing；coding 仍保留为后续开放的直达空状态。
  const coursesTo = '/courses?mode=typing';

  const winButton = (title: string, onClick: () => void, children: ReactNode, danger = false) => (
    <button
      onClick={onClick}
      title={title}
      className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
        danger
          ? 'text-text-secondary hover:text-white hover:bg-error-500'
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/70'
      }`}
    >
      {children}
    </button>
  );

  return (
    <header
      data-tauri-drag-region
      className="flex items-center justify-between px-6 py-2.5 bg-bg-panel/60 border-b border-primary-500/10 backdrop-blur-sm select-none"
    >
      <div data-tauri-drag-region className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5" data-tauri-drag-region>
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-orange-500 flex items-center justify-center shadow-md shadow-primary-500/30">
            <svg className="text-bg-app" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6l-5 6 5 6" />
              <path d="M16 6l5 6-5 6" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight" data-tauri-drag-region>
            <span className="text-text-primary">Code</span><span className="text-primary-400">Step</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const to = link.path === '/courses' ? coursesTo : link.path;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={to}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-primary-500/15 text-primary-300 border border-primary-500/25'
                    : 'text-text-secondary border border-transparent hover:text-text-primary hover:bg-bg-surface/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-hand text-sm text-primary-300/70 hidden md:block" data-tauri-drag-region aria-hidden="true">
          每天一点，更强的自己。
        </span>
        <Link
          to="/user-center"
          title={`${displayName} · 学习中心`}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-orange-500 flex items-center justify-center text-xs font-bold text-bg-app shadow-sm shadow-primary-500/25 hover:shadow-primary-500/60 transition-shadow"
        >
          {(displayName || 'C').slice(0, 1).toUpperCase()}
        </Link>
        <button
          onClick={toggleSound}
          title={soundOn ? '关闭音效' : '开启音效'}
          className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-surface/70 transition-colors"
        >
          {soundOn ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 010 7.07" />
              <path d="M19.07 4.93a10 10 0 010 14.14" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M23 9l-6 6" />
              <path d="M17 9l6 6" />
            </svg>
          )}
        </button>
        <span className="text-xs text-text-disabled">v{__APP_VERSION__}</span>

        {/* 无边框窗口控制（最小化 / 最大化 / 退出） */}
        <div className="flex items-center gap-0.5 ml-1 pl-2 border-l border-gray-700/50">
          {winButton('最小化', () => getCurrentWindow().minimize().catch((e) => console.warn('[Window] minimize:', e)), (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          ))}
          {winButton(isMaximized ? '向下还原' : '最大化', () => getCurrentWindow().toggleMaximize().catch((e) => console.warn('[Window] toggleMaximize:', e)), isMaximized ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <path d="M9 9V5h10v10h-4" />
              <rect x="5" y="9" width="10" height="10" rx="1" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <rect x="5" y="5" width="14" height="14" rx="1" />
            </svg>
          ))}
          {winButton('退出 CodeStep', () => getCurrentWindow().close().catch((e) => console.warn('[Window] close:', e)), (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ), true)}
        </div>
      </div>
    </header>
  );
}
