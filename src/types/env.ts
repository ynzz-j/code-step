/**
 * 编程环境检测相关类型
 */

export interface EnvCheckResult {
  language: string;
  available: boolean;
  version: string | null;
  runtime_path: string | null;
  error_message: string | null;
  checked_at: string;
}

export interface EnvStatus {
  // 各语言环境状态，key: language (java/python/javascript/cpp)
  [language: string]: EnvCheckResult | undefined;
}

/** 降级模式信息 */
export interface DegradedModeInfo {
  originalStepType: 'coding';
  degradedTo: 'typing';
  reason: string;
  language: string;
}

/** 安装引导链接 */
export const INSTALL_GUIDE_URLS: Record<string, string> = {
  java: 'https://adoptium.net/（推荐 JDK 17+）',
  python: 'https://www.python.org/downloads/',
  javascript: 'https://nodejs.org/',
  cpp: 'https://code.visualstudio.com/docs/cpp/config-mingw',
};
