# CodeStep - 一步步学编程

[![Release](https://img.shields.io/github/v/release/ynzz-j/code-step?style=flat-square)](https://github.com/ynzz-j/code-step/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/ynzz-j/code-step/ci.yml?branch=main&style=flat-square)](https://github.com/ynzz-j/code-step/actions)
[![License](https://img.shields.io/github/license/ynzz-j/code-step?style=flat-square)](LICENSE)
[![Downloads](https://img.shields.io/github/downloads/ynzz-j/code-step/total?style=flat-square)](https://github.com/ynzz-j/code-step/releases)

一个帮助你学习编程的桌面应用程序。通过一步步的练习和即时反馈，让编程学习变得更加高效和有趣。

English | [中文](#中文)

---

## ✨ Features

- 🎯 **分步练习** - 将复杂的编程概念分解为小步骤
- ⚡ **即时反馈** - 实时验证你的代码
- 🌍 **多语言支持** - Python, Java, JavaScript 等
- 🎨 **现代化界面** - 基于 Tauri v2 构建，轻量且快速
- 📚 **课程管理** - 轻松组织和浏览学习内容
- 🔧 **内置编辑器** - 集成 CodeMirror，支持语法高亮

## 📦 Installation

### Windows

下载最新版本的 `.msi` 或 `.exe` 安装包：

1. 前往 [Releases](https://github.com/ynzz-j/code-step/releases) 页面
2. 下载最新的 `.msi` 或 `.exe` 文件
3. 运行安装程序，按照向导完成安装

### Build from Source

```bash
# 克隆仓库
git clone https://github.com/ynzz-j/code-step.git
cd code-step

# 安装依赖
npm install

# 运行开发模式
npm run tauri dev

# 构建生产版本
npm run tauri build
```

## 🚀 Quick Start

1. 启动应用
2. 选择一个课程
3. 按照步骤完成练习
4. 查看即时反馈，改进你的代码

## 🛠️ Development

### Prerequisites

- **Node.js** (v18+) - [下载](https://nodejs.org/)
- **Rust** (latest stable) - [安装](https://rustup.rs/)
- **Tauri v2** 依赖 - 见 [Tauri 指南](https://v2.tauri.app/start/prerequisites/)

### Setup

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run tauri dev

# 构建前端
npm run build

# 构建 Tauri 应用
npm run tauri build
```

### Testing

```bash
# 运行前端测试
npm test

# 运行 Rust 测试
cd src-tauri && cargo test
```

## 📖 Documentation

- [Contributing Guide](CONTRIBUTING.md) - 如何贡献代码
- [Release Process](RELEASE.md) - 发布流程
- [Changelog](CHANGELOG.md) - 版本更新日志

## 🤝 Contributing

欢迎贡献！请阅读 [Contributing Guide](CONTRIBUTING.md) 了解详情。

贡献流程：

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feat/amazing-feature`)
3. 提交你的更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feat/amazing-feature`)
5. 创建一个 Pull Request

## 📄 License

本项目采用 MIT License - 详见 [LICENSE](LICENSE) 文件。

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - 构建轻量级桌面应用
- [CodeMirror](https://codemirror.net/) - 代码编辑器
- [React](https://react.dev/) - UI 框架

## 📧 Contact

- 提交 Issue: [GitHub Issues](https://github.com/ynzz-j/code-step/issues)
- 讨论区: [GitHub Discussions](https://github.com/ynzz-j/code-step/discussions)

---

## 中文

### 简介

CodeStep 是一个帮助你学习编程的桌面应用程序。通过分步练习和即时反馈，让编程学习变得更加高效和有趣。

### 主要特性

- 🎯 分步练习 - 将复杂的编程概念分解为小步骤
- ⚡ 即时反馈 - 实时验证你的代码
- 🌍 多语言支持 - Python, Java, JavaScript 等
- 🎨 现代化界面 - 基于 Tauri v2，轻量快速
- 📚 课程管理 - 轻松组织学习内容
- 🔧 内置编辑器 - CodeMirror 集成

### 安装

访问 [Releases](https://github.com/ynzz-j/code-step/releases) 页面下载最新版本。

### 开发

详见 [Contributing Guide](CONTRIBUTING.md)。

---

**⭐ If you find this project useful, please consider giving it a star!**
