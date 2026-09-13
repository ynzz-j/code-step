interface LanguageIconProps {
  language: string;
  /** 像素字号（字体图标随字号缩放） */
  size?: number;
  className?: string;
}

/** devicon 字形名（字体子集定义见 index.css 的 devicon 段） */
const GLYPHS: Record<string, string> = {
  javascript: 'javascript-plain',
  typescript: 'typescript-original',
  python: 'python-plain',
  java: 'java-plain',
  cpp: 'cplusplus-plain',
  vim: 'vim-plain',
  react: 'react-plain',
};

/**
 * 语言官方图标（devicon 字体子集，MIT）：品牌原色，随字号缩放。
 */
export function LanguageIcon({ language, size = 24, className = '' }: LanguageIconProps) {
  const glyph = GLYPHS[language];

  if (glyph) {
    return <i className={`devicon devicon-${glyph} colored ${className}`} style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true" />;
  }

  if (language === 'sql') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
        strokeLinecap="round"
        className={className}
        aria-hidden="true"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14a9 3 0 0 0 18 0V5" />
        <path d="M3 12a9 3 0 0 0 18 0" />
      </svg>
    );
  }

  return (
    <span className={`font-mono text-text-secondary ${className}`} style={{ fontSize: size * 0.5 }} aria-hidden="true">
      {language.slice(0, 2).toUpperCase()}
    </span>
  );
}

interface LanguageTileProps {
  language: string;
  /** 方块边长 */
  size?: number;
  className?: string;
}

/** 深色中性底座 + 官方图标（品牌原色在暗底上最清晰） */
export function LanguageTile({ language, size = 48, className = '' }: LanguageTileProps) {
  return (
    <div
      className={`rounded-xl border border-gray-600/40 bg-bg-surface/80 flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <LanguageIcon language={language} size={Math.round(size * 0.58)} />
    </div>
  );
}
