import { Link } from 'react-router-dom';

export function CompletePage() {
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
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            to="/courses"
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
