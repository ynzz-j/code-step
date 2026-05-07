# CodeStep - 编程学习应用架构设计文档

> 版本：V1.1 | 日期：2026-05-06 | 状态：初稿

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
│   │   └── layout/              # 布局组件
│   │       ├── AppShell.tsx
│   │       └── Header.tsx
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useCourse.ts         # 课程状态管理
│   │   ├── useTypingStats.ts    # 打字统计
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useProgress.ts
│   ├── pages/                    # 页面组件
│   │   ├── WelcomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── LearnPage.tsx
│   │   └── CompletePage.tsx
│   ├── stores/                   # Zustand 状态管理
│   │   ├── courseStore.ts
│   │   ├── settingsStore.ts
│   │   └── userStore.ts
│   ├── services/                 # 业务逻辑服务
│   │   ├── courseService.ts     # 课程加载/保存
│   │   ├── validationService.ts  # 代码验证
│   │   └── statsService.ts      # 统计数据
│   ├── types/                     # TypeScript 类型定义
│   │   ├── course.ts
│   │   ├── step.ts
│   │   └── user.ts
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
│   │   │   ├── course.rs        # 课程数据操作
│   │   │   ├── progress.rs      # 学习进度
│   │   │   ├── executor.rs      # 代码执行器
│   │   │   └── settings.rs      # 设置管理
│   │   ├── models/              # 数据模型
│   │   │   ├── mod.rs
│   │   │   ├── course.rs
│   │   │   ├── step.rs
│   │   │   └── user_progress.rs
│   │   ├── db/                   # 数据库操作
│   │   │   ├── mod.rs
│   │   │   ├── schema.rs
│   │   │   └── migrations/
│   │   ├── executor/             # 代码执行引擎
│   │   │   ├── mod.rs
│   │   │   ├── java.rs           # Java 执行器
│   │   │   ├── python.rs         # Python 执行器
│   │   │   └── sandbox.rs        # 沙箱隔离
│   │   └── utils/                # Rust 工具函数
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── build.rs
│   └── icons/                    # 应用图标
├── courses/                      # 课程内容目录
│   ├── java/
│   │   ├── course.json          # 课程元数据
│   │   └── steps/               # 步骤内容
│   │       ├── step-01.json
│   │       └── step-02.json
│   └── python/
├── locales/                      # 国际化
│   ├── zh-CN.json
│   └── en-US.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── SPEC.md                       # 产品规格文档
```

---

## 三、模块架构设计

### 3.1 前端模块架构

#### 3.1.1 组件层级

```
AppShell (应用外壳)
├── Header (顶部导航栏)
│   ├── Logo
│   ├── NavLinks
│   └── WindowControls (窗口控制)
├── MainContent (主内容区)
│   ├── WelcomePage (首页)
│   ├── AboutPage (理念页)
│   ├── CoursesPage (课程列表)
│   │   └── CourseCard
│   ├── LearnPage (学习界面)
│   │   ├── InstructionPanel (左侧说明面板)
│   │   │   ├── StepHeader (步骤标题/标签)
│   │   │   ├── StepInstruction (步骤说明)
│   │   │   └── HintBox (提示框)
│   │   ├── EditorPanel (右侧编辑器面板)
│   │   │   ├── OutputTerminal (输出终端)
│   │   │   ├── StatsPanel (统计面板 - typing模式)
│   │   │   ├── CodeEditor (coding模式编辑器)
│   │   │   │   └── CodeMirror / Monaco
│   │   │   ├── TypingEditor (typing模式编辑器)
│   │   │   │   ├── TargetDisplay (目标代码)
│   │   │   │   └── TypingInput (用户输入)
│   │   │   └── EditorToolbar (工具栏)
│   │   ├── FeedbackArea (反馈区)
│   │   ├── NavigationBar (导航按钮)
│   │   └── ProgressDots (进度点)
│   └── CompletePage (完成页)
└── Footer (可选)
```

#### 3.1.2 状态管理 (Zustand)

```typescript
// stores/courseStore.ts
interface CourseStore {
  // 当前课程状态
  currentCourse: Course | null;
  currentStepIndex: number;
  completedSteps: Set<number>;

  // 课程列表
  courses: Course[];

  // Actions
  loadCourses: () => Promise<void>;
  startCourse: (courseId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (index: number) => void;
  resetProgress: () => void;
}

// stores/settingsStore.ts
interface SettingsStore {
  theme: 'dark' | 'light' | 'system';
  fontSize: number;
  tabSize: number;
  autoValidate: boolean;
  autoValidateDelay: number;
  focusModeShortcut: string;

  // Actions
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// stores/userStore.ts
interface UserStore {
  // 用户数据
  userId: string;
  displayName: string;
  totalLearningTime: number;
  completedCourses: string[];
  stepStats: StepStats[];

  // 成就系统
  achievements: Achievement[];

  // Actions
  updateStats: (stats: Partial<StepStats>) => void;
  unlockAchievement: (achievementId: string) => void;
}
```

### 3.2 后端模块架构 (Rust)

#### 3.2.1 命令层 (Tauri Commands)

```rust
// commands/course.rs
#[tauri::command]
pub async fn get_courses() -> Result<Vec<Course>, String> {
    // 获取所有课程列表
}

#[tauri::command]
pub async fn get_course(course_id: String) -> Result<Course, String> {
    // 获取单个课程详情
}

#[tauri::command]
pub async fn get_step(course_id: String, step_index: u32) -> Result<Step, String> {
    // 获取课程步骤
}

// commands/progress.rs
#[tauri::command]
pub async fn save_progress(
    course_id: String,
    step_index: u32,
    completed: bool,
) -> Result<(), String> {
    // 保存步骤完成状态
}

#[tauri::command]
pub async fn get_user_progress() -> Result<UserProgress, String> {
    // 获取用户总进度
}

// commands/executor.rs
#[tauri::command]
pub async fn execute_code(
    language: String,
    code: String,
) -> Result<ExecutionResult, String> {
    // 执行用户代码
}

// commands/settings.rs
#[tauri::command]
pub async fn get_settings() -> Result<Settings, String> { }
#[tauri::command]
pub async fn save_settings(settings: Settings) -> Result<(), String> { }
```

#### 3.2.2 数据模型

```rust
// models/course.rs
#[derive(Debug, Serialize, Deserialize)]
pub struct Course {
    pub id: String,
    pub title: String,
    pub description: String,
    pub language: String,        // java, python, javascript...
    pub difficulty: Difficulty,
    pub concepts: Vec<String>,
    pub steps: Vec<Step>,
    pub estimated_time: u32,     // 预计分钟数
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Difficulty {
    Beginner,
    Intermediate,
    Advanced,
}

// models/step.rs
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Step {
    Coding {
        title: String,
        concept: String,
        instruction: String,
        hint: Option<String>,
        starter: Option<String>,
        answer: String,
        expected_output: Option<String>,
        validate: ValidationRule,
    },
    Typing {
        title: String,
        concept: String,
        instruction: String,
        hint: Option<String>,
        target_code: String,
    },
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidationRule {
    pub rule_type: ValidationType,
    pub pattern: Option<String>,
    pub keywords: Option<Vec<String>>,
    pub exact_match: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum ValidationType {
    Contains,
    Regex,
    Exact,
    AST,  // 抽象语法树验证（高级）
}

// models/user_progress.rs
#[derive(Debug, Serialize, Deserialize)]
pub struct UserProgress {
    pub user_id: String,
    pub course_progress: HashMap<String, CourseProgress>,
    pub total_time: u64,
    pub last_active: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CourseProgress {
    pub course_id: String,
    pub completed_steps: Vec<u32>,
    pub current_step: u32,
    pub started_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
    pub time_spent: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StepStats {
    pub step_id: String,
    pub attempts: u32,
    pub time_spent: u64,
    pub errors_count: u32,
    pub accuracy: f32,
    pub wpm: Option<f32>,  // 仅 typing 模式
}
```

---

## 四、核心功能详细设计

### 4.1 课程引擎

#### 4.1.1 步骤类型定义

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
  starter?: string;           // 起始代码
  answer: string;             // 参考答案
  expectedOutput?: string;    // 期望输出
  validation: ValidationRule;
}

interface TypingStep extends BaseStep {
  type: 'typing';
  targetCode: string;         // 目标代码（逐字照打）
  expectedOutput?: string;
}

type Step = CodingStep | TypingStep;
```

#### 4.1.2 步骤流转

```
┌─────────────────────────────────────────────────────────┐
│                    步骤状态机                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   [待开始] ──点击进入──> [进行中] ──完成验证──> [已完成] │
│       ^                         │                       │
│       │                         │ 未通过                │
│       │                         v                       │
│       └────────重新开始──── [进行中]                     │
│                                                         │
│   特殊情况：                                            │
│   - typing 模式：逐字符匹配，实时反馈                     │
│   - coding 模式：输入即验证 (500ms 防抖)                  │
│   - 到达最后一步：触发完成页面                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.2 代码编辑器

#### 4.2.1 编辑器选型

| 编辑器 | 优点 | 缺点 | 适用场景 |
|-------|------|------|---------|
| CodeMirror 5 | 轻量、API 简单 | 样式旧 | 原型/简单场景 |
| CodeMirror 6 | 模块化、性能好 | 学习曲线陡 | 生产推荐 |
| Monaco | VSCode 同款、功能强 | 体积大 (2MB+) | 复杂编辑 |

**推荐**：CodeMirror 6 作为主编辑器

#### 4.2.2 编辑器配置

```typescript
// components/editor/CodeEditor.tsx
const editorOptions: EditorViewOptions = {
  extensions: [
    // 语言支持
    java(),
    python(),
    javascript(),

    // 核心功能
    lineNumbers(),              // 行号
    highlightActiveLineGutter(), // 高亮当前行
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),

    // 编辑辅助
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),

    // 键盘快捷键
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      indentWithTab,
    ]),

    // 主题
    oneDark,
  ],

  // 配置
  indentUnit: 4,
  tabSize: 4,
  lineWrapping: true,
};
```

#### 4.2.3 打字模式高亮

```typescript
// components/editor/TypingEditor.tsx
function highlightTypingErrors(typed: string, target: string, view: EditorView) {
  const marks: Mark[] = [];

  for (let i = 0; i < typed.length; i++) {
    const char = typed[i];
    const expected = target[i] || '';

    if (char === expected) {
      marks.push({
        from: i,
        to: i + 1,
        class: 'cm-correct-char',
      });
    } else {
      marks.push({
        from: i,
        to: i + 1,
        class: 'cm-error-char',
      });
    }
  }

  // 应用标记
  marks.forEach(mark => {
    view.dispatch({
      changes: { from: mark.from, to: mark.to, insert: typed.slice(mark.from, mark.to) },
      effects: EditorView.decorations.reconfigure([
        Decoration.mark({ class: mark.class }).range(mark.from)
      ])
    });
  });
}
```

### 4.3 代码执行引擎

#### 4.3.1 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                   代码执行请求                           │
│                   (前端 → Tauri)                        │
└─────────────────────────┬───────────────────────────────┘
                          │
                          v
┌─────────────────────────────────────────────────────────┐
│              Rust Backend: executor 模块                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Java     │    │   Python    │    │  JavaScript │  │
│  │  Executor  │    │  Executor   │    │  Executor   │  │
│  └─────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│        │                  │                  │         │
│        └──────────────────┼──────────────────┘         │
│                           │                             │
│                           v                             │
│              ┌─────────────────────┐                   │
│              │   Sandbox Manager   │                   │
│              │   (进程隔离/资源限制) │                   │
│              └──────────┬──────────┘                   │
│                         │                              │
│                         v                              │
│              ┌─────────────────────┐                   │
│              │    Output Parser    │                   │
│              │   (结果格式化)       │                   │
│              └─────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
                          │
                          v
┌─────────────────────────────────────────────────────────┐
│              ExecutionResult                            │
│  { success: boolean, output: string, error?: string,    │
│    executionTime: number }                              │
└─────────────────────────────────────────────────────────┘
```

#### 4.3.2 执行器实现

```rust
// executor/mod.rs
pub struct Executor {
    sandbox: Sandbox,
    timeout: Duration,
}

impl Executor {
    pub async fn execute(&self, lang: Language, code: &str)
        -> Result<ExecutionResult, ExecutionError>
    {
        match lang {
            Language::Java => self.execute_java(code).await,
            Language::Python => self.execute_python(code).await,
            Language::JavaScript => self.execute_js(code).await,
        }
    }

    async fn execute_java(&self, code: &str) -> Result<ExecutionResult, ExecutionError> {
        // 1. 写入临时文件
        let temp_dir = self.sandbox.create_temp_dir()?;
        let file_path = temp_dir.join("Main.java");
        fs::write(&file_path, code)?;

        // 2. 编译
        let compile_output = Command::new("javac")
            .arg(file_path)
            .output()
            .map_err(|e| ExecutionError::CompileError(e.to_string()))?;

        if !compile_output.status.success() {
            return Ok(ExecutionResult {
                success: false,
                output: String::new(),
                error: String::from_utf8_lossy(&compile_output.stderr).to_string(),
                execution_time: 0,
            });
        }

        // 3. 运行（带超时）
        let start = Instant::now();
        let run_output = Command::new("java")
            .current_dir(temp_dir)
            .arg("-cp", ".")
            .arg("Main")
            .output();

        // ... 处理运行结果
    }
}

// executor/sandbox.rs
pub struct Sandbox {
    max_memory_mb: u64,
    max_cpu_percent: u64,
    max_time_ms: u64,
}

impl Sandbox {
    // 使用 seccomp / Landlock 实现进程隔离
    // 或使用轻量级方案：ulimit / cgroups
}
```

#### 4.3.3 安全考虑

| 风险 | 缓解措施 |
|-----|---------|
| 无限循环 | 设置执行超时 (5秒) |
| 内存耗尽 | 限制进程内存 (256MB) |
| 文件系统访问 | 隔离临时目录，禁止访问用户文件 |
| 网络访问 | 禁止网络请求 |
| 系统调用 | 使用 seccomp 过滤危险 syscall |

### 4.4 数据持久化

#### 4.4.1 SQLite 数据库设计

```sql
-- 用户表
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME
);

-- 课程进度表
CREATE TABLE course_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    current_step INTEGER DEFAULT 0,
    completed_steps TEXT,  -- JSON array
    started_at DATETIME,
    completed_at DATETIME,
    time_spent INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, course_id)
);

-- 步骤统计表
CREATE TABLE step_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    step_index INTEGER NOT NULL,
    attempts INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    accuracy REAL,
    wpm REAL,
    last_attempt DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, course_id, step_index)
);

-- 成就表
CREATE TABLE achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 设置表
CREATE TABLE settings (
    user_id TEXT PRIMARY KEY,
    settings_json TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 4.4.2 前端存储服务

```typescript
// services/courseService.ts
export class CourseService {
  constructor(private tauri: TauriContext) {}

  async getCourses(): Promise<Course[]> {
    return await this.tauri.invoke('get_courses');
  }

  async getCourse(courseId: string): Promise<Course> {
    return await this.tauri.invoke('get_course', { courseId });
  }

  async saveProgress(courseId: string, stepIndex: number, completed: boolean) {
    return await this.tauri.invoke('save_progress', {
      courseId,
      stepIndex,
      completed,
    });
  }
}

// services/statsService.ts
export class StatsService {
  constructor(private tauri: TauriContext) {}

  async recordStepAttempt(stats: StepStats) {
    return await this.tauri.invoke('record_step_stats', { stats });
  }

  async getUserStats(): Promise<UserStats> {
    return await this.tauri.invoke('get_user_stats');
  }
}
```

---

## 五、用户界面设计

### 5.1 页面结构

```
┌─────────────────────────────────────────────────────────┐
│                    应用窗口框架                          │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │  标题栏 (原生或自定义)                             │  │
│  │  [─ □ ×]            CodeStep                      │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │                   内容区域                        │  │
│  │                                                   │  │
│  │   WelcomePage / CoursesPage / LearnPage / ...    │  │
│  │                                                   │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  状态栏: 学习进度 | WPM | 快捷键提示               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 5.2 学习界面布局

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: [← 退出]    Java 入门    [● ● ● ● ○ ○ ○ ○]  3/8        │
├───────────────────────────────┬─────────────────────────────────┤
│                               │  ┌─────────────────────────────┐│
│  步骤 3 / 8                  │  │ Output                      ││
│  ┌───────────────────────┐   │  │ ● ● ● Hello                 ││
│  │ [概念] [难度] [coding] │   │  │ World                       ││
│  └───────────────────────┘   │  └─────────────────────────────┘│
│                               │                                 │
│  输出第一行文字                │  ┌─────────────────────────────┐│
│                               │  │ Main.java           [重置]  ││
│  在 main 方法中使用            │  │ 1 │ public class Main {     ││
│  System.out.println()         │  │ 2 │     public static...    ││
│  输出文字。                    │  │ 3 │         System.out...   ││
│                               │  └─────────────────────────────┘│
│  ┌───────────────────────┐   │                                 │
│  │ 💡 提示：              │   │  [✓ 正确！自动进入下一步...]     ││
│  │ System.out.println(...) │   │                                 │
│  └───────────────────────┘   │  [↑ 上一步]      [下一步 ↓]      ││
│                               │                                 │
│  💪 加油，你可以的！            │  Enter 验证 | F 专注模式 | Esc  ││
└───────────────────────────────┴─────────────────────────────────┘
```

### 5.3 打字练习模式布局

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: [← 退出]    Java 入门    [● ● ● ● ● ○ ○ ○]  5/8        │
├───────────────────────────────┬─────────────────────────────────┤
│                               │  ┌─────────────────────────────┐│
│  步骤 5 / 8                  │  │ 统计面板                      ││
│  ┌───────────────────────┐   │  │ ┌─────┐ ┌─────┐ ┌─────┐      ││
│  │ [概念] [难度] [typing] │   │  │ │ 45  │ │ 96% │ │  2  │      ││
│  └───────────────────────┘   │  │ │ WPM │ │准确率│ │错误 │      ││
│                               │  │ └─────┘ └─────┘ └─────┘      ││
│  添加 main 方法               │  │         ┌─────────┐           ││
│                               │  │         │  62%   │           ││
│  main 方法是 Java 程序的       │  │         │  进度   │           ││
│  入口。请照着敲一遍，           │  │         └─────────┘           ││
│  记住这个固定写法！             │  └─────────────────────────────┘│
│                               │                                 │
│  ┌───────────────────────┐   │  ┌─────────────────────────────┐│
│  │ 💡 提示：              │   │  │ 🟢 目标代码 (只读)           ││
│  │ 这是 Java 最常用的     │   │  │ 1 │ public class Main {      ││
│  │ 代码片段               │   │  │ 2 │     public static...     ││
│  └───────────────────────┘   │  └─────────────────────────────┘│
│                               │                                 │
│  💪 动手敲代码是最好的学习方式  │  ┌─────────────────────────────┐│
└───────────────────────────────┴──│ 🔵 你的输入 (逐字验证) ────────┤
                                   │ 1 │ public class Main {      │
                                   │ 2 │     ████ (红色高亮错误)   │
                                   └─────────────────────────────┘
```

---

## 六、窗口与系统集成

### 6.1 窗口管理

```rust
// src-tauri/src/main.rs
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 获取主窗口
            let window = app.get_webview_window("main").unwrap();

            // 设置窗口属性
            window.set_title("CodeStep - 一步步学编程")?;
            window.set_min_size(Some(PhysicalSize::new(1024, 768)))?;
            window.set_decorations(true)?;  // 使用原生标题栏
            window.center()?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 6.2 全局快捷键

```rust
// src-tauri/src/commands/mod.rs
#[tauri::command]
pub fn register_shortcuts(app: AppHandle) -> Result<(), String> {
    use tauri::GlobalShortcutManager;

    let mut manager = app.global_shortcut_manager();

    // 注册全局快捷键 (即使应用未聚焦也能响应)
    manager.register("CmdOrCtrl+Shift+L", || {
        // 启动应用或聚焦窗口
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.show();
            let _ = window.set_focus();
        }
    })?;

    Ok(())
}
```

### 6.3 系统托盘

```rust
// src-tauri/src/tray.rs
pub fn create_tray(app: &App) -> Result<(), tauri::Error> {
    use tauri::menu::{Menu, MenuItem};
    use tauri::tray::TrayIconBuilder;

    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let show = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &quit])?;

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(|app, event| {
            match event.id.as_ref() {
                "quit" => {
                    app.exit(0);
                }
                "show" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                    }
                }
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}
```

### 6.4 自动更新

```rust
// tauri.conf.json
{
  "plugins": {
    "updater": {
      "pubkey": "YOUR_PUBLIC_KEY",
      "endpoints": [
        "https://releases.codestep.app/update/{{target}}/{{current_version}}"
      ],
      "dialog": true
    }
  }
}
```

---

## 七、课程加载系统

### 7.1 设计理念

课程是应用的核心内容，采用**混合架构**实现动态加载，兼顾离线体验和内容扩展能力。

```
┌─────────────────────────────────────────────────────────┐
│                   课程加载优先级                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   1️⃣ [最高] 用户自定义课程包 (./courses/*.codestep)      │
│           ↓ 不存在                                      │
│   2️⃣ 本地内置课程 (bundled with app)                   │
│           ↓ 需要更新                                    │
│   3️⃣ 远程课程市场 (api.codestep.app/courses)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.2 课程来源类型

| 来源 | 位置 | 更新方式 | 适用场景 |
|------|------|---------|---------|
| 内置课程 | `src-tauri/courses/` | 随应用发版 | 核心教学内容 |
| 用户课程 | `~/.codestep/courses/` | 用户手动导入 | 自定义/社区课程 |
| 远程课程 | API 接口 | 自动/手动检查更新 | 持续更新的内容 |

### 7.3 前端加载服务

```typescript
// services/courseLoader.ts

/** 课程加载器接口 */
interface ICourseLoader {
  loadCourse(id: string): Promise<Course>;
  loadCourses(): Promise<Course[]>;
  checkUpdates(): Promise<CourseUpdate[]>;
}

/** 混合课程加载器 */
class HybridCourseLoader implements ICourseLoader {
  constructor(
    private userCourses: UserCourseProvider,
    private bundledCourses: BundledCourseProvider,
    private remoteCourses: RemoteCourseProvider
  ) {}

  async loadCourse(id: string): Promise<Course> {
    // 1. 优先检查用户自定义课程
    const userCourse = await this.userCourses.load(id);
    if (userCourse) return userCourse;

    // 2. 检查内置课程
    const bundledCourse = await this.bundledCourses.load(id);
    if (bundledCourse) return bundledCourse;

    // 3. 从远程获取（可能触发下载）
    return await this.remoteCourses.load(id);
  }

  async loadCourses(): Promise<Course[]> {
    // 合并所有来源的课程列表
    const [userCourses, bundledCourses, remoteCourses] = await Promise.all([
      this.userCourses.list(),
      this.bundledCourses.list(),
      this.remoteCourses.list(),
    ]);

    // 去重：用户课程 > 内置课程 > 远程课程
    const courseMap = new Map<string, Course>();

    // 按优先级添加
    remoteCourses.forEach(c => courseMap.set(c.id, c));
    bundledCourses.forEach(c => courseMap.set(c.id, c));
    userCourses.forEach(c => courseMap.set(c.id, c));

    return Array.from(courseMap.values());
  }
}
```

### 7.4 后端加载命令 (Rust)

```rust
// commands/course_loader.rs

#[derive(Debug, Clone)]
pub enum CourseSource {
    Bundled,    // 内置课程
    User,       // 用户课程
    Remote,     // 远程课程
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CourseMetadata {
    pub id: String,
    pub title: String,
    pub language: String,
    pub difficulty: Difficulty,
    pub step_count: u32,
    pub estimated_minutes: u32,
    pub version: String,
    pub source: CourseSource,
}

#[tauri::command]
pub async fn get_course_metadata(id: String) -> Result<CourseMetadata, String> {
    // 按优先级查找课程元数据
    // 1. 用户目录
    // 2. 内置资源
    // 3. 远程 API
}

#[tauri::command]
pub async fn get_all_courses_metadata() -> Result<Vec<CourseMetadata>, String> {
    // 聚合所有课程源，返回列表
}

#[tauri::command]
pub async fn load_step(
    course_id: String,
    step_index: u32,
) -> Result<Step, String> {
    // 按需加载单个步骤内容
}

#[tauri::command]
pub async fn import_user_course(path: String) -> Result<CourseMetadata, String> {
    // 导入用户课程包 (.codestep)
}

#[tauri::command]
pub async fn check_course_updates() -> Result<Vec<CourseUpdate>, String> {
    // 检查内置/远程课程更新
}

#[tauri::command]
pub async fn download_course(id: String) -> Result<(), String> {
    // 下载远程课程到本地
}
```

### 7.5 课程包格式 (.codestep)

```
my-course.codestep/          # ZIP 包结构
├── manifest.json            # 元数据清单
├── course.json             # 课程定义
├── steps/                  # 步骤内容
│   ├── step-01.json
│   └── step-02.json
└── assets/                 # 资源文件
    └── logo.png
```

```json
// manifest.json
{
  "id": "java-algorithms",
  "title": "Java 算法入门",
  "version": "1.0.0",
  "author": "李四",
  "createdAt": "2026-05-01",
  "compatibility": "^2.0.0",
  "checksum": "sha256:abc123...",
  "files": [
    "course.json",
    "steps/step-01.json",
    "steps/step-02.json",
    "assets/logo.png"
  ]
}
```

### 7.6 渐进式加载策略

```
┌─────────────────────────────────────────────────────────┐
│                课程内容加载策略                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   课程列表页：                                           │
│   └── 只加载元数据 (id, title, difficulty, progress)     │
│       └── 体积小 (每课程 ~500B)，快速展示               │
│                                                         │
│   进入学习页：                                           │
│   └── 按需加载当前步骤 + 预加载下一步                    │
│       └── 支持大课程 (100+ 步骤) 不卡顿                  │
│                                                         │
│   步骤结构：                                             │
│   ├── step-01.json  (~2KB)                             │
│   ├── step-02.json  (~2KB)                              │
│   └── ...                                              │
│                                                         │
│   远程课程：                                             │
│   └── 首步立即可用，后续步骤后台下载                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.7 远程 API 设计

```typescript
// API 端点

interface CourseListResponse {
  courses: CourseMetadata[];
  total: number;
}

interface CourseDetailResponse {
  course: Course;
  latestVersion: string;
  changelog?: string;
}

interface StepResponse {
  step: Step;
  nextStep?: StepMetadata;  // 预加载下一题
}

// HTTP 端点
GET  /api/v1/courses                    // 课程列表
GET  /api/v1/courses/:id                // 课程详情
GET  /api/v1/courses/:id/steps/:index   // 单步内容
GET  /api/v1/courses/:id/download       // 下载课程包
GET  /api/v1/courses/:id/updates        // 检查更新
```

### 7.8 更新机制

```rust
// 更新检查逻辑
async fn check_updates() -> Result<Vec<CourseUpdate>, Error> {
    let mut updates = Vec::new();

    // 1. 检查内置课程更新
    let bundled_updates = check_bundled_updates().await?;
    updates.extend(bundled_updates);

    // 2. 检查远程课程更新
    let remote_updates = check_remote_updates().await?;
    updates.extend(remote_updates);

    Ok(updates)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CourseUpdate {
    pub course_id: String,
    pub current_version: String,
    pub latest_version: String,
    pub changelog: String,
    pub download_url: Option<String>,
}
```

| 更新场景 | 更新方式 | 实现 |
|---------|---------|------|
| 内置课程 | 应用版本更新 | 发版时替换 bundled 目录 |
| 远程课程 | 增量更新 + checksum | 比对 checksum，只下差异 |
| 用户课程 | 无自动更新 | 依赖作者手动维护 |

### 7.9 课程市场 (未来规划)

```
┌─────────────────────────────────────────────────────────┐
│              课程市场功能架构 (Phase 3)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   创作者平台：                                           │
│   ├── 课程编辑器 (可视化/JSON)                          │
│   ├── 预览和测试                                        │
│   ├── 版本管理                                          │
│   └── 发布审核                                          │
│                                                         │
│   课程分发：                                             │
│   ├── 免费/付费课程                                     │
│   ├── 课程排行/推荐                                     │
│   ├── 用户评分/评论                                     │
│   └── 下载统计                                          │
│                                                         │
│   收益分成：                                             │
│   ├── 创作者仪表盘                                      │
│   ├── 收入统计                                          │
│   └── 提现功能                                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.10 实施路径

```
┌─────────────────────────────────────────────────────────┐
│                   课程系统实施计划                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   MVP (V1.0):                                           │
│   ├── ✅ 内置 JSON 课程                                 │
│   └── 适合：首批 5-10 个核心课程                        │
│                                                         │
│   成熟期 (V2.0):                                        │
│   ├── 增加本地课程包导入 (.codestep)                    │
│   ├── 用户可导入自己或社区的课程                        │
│   └── 课程搜索/筛选                                     │
│                                                         │
│   生态期 (V3.0):                                        │
│   ├── 远程课程市场 API                                  │
│   ├── 创作者平台                                        │
│   └── UGC 内容生态                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 八、课程内容格式

### 8.1 课程元数据 (course.json)

```json
{
  "id": "java-hello",
  "title": "Java 入门：Hello World",
  "description": "学习 Java 程序的基本结构，写出你的第一个程序",
  "language": "java",
  "difficulty": "beginner",
  "concepts": ["基础语法", "main 方法", "输出语句"],
  "estimatedMinutes": 15,
  "steps": [
    "steps/step-01.json",
    "steps/step-02.json"
  ]
}
```

### 8.2 步骤文件格式

```json
// steps/step-01.json (Coding 模式)
{
  "type": "coding",
  "title": "理解 Java 程序结构",
  "concept": "基础语法",
  "difficulty": "beginner",
  "instruction": "每个 Java 程序都由一个类组成。类是 Java 程序的基本单位。请在编辑器中写一个空的 Main 类。",
  "hint": "public class Main { }",
  "starter": "",
  "answer": "public class Main {\n\n}",
  "expectedOutput": "",
  "validation": {
    "type": "contains",
    "value": "class Main"
  },
  "encouragement": "类名必须与文件名相同！"
}
```

```json
// steps/step-02.json (Typing 模式)
{
  "type": "typing",
  "title": "添加 main 方法",
  "concept": "main 方法",
  "difficulty": "beginner",
  "instruction": "main 方法是 Java 程序的入口。请照着敲一遍，记住这个固定写法！",
  "hint": "这是 Java 最常用的代码片段",
  "expectedOutput": "",
  "targetCode": "public class Main {\n    public static void main(String[] args) {\n        \n    }\n}",
  "encouragement": "main 方法是每个 Java 程序的起点！"
}
```

---

## 九、成就系统设计

### 8.1 成就类型

```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'course' | 'streak' | 'stats' | 'special';
  requirement: AchievementRequirement;
  reward?: {
    xp: number;
    badge?: string;
  };
}

type AchievementRequirement =
  | { type: 'complete_course'; courseId: string }
  | { type: 'complete_courses'; count: number }
  | { type: 'perfect_typing'; accuracy: number }
  | { type: 'speed_typing'; wpm: number }
  | { type: 'daily_streak'; days: number }
  | { type: 'total_time'; minutes: number };
```

### 8.2 内置成就

| 成就 ID | 名称 | 条件 | XP |
|--------|------|------|-----|
| first-course | 初出茅庐 | 完成第一个课程 | 100 |
| java-master | Java 大师 | 完成所有 Java 课程 | 500 |
| perfect-run | 完美无瑕 | 单次打字准确率 100% | 50 |
| speed-demon | 速度达人 | 单次打字 WPM > 60 | 75 |
| week-warrior | 一周战士 | 连续学习 7 天 | 200 |
| time-investor | 时间投资者 | 累计学习 10 小时 | 150 |

---

## 十、验收标准

### 9.1 功能验收

- [ ] 用户可以浏览课程列表并选择课程
- [ ] Coding 模式：用户可以自由编写代码并验证
- [ ] Typing 模式：用户可以照着敲代码，实时看到对错
- [ ] 进度自动保存，退出后恢复
- [ ] WPM 和准确率统计准确
- [ ] 键盘快捷键正常工作
- [ ] 专注模式正确隐藏/显示元素
- [ ] 课程完成后显示成就和统计

### 9.2 性能验收

- [ ] 应用启动时间 < 3 秒
- [ ] 页面切换动画流畅 (60fps)
- [ ] 打字输入延迟 < 16ms
- [ ] 代码验证响应时间 < 100ms

### 9.3 安全验收

- [ ] 用户代码在沙箱中执行
- [ ] 执行超时设置为 5 秒
- [ ] 无法访问用户文件系统
- [ ] 无网络请求能力

---

## 十一、后续规划

### Phase 2: 扩展功能

1. **多语言支持** - Python, JavaScript, C++
2. **代码执行** - 实时运行用户代码并显示输出
3. **用户课程包** - 导入自定义 .codestep 课程
4. **课程搜索/筛选** - 快速找到想学的内容
5. **社区功能** - 分享代码、讨论问题

### Phase 3: 高级功能

1. **课程市场** - 远程课程 API、创作者平台
2. **AI 辅助** - 智能提示、代码解释
3. **自适应学习** - 根据表现调整练习难度
4. **团队模式** - 多人同时学习、竞赛

---

## 十二、附录

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

### C. 参考资料

- [Tauri 官方文档](https://tauri.app/)
- [Tauri 2.0 迁移指南](https://tauri.app/distribute/migrating/)
- [CodeMirror 6 文档](https://codemirror.net/docs/)
- [React + Tauri 最佳实践](https://tauri.app/develop/)
