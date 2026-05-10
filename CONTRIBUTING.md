# Contributing to CodeStep

Thank you for your interest in contributing to CodeStep! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/OWNER/REPO/issues)
- Use the bug report template when creating a new issue
- Include detailed steps to reproduce the bug
- Include screenshots if applicable

### Suggesting Enhancements

- Check if the enhancement has already been suggested in [Issues](https://github.com/OWNER/REPO/issues)
- Use the feature request template
- Explain why this enhancement would be useful

### Pull Requests

- Fork the repository
- Create a new branch
- Make your changes
- Submit a pull request

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Rust** (latest stable)
- **npm** or **yarn**
- **Tauri v2** dependencies (see [Tauri Guide](https://v2.tauri.app/start/prerequisites/))

#### Windows

```bash
# Install Node.js from https://nodejs.org/
# Install Rust from https://rustup.rs/
# Install WebView2 (usually pre-installed on Windows 10/11)
# Install Visual Studio Build Tools with C++ workload
```

#### macOS

```bash
brew install node rust
# Install Xcode Command Line Tools
xcode-select --install
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Setup Steps

1. Fork and clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/code-type.git
cd code-type
```

2. Install dependencies:

```bash
npm install
```

3. Run in development mode:

```bash
npm run tauri dev
```

## Branching Strategy

We follow a **Trunk-Based Development** model:

### Main Branches

- `main` - Production-ready code, all releases are tagged from here
- `develop` - Integration branch for ongoing development (optional)

### Supporting Branches

- `feat/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/...` - Documentation updates
- `chore/...` - Maintenance tasks
- `refactor/...` - Code refactoring

### Branch Naming Convention

```
<type>/<description>

Examples:
feat/add-python-courses
fix/login-crash
docs/update-readme
chore/update-deps
```

### Workflow

1. Create a branch from `main` or `develop`:
   ```bash
   git checkout -b feat/my-feature
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push to your fork:
   ```bash
   git push origin feat/my-feature
   ```

4. Create a Pull Request to `main`

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```bash
feat(courses): add Python basic course set

fix(editor): resolve cursor position issue in CodeMirror

docs(readme): update installation instructions for macOS

chore(deps): update Tauri to v2.0.0
```

## Pull Request Process

1. **Update Documentation**: Update the README.md or relevant documentation
2. **Add Tests**: Add tests for new functionality
3. **Update Changelog**: Add your changes to CHANGELOG.md under `[Unreleased]`
4. **Test Locally**: Ensure all tests pass and the app builds successfully
5. **Fill PR Template**: Provide a clear description of the changes
6. **Link Issues**: Link to any related issues
7. **Request Review**: Request reviews from maintainers

### PR Title Format

Use the same format as commit messages:

```
feat: add Python course support
fix: resolve window resize issue
```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style
- Use ESLint and Prettier configurations provided
- Run `npm run lint` before committing

### Rust

- Follow Rust community coding standards
- Use `cargo fmt` to format code
- Use `cargo clippy` for linting
- Document public API with `///` comments

### React/Frontend

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for prop types
- Follow the existing component structure

## Testing

### Running Tests

```bash
# Frontend tests
npm test

# Rust tests
cd src-tauri
cargo test
```

### Writing Tests

- Write unit tests for new functionality
- Write integration tests for critical paths
- Update tests when modifying existing functionality

## Release Process

### Creating a Release

1. Update version in:
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`

2. Update `CHANGELOG.md` with the new version

3. Create and push a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. GitHub Actions will automatically:
   - Build the application for Windows
   - Create a GitHub Release
   - Upload the installer files

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing to CodeStep! 🎉
