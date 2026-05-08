# CodeStep - 编程学习应用架构设计文档

> 版本：V1.3 | 日期：2026-05-08 | 状态：更新中
>
> **V1.3 变更摘要**：新增音游风格连击系统
> **V1.2 变更摘要**：新增课程分类体系、编程环境检测与模式降级、用户学习中心三大特性

---

## 一、项目概述

### 1.1 产品定位

CodeStep 是一款面向编程初学者的桌面学习应用，通过「逐步显示、手敲代码、即时验证」的学习模式，帮助用户在 AI 时代打牢编程基础。灵感来源于语言学习应用 Duolingo，但专注于编程教育。

### 1.2 核心价值

| 价值主张 | 说明 |
|---------|------|
| 回归本质 | 在 AI 时代回归编程动手实践的本质 |
| 即时反馈 | 逐字符验证，立即看到对错 |
| 肌肉记忆 | 通过打字练习建立代码书写习惯 |
| 循序渐进 | 分解复杂概念为小步骤，步步为营 |

### 1.3 目标用户

- 零基础编程学习者
- 想转行做程序员的其他行业从业者
- 计算机专业在读学生
- 希望巩固基础的开发者

---

## 二、技术架构总览

### 2.1 技术栈

```
┌─────────────────────────────────────────────────────────┐
│                    Tauri 桌面应用                         │
├───────────────────────┬─────────────────────────────────┤
│     Frontend (WASM)   │      Backend (Rust)            │
├───────────────────────┼─────────────────────────────────┤
│  React 18 + TypeScript│  Tauri 2.x Framework           │
│  TailwindCSS 3.x      │  SQLite (rusqlite)             │
│  CodeMirror 6         │  Code Execution Engine         │
│  Monaco Editor         │  File System Access            │
│  Zustand (状态管理)    │  System Integration             │
│  React Router         │  Auto-updater                   │
└───────────────────────┴─────────────────────────────────┘
```

### 2.2 项目结构

```
codestep/
├── src/                          # React 前端源码
│   ├── assets/                   # 静态资源
│   ├── components/               # React 组件
│   │   ├── common/              # 通用组件 (Button, Card, Modal...)
│   │   ├── editor/              # 编辑器相关组件
│   │   │   ├── CodeEditor.tsx  # 主代码编辑器
│   │   │   ├── TypingEditor.tsx # 打字练习编辑器
│   │   │   └── EditorToolbar.tsx
│   │   ├── learn/               # 学习界面组件
│   │   │   ├── LearnPage.tsx
│   │   │   ├── InstructionPanel.tsx
│   │   │   ├── ProgressDots.tsx
│   │   │   └── StatsPanel.tsx
│   │   ├── courses/             # [V1.2 扩展] 课程相关组件
│   │   │   ├── CategoryFilter.tsx   # [新增] 分类筛选器
│   │   │   └── CourseCard.tsx       # [改动] 显示分类标签
│   │   ├── env/                 # [V1.2 新增] 环境检测模块
│   │   │   ├── EnvCheckModal.tsx    # 环境检测弹窗
│   │   │   └── EnvStatusBadge.tsx   # 环境状态徽章
│   │   ├── user/                # [V1.2 新增] 用户中心组件
│   │   │   ├── ProgressDashboard.tsx # 学习进度看板
│   │   │   ├── CourseSummaryCard.tsx # 课程学习卡片
│   │   │   └── LearningCalendar.tsx  # 学习日历
│   │   └── layout/              # 布局组件
│   │       ├── AppShell.tsx
│   │       └── Header.tsx       # [改动] 增加用户中心入口
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useCourse.ts         # 课程状态管理
│   │   ├── useTypingStats.ts    # 打字统计
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useProgress.ts
│   │   └── useEnvCheck.ts       # [新增] 环境检测 Hook
│   ├── pages/                    # 页面组件
│   │   ├── WelcomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── CoursesPage.tsx      # [改动] 增加分类筛选
│   │   ├── LearnPage.tsx        # [改动] 增加环境检测入口
│   │   ├── UserCenterPage.tsx   # [新增] 用户中心页
│   │   └── CompletePage.tsx
│   ├── stores/                   # Zustand 状态管理
│   │   ├── courseStore.ts       # [改动] 增加分类筛选状态
│   │   ├── settingsStore.ts
│   │   ├── userStore.ts         # [改动] 增加进度摘要数据
│   │   └── envStore.ts          # [新增] 编程环境状态
│   ├── services/                 # 业务逻辑服务
│   │   ├── courseService.ts     # 课程加载/保存
│   │   ├── validationService.ts  # 代码验证
│   │   ├── statsService.ts      # 统计数据
│   │   └── envService.ts        # [新增] 环境检测服务
│   ├── types/                     # TypeScript 类型定义
│   │   ├── course.ts            # [改动] 增加 category 字段
│   │   ├── step.ts
│   │   ├── user.ts              # [改动] 增加学习摘要类型
│   │   └── env.ts               # [新增] 环境类型定义
│   ├── utils/                    # 工具函数
│   │   ├── editor.ts
│   │   └── constants.ts
│   ├── App.tsx                   # 根组件
│   ├── main.tsx                  # 入口文件
│   └── index.css                 # 全局样式
├── src-tauri/                    # Rust 后端源码
│   ├── src/
│   │   ├── main.rs              # 入口
│   │   ├── lib.rs               # 库入口
│   │   ├── commands/            # Tauri 命令
│   │   │   ├── mod.rs
│   │   │   ├── course.rs        # [改动] 增加分类查询
│   │   │   ├── progress.rs      # [改动] 增加摘要查询
│   │   │   ├── executor.rs      # 代码执行器
│   │   │   ├── settings.rs      # 设置管理
│   │   │   ├── env_checker.rs   # [新增] 环境检测命令
│   │   │   └── user_center.rs   # [新增] 用户中心命令
│   │   ├── models/              # 数据模型
│   │   │   ├── mod.rs
│   │   │   ├── course.rs        # [改动] 增加 category
│   │   │   ├── step.rs
│   │   │   ├── user_progress.rs # [改动] 增加 summary
│   │   │   └── env_status.rs    # [新增] 环境状态模型
│   │   ├── db/                   # 数据库操作
│   │   │   ├── mod.rs
│   │   │   ├── schema.rs        # [改动] 新增表/字段
│   │   │   └── migrations/      # [改动] 新增 V2 迁移脚本
│   │   ├── executor/             # 代码执行引擎
│   │   │   ├── mod.rs
│   │   │   ├── java.rs
│   │   │   ├── python.rs
│   │   │   └── sandbox.rs
│   │   └── utils/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── build.rs
│   └── icons/
├── courses/                      # 课程内容目录
├── locales/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── SPEC.md
```

---

## 三、模块架构设计

### 3.1 前端模块架构

#### 3.1.1 组件层级（V1.2 更新）

```
AppShell (应用外壳)
├── Header (顶部导航栏)
│   ├── Logo
│   ├── NavLinks
│   ├── UserAvatar → UserCenterPage  # [新增] 用户中心入口
│   └── WindowControls
├── MainContent (主内容区)
│   ├── WelcomePage (首页)
│   ├── AboutPage (理念页)
│   ├── CoursesPage (课程列表)       # [改动]
│   │   ├── CategoryFilter           # [新增] 分类筛选组件
│   │   │   ├── CategoryTab (全部/前端/后端/算法...)
│   │   │   └── LanguageFilter (Java/Python/JS...)
│   │   └── CourseCard               # [改动] 含 category badge
│   ├── LearnPage (学习界面)          # [改动]
│   │   ├── InstructionPanel
│   │   ├── EditorPanel
│   │   │   ├── OutputTerminal
│   │   │   ├── StatsPanel
│   │   │   ├── CodeEditor           # coding 模式（需环境）
│   │   │   ├── TypingEditor         # typing 模式（无需环境）
│   │   │   └── EditorToolbar
│   │   ├── FeedbackArea
│   │   ├── NavigationBar
│   │   └── ProgressDots
│   ├── UserCenterPage               # [新增] 用户中心
│   │   ├── UserProfileHeader
│   │   ├── ProgressDashboard        # 学习进度总览
│   │   │   ├── CourseSummaryCard    # 每门课程卡片
│   │   │   ├── LearningCalendar     # 学习日历热力图
│   │   │   └── StatsOverview        # 总计统计
│   │   └── AchievementList
│   └── CompletePage (完成页)
├── EnvCheckModal (环境检测弹窗)      # [新增] 全局弹窗
└── Footer (可选)
```

#### 3.1.2 状态管理（Zustand，V1.2 更新）

```typescript
// stores/courseStore.ts [改动]
interface CourseStore {
  // 课程列表
  courses: Course[];
  filteredCourses: Course[];       // 筛选后的课程列表

  // 分类筛选状态 [新增]
  selectedCategory: CourseCategory | 'all';
  selectedLanguage: string | 'all';

  // 当前课程状态
  currentCourse: Course | null;
  currentStepIndex: number;
  completedSteps: Set<number>;

  // Actions
  loadCourses: () => Promise<void>;
  setCategory: (category: CourseCategory | 'all') => void;  // [新增]
  setLanguage: (lang: string | 'all') => void;              // [新增]
  startCourse: (courseId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (index: number) => void;
  resetProgress: () => void;
}

// stores/envStore.ts [新增]
interface EnvStore {
  // 各语言环境状态
  envStatus: Record<string, EnvCheckResult>;
  isChecking: boolean;
  lastCheckedAt: Date | null;

  // Actions
  checkEnv: (language: string) => Promise<EnvCheckResult>;
  checkAllEnvs: () => Promise<void>;
  clearCache: () => void;
}

// stores/settingsStore.ts [不变]
interface SettingsStore {
  theme: 'dark' | 'light' | 'system';
  fontSize: number;
  tabSize: number;
  autoValidate: boolean;
  autoValidateDelay: number;
  focusModeShortcut: string;

  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// stores/userStore.ts [改动]
interface UserStore {
  userId: string;
  displayName: string;
  totalLearningTime: number;
  completedCourses: string[];
  stepStats: StepStats[];

  // 学习摘要 [新增]
  learningSummary: LearningSummary;

  // 成就系统
  achievements: Achievement[];

  // Actions
  updateStats: (stats: Partial<StepStats>) => void;
  unlockAchievement: (achievementId: string) => void;
  fetchLearningSummary: () => Promise<void>;  // [新增]
}
```

### 3.2 后端模块架构（Rust，V1.2 更新）

#### 3.2.1 命令层（Tauri Commands）

```rust
// commands/course.rs [改动]
#[tauri::command]
pub async fn get_courses() -> Result<Vec<Course>, String> { }

#[tauri::command]
pub async fn get_courses_by_category(
    category: Option<String>,   // [新增] 分类过滤
    language: Option<String>,   // [新增] 语言过滤
) -> Result<Vec<Course>, String> { }

// commands/env_checker.rs [新增]
#[tauri::command]
pub async fn check_env(language: String) -> Result<EnvCheckResult, String> {
    // 检测指定语言的运行环境
}

#[tauri::command]
pub async fn check_all_envs() -> Result<HashMap<String, EnvCheckResult>, String> {
    // 批量检测所有支持语言的环境
}

// commands/user_center.rs [新增]
#[tauri::command]
pub async fn get_learning_summary() -> Result<LearningSummary, String> {
    // 获取用户学习进度总览
}

#[tauri::command]
pub async fn get_course_progress_detail(
    course_id: String,
) -> Result<CourseProgressDetail, String> {
    // 获取单门课程详细进度
}

// commands/progress.rs [改动]
#[tauri::command]
pub async fn save_progress(
    course_id: String,
    step_index: u32,
    completed: bool,
) -> Result<(), String> { }

#[tauri::command]
pub async fn get_user_progress() -> Result<UserProgress, String> { }

#[tauri::command]
pub async fn get_learning_calendar(
    year: u32,
    month: u32,
) -> Result<Vec<LearningDay>, String> { }  // [新增] 日历热力图数据
```

---

## 四、核心功能详细设计

### 4.1 课程分类体系（V1.2 新增）

#### 4.1.1 分类体系设计

课程采用**双维度分类**：
- **学科分类（category）**：按学习方向划分，用于宏观导航
- **编程语言（language）**：按语言筛选，对应编程环境

```typescript
// types/course.ts [改动]
type CourseCategory =
  | 'fundamentals'   // 编程基础
  | 'frontend'       // 前端开发
  | 'backend'        // 后端开发
  | 'algorithms'     // 数据结构与算法
  | 'database'       // 数据库
  | 'devtools';      // 开发工具

interface Course {
  id: string;
  title: string;
  description: string;
  language: string;             // java | python | javascript | ...
  category: CourseCategory;     // [新增] 学科分类
  tags: string[];               // [新增] 辅助标签
  difficulty: Difficulty;
  concepts: Vec<String>;
  steps: Vec<Step>;
  estimatedTime: number;
  thumbnail?: string;           // [新增] 课程封面
  prerequisites?: string[];     // [新增] 前置课程 ID
}
```

```rust
// models/course.rs [改动]
#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
pub enum CourseCategory {
    Fundamentals,
    Frontend,
    Backend,
    Algorithms,
    Database,
    DevTools,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Course {
    pub id: String,
    pub title: String,
    pub description: String,
    pub language: String,
    pub category: CourseCategory,  // [新增]
    pub tags: Vec<String>,         // [新增]
    pub difficulty: Difficulty,
    pub concepts: Vec<String>,
    pub steps: Vec<Step>,
    pub estimated_time: u32,
    pub thumbnail: Option<String>, // [新增]
    pub prerequisites: Vec<String>,// [新增]
}
```

#### 4.1.2 课程内容格式（V1.2 更新）

```json
// course.json [改动]
{
  "id": "java-hello",
  "title": "Java 入门：Hello World",
  "description": "学习 Java 程序的基本结构，写出你的第一个程序",
  "language": "java",
  "category": "fundamentals",
  "tags": ["入门", "Hello World", "基础语法"],
  "difficulty": "beginner",
  "concepts": ["基础语法", "main 方法", "输出语句"],
  "estimatedMinutes": 15,
  "thumbnail": "assets/java-hello.png",
  "prerequisites": [],
  "steps": [
    "steps/step-01.json",
    "steps/step-02.json"
  ]
}
```

#### 4.1.3 分类筛选 UI 设计

```
┌─────────────────────────────────────────────────────────────────┐
│  课程列表                                                        │
├─────────────────────────────────────────────────────────────────┤
│  学科分类：[全部] [编程基础] [前端] [后端] [算法] [数据库]         │
│  编程语言：[全部] [Java] [Python] [JavaScript] [C++]             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ [编程基础]    │  │ [前端]       │  │ [算法]        │          │
│  │ Java 入门    │  │ HTML/CSS     │  │ 排序算法      │           │
│  │ ★★☆☆☆       │  │ ★★★☆☆       │  │ ★★★★☆        │          │
│  │ 15min  0/8步 │  │ 20min  0/12步│  │ 30min  0/15步│           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.2 编程环境检测（V1.2 新增）

#### 4.2.1 设计决策（ADR-001）

```
# ADR-001: 编程环境检测触发时机

## Status
Accepted

## Context
coding 模式需要调用系统已安装的编程语言运行时（如 javac/java、python3）。
用户可能未安装对应环境，需在进入 coding 步骤前完成检测，避免运行时报错。

## Decision
采用"延迟检测"策略：
1. 课程列表页：展示每门课程所需环境，不强制检测
2. 点击"开始课程"时：触发对应语言环境检测（带 1~2s 缓存）
3. 检测失败：弹出 EnvCheckModal，给出安装引导，并提供"仅使用 Typing 模式学习"降级选项
4. 检测结果缓存至 SQLite env_cache 表，TTL = 1小时，避免每次检测系统

## Consequences
+ 用户能立刻了解环境情况，不会在学习中途被打断
+ Typing 模式可在无环境时平稳降级，保留学习体验
- 一小时 TTL 可能导致用户安装环境后需等待或手动刷新
```

#### 4.2.2 环境检测流程

```
用户点击"开始课程"
        │
        ▼
  课程含 coding 步骤？
    │         │
   否         是
    │         ▼
    │    查询 env_cache (TTL 1h)
    │         │
    │    命中缓存？
    │      │     │
    │     是     否
    │      │     ▼
    │      │  调用 check_env(language)
    │      │     │
    │      └─────┘
    │         │
    │    检测通过？
    │      │     │
    │     是     否
    │      │     ▼
    │      │  EnvCheckModal 弹出
    │      │    ├── [去安装] → 打开安装引导链接
    │      │    └── [跳过，仅 Typing 模式] → 降级进入
    │      │
    ▼      ▼
   进入学习页（coding 或 typing 降级模式）
```

#### 4.2.3 数据模型

```rust
// models/env_status.rs [新增]
#[derive(Debug, Serialize, Deserialize)]
pub struct EnvCheckResult {
    pub language: String,
    pub available: bool,
    pub version: Option<String>,   // 如 "java 21.0.1"
    pub runtime_path: Option<String>,
    pub error_message: Option<String>,
    pub checked_at: DateTime<Utc>,
}

// 支持的检测方式
// Java:        javac --version + java --version
// Python:      python3 --version（fallback: python --version）
// JavaScript:  node --version
// C++:         g++ --version（fallback: clang++ --version）
```

```rust
// commands/env_checker.rs [新增]
#[tauri::command]
pub async fn check_env(language: String) -> Result<EnvCheckResult, String> {
    // 1. 先查缓存
    if let Some(cached) = db::get_env_cache(&language).await? {
        if cached.is_valid() { return Ok(cached.result); }
    }

    // 2. 执行检测
    let result = match language.as_str() {
        "java"       => detect_java().await,
        "python"     => detect_python().await,
        "javascript" => detect_node().await,
        "cpp"        => detect_cpp().await,
        _            => Err(format!("Unsupported language: {}", language)),
    }?;

    // 3. 写入缓存
    db::save_env_cache(&language, &result).await?;
    Ok(result)
}

async fn detect_java() -> Result<EnvCheckResult, String> {
    // 检测 javac 和 java 是否在 PATH 中
    let output = Command::new("javac")
        .arg("--version")
        .output()
        .map_err(|_| "javac not found".to_string())?;

    Ok(EnvCheckResult {
        language: "java".to_string(),
        available: output.status.success(),
        version: parse_version(&output.stdout),
        runtime_path: which::which("javac").ok().map(|p| p.display().to_string()),
        error_message: if output.status.success() { None }
                       else { Some("javac not found in PATH".to_string()) },
        checked_at: Utc::now(),
    })
}
```

#### 4.2.4 前端 EnvCheckModal

```typescript
// components/env/EnvCheckModal.tsx [新增]
interface EnvCheckModalProps {
  language: string;
  onConfirmInstall: () => void;   // 打开安装文档
  onSkipToTyping: () => void;     // 降级为 typing 模式
  onClose: () => void;
}

// 弹窗内容设计
// ┌──────────────────────────────────────────┐
// │  检测到未安装 Java 运行环境               │
// │                                          │
// │  coding 模式需要本地安装 Java (JDK 11+)   │
// │  才能运行和验证你编写的代码。              │
// │                                          │
// │  [查看安装指南 ↗]                         │
// │                                          │
// │  安装完成后请重新进入课程，               │
// │  检测结果将自动更新。                     │
// │                                          │
// │  ┌────────────────┐  ┌────────────────┐  │
// │  │  先跳过，用打字  │  │   去安装 Java  │  │
// │  │   模式练习      │  │               │  │
// │  └────────────────┘  └────────────────┘  │
// └──────────────────────────────────────────┘
```

#### 4.2.5 模式降级处理（LearnPage）

```typescript
// hooks/useEnvCheck.ts [新增]
function useEnvCheck(language: string) {
  const { envStatus, checkEnv } = useEnvStore();

  const envReady = envStatus[language]?.available ?? null;

  const effectiveMode = useCallback(
    (requestedMode: StepType): StepType => {
      // coding 步骤但环境不可用，降级为 typing
      if (requestedMode === 'coding' && envReady === false) {
        return 'typing';
      }
      return requestedMode;
    },
    [envReady]
  );

  return { envReady, effectiveMode, checkEnv };
}
```

**模式降级说明：**

| 步骤类型 | 环境状态 | 实际执行模式 | 说明 |
|---------|---------|------------|------|
| coding  | 可用    | coding     | 正常运行，可编译执行 |
| coding  | 不可用  | typing     | 降级为照打模式，无法验证输出 |
| typing  | 任意    | typing     | 不依赖环境，正常执行 |

> **架构权衡**：降级时 coding 步骤的 `validation` 语义改变（无法验证输出，只能验证打字完成）。这是有意为之的取舍——保留学习路径连续性优先于严格验证正确性。

---

### 4.3 用户学习中心（V1.2 新增）

#### 4.3.1 设计范围

用户中心聚焦**轻量化进度追踪**，不做社交/排行功能（Phase 2 再议）。

核心展示：
1. **学习总览**：累计时长、完成课程数、步骤数
2. **课程进度列表**：每门课的进度百分比、最后学习时间
3. **学习热力图**：近 3 个月每日学习情况（类 GitHub contribution graph）

#### 4.3.2 数据模型

```typescript
// types/user.ts [改动，新增 LearningSummary]
interface LearningSummary {
  totalMinutes: number;            // 总学习分钟数
  completedCourses: number;        // 完成课程数
  completedSteps: number;          // 完成步骤总数
  currentStreak: number;           // 当前连续学习天数
  longestStreak: number;           // 最长连续天数
  courseProgress: CourseSummary[]; // 各课程进度
  recentActivity: LearningDay[];   // 近期学习记录（热力图用）
}

interface CourseSummary {
  courseId: string;
  courseTitle: string;
  language: string;
  category: CourseCategory;
  totalSteps: number;
  completedSteps: number;
  progressPercent: number;         // 0~100
  lastStudiedAt: Date | null;
  completedAt: Date | null;
  timeSpentMinutes: number;
}

interface LearningDay {
  date: string;                    // YYYY-MM-DD
  minutesLearned: number;
  stepsCompleted: number;
}
```

```rust
// models/user_progress.rs [改动]
#[derive(Debug, Serialize, Deserialize)]
pub struct LearningSummary {
    pub total_minutes: u64,
    pub completed_courses: u32,
    pub completed_steps: u32,
    pub current_streak: u32,
    pub longest_streak: u32,
    pub course_progress: Vec<CourseSummary>,
    pub recent_activity: Vec<LearningDay>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LearningDay {
    pub date: String,             // YYYY-MM-DD
    pub minutes_learned: u32,
    pub steps_completed: u32,
}
```

#### 4.3.3 学习中心页面布局

```
┌─────────────────────────────────────────────────────────────────┐
│  用户中心                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  总学习时长      完成课程      完成步骤      连续学习             │
│  ┌─────────┐   ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │  12.5h  │   │    3    │  │   48    │  │  7 天   │          │
│  └─────────┘   └─────────┘  └─────────┘  └─────────┘          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  学习日历 (近 3 个月)                                            │
│  Mon  □ □ □ ■ □ □ □ □ ■ ■ ...                                  │
│  Wed  □ ■ □ □ ■ □ ■ □ ■ □ ...                                  │
│  Fri  ■ □ ■ □ □ ■ □ ■ □ ■ ...                                  │
│  (颜色深浅 = 当日学习时长)                                        │
├─────────────────────────────────────────────────────────────────┤
│  课程进度                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Java 入门    [编程基础]  ████████░░  80%   上次：今天     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Python 基础  [编程基础]  ████░░░░░░  40%   上次：2天前   │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 排序算法     [算法]      ██░░░░░░░░  20%   上次：5天前   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.3.4 进度计算逻辑

进度数据由 Rust 后端汇总计算，前端只展示。计算规则：

```rust
// commands/user_center.rs [新增]
#[tauri::command]
pub async fn get_learning_summary(
    state: tauri::State<'_, AppState>,
) -> Result<LearningSummary, String> {
    let db = &state.db;
    let user_id = get_current_user_id(db).await?;

    // 1. 聚合各课程进度
    let course_progress = db::get_all_course_progress(&user_id).await?;

    // 2. 计算连续学习天数（基于 step_stats.last_attempt 按日聚合）
    let streak = calc_streak(db, &user_id).await?;

    // 3. 近 90 天热力图数据
    let recent_activity = db::get_learning_days(db, &user_id, 90).await?;

    // 4. 汇总
    Ok(LearningSummary {
        total_minutes: course_progress.iter().map(|c| c.time_spent / 60).sum(),
        completed_courses: course_progress.iter()
            .filter(|c| c.completed_at.is_some()).count() as u32,
        completed_steps: course_progress.iter()
            .map(|c| c.completed_steps.len()).sum::<usize>() as u32,
        current_streak: streak.current,
        longest_streak: streak.longest,
        course_progress: course_progress.into_iter().map(CourseSummary::from).collect(),
        recent_activity,
    })
}
```

---

### 4.4 课程引擎（原有，保持不变）

#### 4.4.1 步骤类型定义

```typescript
// types/step.ts
type StepType = 'coding' | 'typing';

interface BaseStep {
  id: string;
  type: StepType;
  title: string;
  concept: string;
  difficulty: Difficulty;
  instruction: string;
  hint?: string;
}

interface CodingStep extends BaseStep {
  type: 'coding';
  starter?: string;
  answer: string;
  expectedOutput?: string;
  validation: ValidationRule;
}

interface TypingStep extends BaseStep {
  type: 'typing';
  targetCode: string;
  expectedOutput?: string;
}

type Step = CodingStep | TypingStep;
```

#### 4.4.2 步骤流转（V1.2 新增环境降级分支）

```
┌──────────────────────────────────────────────────────────────┐
│                        步骤状态机 (V1.2)                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   进入 coding 步骤                                           │
│       │                                                      │
│       ▼                                                      │
│   检查环境状态 (envStore)                                     │
│       │                                                      │
│   ┌───┴───┐                                                  │
│   环境OK   环境不可用                                         │
│   │        │                                                 │
│   ▼        ▼ (降级)                                          │
│  coding   typing (跳过执行验证，仅完成打字即通过)              │
│   模式     模式                                              │
│   │        │                                                 │
│   └───┬────┘                                                 │
│       ▼                                                      │
│  [进行中] ──完成──> [已完成]                                  │
│       ^                │                                     │
│       └────重试─────────┘ (未通过时)                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.5 代码执行引擎（原有，保持不变）

> 详见 V1.1 §4.3，无变更。

---

### 4.6 数据持久化（V1.2 更新）

#### 4.6.1 SQLite Schema（V2 迁移）

```sql
-- ============================================================
-- V2 Migration: 新增 env_cache 表，扩展 courses / step_stats 表
-- ============================================================

-- 1. courses 表增加 category、tags 字段
ALTER TABLE courses ADD COLUMN category TEXT DEFAULT 'fundamentals';
ALTER TABLE courses ADD COLUMN tags TEXT DEFAULT '[]';      -- JSON array
ALTER TABLE courses ADD COLUMN thumbnail TEXT;
ALTER TABLE courses ADD COLUMN prerequisites TEXT DEFAULT '[]'; -- JSON array

-- 2. 新增环境缓存表
CREATE TABLE IF NOT EXISTS env_cache (
    language    TEXT PRIMARY KEY,
    available   INTEGER NOT NULL,                    -- 0 | 1
    version     TEXT,
    runtime_path TEXT,
    error_msg   TEXT,
    checked_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 新增学习日历汇总表（按天聚合，避免每次全表扫描）
CREATE TABLE IF NOT EXISTS learning_daily_summary (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     TEXT NOT NULL,
    date        TEXT NOT NULL,                       -- YYYY-MM-DD
    minutes_learned INTEGER DEFAULT 0,
    steps_completed INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
);

-- 4. 原有表保持不变
-- users, course_progress, step_stats, achievements, settings

-- 索引优化
CREATE INDEX IF NOT EXISTS idx_learning_daily_user_date
    ON learning_daily_summary(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_course_progress_user
    ON course_progress(user_id, completed_at);
```

#### 4.6.2 数据更新时机

| 事件 | 触发操作 |
|-----|---------|
| 完成一个步骤 | `step_stats` 写入 + `learning_daily_summary` upsert |
| 课程完成 | `course_progress.completed_at` 写入 |
| 进入课程 | 检测环境 → 写/刷新 `env_cache` |
| 打开用户中心 | `get_learning_summary()` 聚合查询 |

---

### 4.7 音游风格连击系统（V1.3 新增）

#### 4.7.1 设计理念

受音游（如《节奏大师》《OSU!》）启发，设计**无等级、纯视觉冲击**的连击系统：
- 不设计等级机制和 XP 奖励，专注连击数的视觉反馈
- 记录两项数据：当前连击数（currentCombo）、最大连击数（maxCombo）
- 连击数通过动画和特效直观展示，营造音游般的沉浸感

#### 4.7.2 核心逻辑

```
正确输入 → 连击数 +1 → 触发数字放大动画
错误输入 → 连击数重置为 0 → 数字红色闪烁后消失
```

连击数仅在本课程内有效，课程完成后展示最大连击数。

#### 4.7.3 UI 设计

```
┌─────────────────────────────────────┐
│                                     │
│         ╔═════════════╗            │
│         ║  COMBO x27  ║  ← 大号数字，错误时红色闪烁后消失
│         ╚═════════════╝            │
│                                     │
│         public static void          │  ← 代码输入区
│           main(String[] args)        │
│                                     │
├─────────────────────────────────────┤
│  Combo最大: 45  │  当前: 27       │  ← 底部状态栏
└─────────────────────────────────────┘
```

#### 4.7.4 交互规则

| 事件 | 行为 |
|------|------|
| **正确输入** | Combo +1，数字放大弹跳动画 |
| **错误输入** | Combo 归零，数字**红色抖动**后消失，屏幕轻微震动 |
| **Combo ≥ 10** | 数字开始带**发光/描边**效果 |
| **Combo ≥ 30** | 数字放大到 1.5x，带**高亮光晕** |
| **打破最大记录** | 短暂显示 **"NEW BEST!"** 标签 |

#### 4.7.5 动画细节

```
正确输入：
  Combo 数字: scale(1.0) → scale(1.3) → scale(1.0)  // 弹跳
  颜色: 白 → 当前主题色 → 白

错误输入：
  Combo 数字: 变红 + 水平抖动 0.3s → 消失
  屏幕: 微震动（CSS shake）

打破记录：
  "NEW BEST!" 标签: 从顶部掉落 + 弹跳 + 2秒后淡出
```

#### 4.7.6 数据存储（极简）

```typescript
interface ComboState {
  currentCombo: number;   // 当前连击
  maxCombo: number;       // 最大连击（本次课程）
}
```

课程完成后展示：
```
┌───────────────┐
│   课程完成!    │
│               │
│  最大连击: 45  │  ← 高亮展示
│  平均WPM: 52   │
│  准确率: 96%   │
└───────────────┘
```

#### 4.7.7 状态管理（Zustand）

```typescript
// stores/courseStore.ts [改动]
interface CourseStore {
  // ... 现有字段 ...

  // 连击状态 [新增]
  currentCombo: number;
  maxCombo: number;

  // Actions [新增]
  incrementCombo: () => void;
  resetCombo: () => void;
  getMaxCombo: () => number;
}
```

#### 4.7.8 实现工作量

| 模块 | 内容 | 预计 |
|------|------|------|
| Store 新增状态 | currentCombo + maxCombo | 15min |
| Combo 显示组件 | 大号数字 + 动画 | 1h |
| 错误震动效果 | CSS shake | 30min |
| 课程完成页展示 | 最大连击数据 | 30min |
| **总计** | | **~2h** |

---

## 五、用户界面设计

### 5.1 页面结构（V1.2 更新）

```
┌─────────────────────────────────────────────────────────┐
│                    应用窗口框架                          │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │  标题栏                                           │  │
│  │  [─ □ ×]   CodeStep      [用户头像/进度]          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │  WelcomePage / CoursesPage / LearnPage /          │  │
│  │  UserCenterPage / CompletePage                    │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  状态栏: 学习进度 | WPM | 快捷键提示               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 5.2 学习界面布局（原有）

（保持 V1.1 §5.2 不变）

### 5.3 打字练习模式布局（原有）

（保持 V1.1 §5.3 不变）

---

## 六、窗口与系统集成（原有）

（保持 V1.1 §六 不变）

---

## 七、课程加载系统（原有）

（保持 V1.1 §七 不变）

---

## 八、课程内容格式（V1.2 更新）

### 8.1 课程元数据（course.json，V1.2 更新）

```json
{
  "id": "java-hello",
  "title": "Java 入门：Hello World",
  "description": "学习 Java 程序的基本结构，写出你的第一个程序",
  "language": "java",
  "category": "fundamentals",
  "tags": ["入门", "Hello World", "基础语法"],
  "difficulty": "beginner",
  "concepts": ["基础语法", "main 方法", "输出语句"],
  "estimatedMinutes": 15,
  "thumbnail": "assets/java-hello.png",
  "prerequisites": [],
  "steps": [
    "steps/step-01.json",
    "steps/step-02.json"
  ]
}
```

### 8.2 步骤文件格式（无变更）

（保持 V1.1 §8.2 不变）

---

## 九、成就系统设计（原有）

（保持 V1.1 §九 不变）

---

## 十、验收标准（V1.2 补充）

### 10.1 功能验收

**原有**
- [ ] 用户可以浏览课程列表并选择课程
- [ ] Coding 模式：用户可以自由编写代码并验证
- [ ] Typing 模式：用户可以照着敲代码，实时看到对错
- [ ] 进度自动保存，退出后恢复
- [ ] WPM 和准确率统计准确
- [ ] 键盘快捷键正常工作
- [ ] 专注模式正确隐藏/显示元素
- [ ] 课程完成后显示成就和统计

**V1.2 新增**
- [ ] 课程分类筛选正确过滤课程，"全部"时显示所有课程
- [ ] 开始含 coding 步骤的课程时触发环境检测
- [ ] 环境检测结果在 1 小时内命中缓存，不重复检测
- [ ] 环境不可用时，EnvCheckModal 正确弹出并引导用户
- [ ] 选择"跳过安装"后，coding 步骤降级为 typing 模式正常运行
- [ ] 用户中心正确显示总学习时长、完成课程数、连续学习天数
- [ ] 学习热力图正确反映近 3 个月的学习记录
- [ ] 每门课程的进度百分比计算正确

**V1.3 新增**
- [ ] 正确输入时连击数 +1，错误输入时重置为 0
- [ ] 连击数显示在代码输入区上方，字体大且醒目
- [ ] Combo ≥ 10 时数字带发光效果
- [ ] Combo ≥ 30 时数字放大并带高亮光晕
- [ ] 错误输入时屏幕轻微震动（shake 效果）
- [ ] 打破最大连击记录时显示 "NEW BEST!" 标签
- [ ] 课程完成页正确展示本次最大连击数

### 10.2 性能验收

- [ ] 应用启动时间 < 3 秒
- [ ] 页面切换动画流畅 (60fps)
- [ ] 打字输入延迟 < 16ms
- [ ] 代码验证响应时间 < 100ms
- [ ] 环境检测响应时间 < 2s（首次），< 50ms（缓存命中）
- [ ] 学习中心数据加载 < 500ms

### 10.3 安全验收

- [ ] 用户代码在沙箱中执行
- [ ] 执行超时设置为 5 秒
- [ ] 无法访问用户文件系统
- [ ] 无网络请求能力

---

## 十一、架构决策记录（ADRs）

### ADR-001：编程环境检测时机（见 §4.2.1）

### ADR-002：Coding 步骤降级策略

```
# ADR-002: Coding 步骤在无环境时的降级策略

## Status
Accepted

## Context
用户选择不安装编程环境，但课程中存在 coding 类型步骤。
需决定此时的行为：拒绝进入、隐藏 coding 步骤、还是降级执行。

## Decision
将 coding 步骤降级为 typing 模式执行：
- 显示目标代码（即 answer 字段内容）供用户照打
- 跳过代码执行和输出验证
- 通过条件：用户完整打完 answer 代码
- 界面显示提示 badge："Typing 模式（未安装 Java 环境）"

## Consequences
+ 学习路径连续，用户不会因环境问题卡关
+ 仍能建立代码肌肉记忆（typing 的核心价值）
- 无法验证代码逻辑正确性，用户可能误以为代码没问题
- 进度数据中 coding 步骤以 typing 形式完成，统计有混淆风险
  → 缓解：在进度详情中标注该步骤的完成模式
```

### ADR-003：用户学习中心数据存储方式

```
# ADR-003: 学习中心数据：实时计算 vs. 预聚合

## Status
Accepted

## Context
用户中心需要展示热力图、连续天数、总时长等汇总数据。
可选方案：每次打开时从 step_stats 实时聚合，或维护独立汇总表。

## Decision
采用混合方案：
- learning_daily_summary 表：每次完成步骤时 upsert，保持实时
- 复杂聚合（连续天数、总时长）：打开用户中心时按需计算，结果不持久化
- 热力图数据：直接从 learning_daily_summary 查询，O(90) 次读，性能可控

## Consequences
+ 无复杂 trigger 或异步计算，实现简单
+ 热力图数据始终准确
- 连续天数在每次打开用户中心时计算，但数据量小（<365行），可接受
```

### ADR-004：连击系统设计——纯连击 vs. 等级制

```
# ADR-004: 连击系统设计——纯连击 vs. 等级制

## Status
Accepted

## Context
需要为 CodeStep 增加趣味性，考虑两种方案：
1. 等级制：连击数达到阈值（5/10/20/30）触发等级提升，获得 XP 奖励
2. 纯连击：只记录连击数和最大连击，通过视觉特效营造音游感

## Decision
采用方案 2（纯连击），理由：
- 等级制和 XP 奖励增加系统复杂度，与核心学习目标（打字练习）关联弱
- 纯连击更贴近音游体验，视觉冲击力强，用户易理解
- 实现成本低（~2h），可快速迭代

## Consequences
+ 实现简单，2小时可完整跑起来
+ 视觉反馈强，提升打字练习的沉浸感
+ 数据模型极简（仅两个字段），不增加持久化负担
- 缺乏长期激励机制（无 XP / 等级）
  → 缓解：后续可叠加成就系统（Achievement）补充
```

---

## 十二、后续规划

### Phase 2: 扩展功能（包含 V1.2 新增项目）

1. **多语言支持** - Python, JavaScript, C++
   - 详细课程设计见 `docs/multi-language-course-design.md`
   - Python：12 门课程，~175 步骤（推荐优先实现）
   - JavaScript：10 门课程，~130 步骤
   - C/C++：10 门课程，~150 步骤
2. **代码执行** - 实时运行用户代码并显示输出
3. **用户课程包** - 导入自定义 .codestep 课程
4. **课程搜索/筛选** - 快速找到想学的内容
5. **社区功能** - 分享代码、讨论问题
6. ~~课程分类~~ - **已在 V1.2 完成**
7. ~~环境检测与降级~~ - **已在 V1.2 完成**
8. ~~用户学习中心~~ - **已在 V1.2 完成**

### Phase 3: 高级功能

1. **课程市场** - 远程课程 API、创作者平台
2. **AI 辅助** - 智能提示、代码解释
3. **自适应学习** - 根据表现调整练习难度
4. **团队模式** - 多人同时学习、竞赛
5. **用户中心增强** - 成就分享、学习报告导出

---

## 十三、附录

### A. 快捷键参考

| 快捷键 | 功能 | 作用域 |
|-------|------|--------|
| Enter | 验证代码 | Coding 模式 |
| Tab | 显示提示 | Coding 模式 |
| R | 重置代码 | Coding 模式 |
| A | 显示答案 | Coding 模式 |
| F | 切换专注模式 | 学习页面 |
| Esc | 退出专注模式 | 学习页面 |
| ↑/↓ | 上/下一步 | 非输入状态 |

### B. 依赖版本

| 依赖 | 版本 | 说明 |
|-----|------|-----|
| Tauri | 2.x | 桌面框架 |
| React | 18.x | 前端框架 |
| TypeScript | 5.x | 类型系统 |
| TailwindCSS | 3.x | 样式框架 |
| CodeMirror | 6.x | 代码编辑器 |
| Zustand | 4.x | 状态管理 |
| Vite | 5.x | 构建工具 |
| rusqlite | 0.31.x | SQLite 绑定 |
| which | 4.x | Rust PATH 查找（新增，用于环境检测） |

### C. 参考资料

- [Tauri 官方文档](https://tauri.app/)
- [Tauri 2.0 迁移指南](https://tauri.app/distribute/migrating/)
- [CodeMirror 6 文档](https://codemirror.net/docs/)
- [React + Tauri 最佳实践](https://tauri.app/develop/)
