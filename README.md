# CodeStep — Code Muscle Memory Trainer

[![Release](https://img.shields.io/github/v/release/ynzz-j/code-step?style=flat-square)](https://github.com/ynzz-j/code-step/releases)
[![License](https://img.shields.io/github/license/ynzz-j/code-step?style=flat-square)](LICENSE)

A code muscle memory trainer for developers. Break high-frequency code patterns into 30-second micro-snippets, type them repeatedly, and get real-time WPM / Accuracy / Combo feedback — until syntax and symbols become finger instinct.

Inspired by Duolingo — spend a few minutes a day turning everyday patterns like `map/filter/reduce`, `async/await`, `list/dict` into pure muscle memory.

[中文](#中文)

---

## ✨ Highlights

- **Amber Arcade UI** — deep-navy night theme with warm dusk illustrations; code is always the main character. New amber `< >` app icon.
- **Syntax-Highlighted Typing** — per-character keywords/strings/numbers coloring, line numbers, and a breathing amber caret. Errors flash red with a wavy underline.
- **Smart Indentation** — IDE-style auto alignment: never type filler spaces. Press the next real character and the indent is filled for you.
- **Virtual Keyboard** — powered by `react-simple-keyboard`: next-key amber glow, physical key sync, finger-zone guidance, green flash on correct / red shake on wrong.
- **Game Feedback** — combo flame tiers (10 / 20 / 30), milestone toasts, session result cards with personal-best deltas, highlights & weak-point analysis.
- **Challenge Modes** — `speed-30s` / `focus-3min` / `perfect-run` / `combo-rush`, local leaderboards and shareable result cards.
- **Growth Tracking** — pattern mastery, weak-token stats, best records, daily streaks and a language-distribution donut in your profile center.
- **Frameless Window** — custom title bar (minimize / maximize / close) drawn into the amber header, drag anywhere on it.
- **Lightweight Desktop** — Tauri v2 + React + TypeScript, fast startup, works at 1024px window width.

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Desktop Framework | Tauri v2 (Rust) |
| Frontend | React 18 + TypeScript |
| State | Zustand |
| Virtual Keyboard | react-simple-keyboard (MIT) |
| Editor / Typing Surface | Custom char renderer + CodeMirror 6 (coding mode) |
| Styling | Tailwind CSS + semantic design tokens |
| Bundler | Vite 5 |
| Storage | SQLite (progress / settings / growth) |
| Audio | Web Audio API |

## 🎮 Challenge Modes

| Mode | Goal |
|---|---|
| `speed-30s` | Most correct characters in 30 seconds |
| `focus-3min` | Steady, accurate input for 3 minutes |
| `perfect-run` | Finish segments with zero errors / backspaces |
| `combo-rush` | Push your max combo (idle breaks it) |

Every run is scored with a **Flow Score** and ranked on the local leaderboard; results can be exported as a share card.

## 📖 Project Structure

```
src/
├── components/
│   ├── editor/          # TypingEditor (syntax highlight + caret) / VirtualKeyboard / CodeEditor
│   ├── learn/           # SideStatsPanel / CoreStatsBar / ComboDisplay / PerfectStrike / ShareCard ...
│   ├── courses/         # Course filters & cards
│   └── layout/          # AppShell / Header (frameless window controls)
├── pages/               # Welcome / Courses / Learn / Complete / UserCenter / About
├── stores/              # Zustand stores (session / typing / combo / growth / challenge ...)
├── services/            # Tauri backend bridge
├── assets/              # backgrounds/ (dusk illustrations) + icons/ (rewards & ui icons)
├── data/                # Training pack definitions
├── types/               # TypeScript types
└── utils/               # Sound manager / validation / stats
src-tauri/
├── commands/            # course / progress / growth / challenge / settings / thinking ...
├── capabilities/        # Tauri v2 permissions (frameless window controls)
└── executor/            # sandboxed code runner (coding mode)
courses/                 # typing & coding course assets (47 typing courses / 399 snippets)
```

## 📦 Installation

### Download

Get the latest `.msi` or `.exe` from [Releases](https://github.com/ynzz-j/code-step/releases).

### Build from Source

```bash
git clone https://github.com/ynzz-j/code-step.git
cd code-step
npm install
npm run tauri dev      # dev mode
npm run tauri build    # production build
```

> Regenerating the app icon: `python generate_icon_v4.py master && npx tauri icon app-icon.png && python generate_icon_v4.py all`

## 🤝 Contributing

PRs and issues welcome.

1. Fork the repo
2. `git checkout -b feat/amazing-feature`
3. Commit and push
4. Open a Pull Request

## 📄 License

MIT License — see [LICENSE](LICENSE).

---

## 中文

### 简介

面向程序员的代码肌肉记忆训练工具。把高频代码模式拆成 30 秒短片段反复跟敲，WPM / 准确率 / Combo 实时反馈，把语法和符号练到手指本能。

灵感来自 Duolingo —— 每天几分钟，把 `map/filter/reduce`、`async/await`、`list/dict` 这些日常写法变成不用动脑的反射动作。

### 卖点

- **琥珀街机 UI** —— 深夜蓝底 + 黄昏插画的设计语言，代码永远占主视觉；全新琥珀 `< >` 应用图标
- **语法高亮跟敲** —— 逐字符关键字/字符串/数字着色、行号、琥珀呼吸光标，敲错红底波浪线提示
- **缩进自动对齐** —— IDE 式智能空格：缩进和对齐空格自动补齐，只敲有效字符
- **虚拟键盘** —— 基于 react-simple-keyboard：下一键金橙高亮、物理按键同步下沉、指法分区建议、敲对绿闪 / 敲错红抖
- **游戏化反馈** —— 连击火焰三档（10/20/30）、里程碑 Toast、结算卡带历史最佳差值、亮点与弱点分析
- **挑战模式** —— 30 秒极速 / 3 分钟专注 / Perfect Run / Combo Rush，本地排行榜 + 可分享成绩卡
- **成长追踪** —— 模式熟练度、薄弱 token、最佳纪录、连续训练天数、语言分布环图
- **无边框窗口** —— 自定义标题栏（最小化/最大化/退出）融入琥珀 Header，整条可拖拽
- **轻量桌面应用** —— Tauri v2 + React + TypeScript，启动快，1024px 宽度可用

### 快速开始

1. 启动应用 → 首屏直接点击训练包或「开始练习」
2. 进入训练 → 跟敲代码，逐字符实时校验，缩进自动对齐
3. 完成片段 → 底部轻量结算，可自动下一段或手动跳过
4. 课程结算 → 本轮 WPM / 准确率 / Max Combo / Flow Score，亮点与弱点一目了然

### 安装

前往 [Releases](https://github.com/ynzz-j/code-step/releases) 下载最新 `.msi` 或 `.exe`。

```bash
git clone https://github.com/ynzz-j/code-step.git
cd code-step
npm install
npm run tauri dev      # 开发模式
npm run tauri build    # 生产构建
```

---

**⭐ 如果这个项目对你有用，欢迎给个 Star！**
