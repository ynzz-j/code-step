import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * 路由级错误边界：页面渲染崩溃时给出可恢复的降级 UI，而不是整窗白屏。
 * （学习中心曾因 hooks 顺序错误全屏白屏——这类单页崩溃应被隔离在这里。）
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] 页面渲染崩溃:', error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleBackHome = (): void => {
    this.setState({ error: null });
    window.location.hash = '';
    window.location.assign('/');
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="w-14 h-14 mb-4 rounded-2xl bg-error-500/10 border border-error-500/30 flex items-center justify-center">
            <svg className="w-7 h-7 text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">这个页面出了点问题</h2>
          <p className="text-sm text-text-secondary mb-1">其他页面不受影响，可以从下面的按钮恢复。</p>
          {this.state.error.message && (
            <pre className="mt-3 mb-5 max-w-lg overflow-auto text-left text-[10px] text-text-muted bg-bg-panel border border-gray-700/50 rounded-tool p-3 whitespace-pre-wrap">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={() => this.setState({ error: null })}
              className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-400 text-white rounded-tool font-medium transition-colors"
            >
              重试
            </button>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 text-sm border border-gray-600/60 text-text-secondary hover:text-text-primary rounded-tool transition-colors"
            >
              重新加载页面
            </button>
            <button
              onClick={this.handleBackHome}
              className="px-4 py-2 text-sm border border-gray-600/60 text-text-secondary hover:text-text-primary rounded-tool transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
