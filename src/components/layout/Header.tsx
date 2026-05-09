import { Link, useLocation } from 'react-router-dom';
import { isCourseMode } from '@/services/courseService';

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/about', label: '理念' },
  { path: '/courses', label: '课程' },
  { path: '/user-center', label: '学习中心' },
];

export function Header() {
  const location = useLocation();

  // 如果当前 URL 已经带 mode=X，点击"课程"时透传该参数
  const params = new URLSearchParams(location.search);
  const modeParam = params.get('mode');
  const coursesTo = isCourseMode(modeParam) ? `/courses?mode=${modeParam}` : '/courses';

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary-400">CodeStep</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const to = link.path === '/courses' ? coursesTo : link.path;
            return (
              <Link
                key={link.path}
                to={to}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">v0.1.0</span>
      </div>
    </header>
  );
}
