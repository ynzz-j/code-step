export function AboutPage() {
  const values = [
    {
      title: '回归本质',
      description: '在 AI 时代回归编程动手实践的本质',
    },
    {
      title: '即时反馈',
      description: '逐字符验证，立即看到对错',
    },
    {
      title: '肌肉记忆',
      description: '通过打字练习建立代码书写习惯',
    },
    {
      title: '循序渐进',
      description: '分解复杂概念为小步骤，步步为营',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 animate-fade-in">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold text-center">学习理念</h1>
        <p className="text-gray-400 text-center leading-relaxed">
          CodeStep 的灵感来源于语言学习应用 Duolingo，但专注于编程教育。
          我们相信，即使在 AI 辅助编程的时代，扎实的编程基础仍然不可或缺。
        </p>
        <div className="grid grid-cols-2 gap-6 pt-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50"
            >
              <h3 className="text-lg font-semibold text-primary-300 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-400 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
