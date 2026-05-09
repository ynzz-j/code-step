import { Link } from 'react-router-dom';

export function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 animate-fade-in">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          CodeStep
        </h1>
        <p className="text-xl text-gray-300">
          一步步学编程，在 AI 时代打牢编程基础
        </p>
        <p className="text-gray-400 leading-relaxed">
          通过「逐步显示、手敲代码、即时验证」的学习模式，
          帮助你建立真正的编程能力和肌肉记忆。
        </p>
        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <Link
            to="/courses?mode=coding"
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            编程模式
          </Link>
          <Link
            to="/courses?mode=typing"
            className="px-6 py-3 bg-success-500 hover:bg-success-600 text-white rounded-lg font-medium transition-colors"
          >
            打字模式
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg font-medium transition-colors"
          >
            了解更多
          </Link>
        </div>
      </div>
    </div>
  );
}
