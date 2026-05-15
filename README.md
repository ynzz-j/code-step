# CodeStep — Code Muscle Memory Trainer

[![Release](https://img.shields.io/github/v/release/ynzz-j/code-step?style=flat-square)](https://github.com/ynzz-j/code-step/releases)
[![License](https://img.shields.io/github/license/ynzz-j/code-step?style=flat-square)](LICENSE)

A code muscle memory trainer for developers. Break high-frequency code patterns into 30-second micro-snippets, type them repeatedly, and get real-time WPM / Accuracy / Combo feedback — until syntax and symbols become finger instinct.

Inspired by Duolingo — spend a few minutes a day turning everyday patterns like `map/filter/reduce`, `async/await`, `list/dict` into pure muscle memory.

[中文](#中文)

---

## ✨ Highlights

- **Training Pack Driven** — Snippets grouped by real-world patterns (map/filter, async/await, Controller annotations). 30s to 3min per session, continuous Loop mode.
- **Keystroke-Level Validation** — Real-time per-character checking: correct / error / backspace, with typing and coding practice modes.
- **Data-Rich Feedback** — Live WPM, Accuracy, Error count, Combo streak, Flow Score — all compared against your personal best.
- **Combo & Milestones** — Tiered feedback at 10/20/30 combo; dedicated visuals + sound for New Best and Perfect Strike.
- **Dark, Tool-Focused UI** — Code input area dominates the viewport. Semantic color tokens, unified component specs, restrained motion.
- **Lightweight Desktop App** — Built on Tauri v2 + React + TypeScript. Fast startup, works at 1024px window width.

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Desktop Framework | Tauri v2 (Rust) |
| Frontend | React 18 + TypeScript |
| State | Zustand (persisted) |
| Editor | CodeMirror 6 |
| Styling | Tailwind CSS + Semantic Design Tokens |
| Bundler | Vite 5 |
| Audio | Web Audio API |

## 📖 Project Structure

```
src/
├── components/
│   ├── editor/          # CodeMirror wrappers (TypingEditor / CodeEditor)
│   ├── learn/           # In-session: StatsPanel / ComboDisplay / WpmChart / InstructionPanel
│   ├── courses/         # Course filters & cards
│   └── layout/          # AppShell / Header
├── pages/               # Welcome / Courses / Learn / Complete / UserCenter
├── stores/              # Zustand stores (catalog / session / typing / combo / chart / user / settings)
├── services/            # Tauri backend bridge
├── data/                # Training pack definitions
├── types/               # TypeScript types
└── utils/               # Sound manager / training stats
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

- **训练包驱动** — 按真实高频模式（map/filter、async/await、Controller 注解）聚合片段，30 秒起刷，支持连续 Loop
- **逐字跟敲** — 逐字符实时校验，正确/错误/退格即时区分，打字模式和编程实战模式双轨
- **数据化反馈** — WPM、准确率、错误数、Combo 连击、Flow Score 实时统计，当前成绩与历史最佳对比
- **连击 & 里程碑** — 10/20/30 连击分档反馈，New Best 和 Perfect Strike 独立视觉+音效
- **暗色工具感 UI** — 代码输入区占据主视觉，反馈克制分层，统一语义色和组件规范
- **轻量桌面应用** — Tauri v2 + React + TypeScript，启动快，窗口可控制在 1024px 以下

### 快速开始

1. 启动应用 → 首屏直接点击训练包或「开始 30 秒训练」
2. 进入训练 → 跟敲代码，逐字符实时校验
3. 完成片段 → 底部轻量结算，可自动下一段或手动跳过
4. 课程结算 → 查看本轮 WPM / 准确率 / Max Combo / Flow Score

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
