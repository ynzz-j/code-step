# Git Workflow Guide

This document explains the Git workflow and branching strategy for the CodeStep project.

## 🌳 Branch Structure

```
main (production-ready)
  │
  ├── develop (integration branch, optional)
  │     │
  │     ├── feat/new-feature
  │     ├── fix/bug-fix
  │     ├── docs/update-docs
  │     └── chore/update-deps
  │
  └── hotfix/critical-bug (directly from main)
```

### Main Branches

- **`main`** - Production-ready code, all releases are tagged from here
- **`develop`** (optional) - Integration branch for ongoing development

### Supporting Branches

- **Feature branches**: `feat/feature-name`
- **Bug fix branches**: `fix/bug-name`
- **Hotfix branches**: `hotfix/description`
- **Release branches**: `release/v1.0.0`
- **Documentation**: `docs/description`
- **Chore/Maintenance**: `chore/description`

## 📝 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add Python course support` |
| `fix` | Bug fix | `fix: resolve cursor position issue` |
| `docs` | Documentation | `docs: update README with new install steps` |
| `style` | Formatting | `style: format code with prettier` |
| `refactor` | Code refactor | `refactor: restructure course loader` |
| `perf` | Performance | `perf: optimize code editor rendering` |
| `test` | Testing | `test: add unit tests for course parser` |
| `chore` | Maintenance | `chore: update dependencies` |

### Examples

```bash
feat(courses): add Python basics course set

- Add 10 new typing exercises
- Add syntax highlighting for Python
- Update course navigation

Closes #42
```

```bash
fix(editor): resolve cursor jump on Windows

The cursor was jumping to the end of line when typing
quickly on Windows. This was due to a race condition
in the CodeMirror state update.

Fixes #38
```

## 🔄 Workflow Steps

### 1. Starting a New Feature

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/add-python-courses
```

### 2. Development

```bash
# Make changes
# ... edit files ...

# Stage changes
git add .

# Commit with conventional message
git commit -m "feat(courses): add Python basics course"

# Push to your fork
git push origin feat/add-python-courses
```

### 3. Creating a Pull Request

1. Push your branch to GitHub
2. Go to the repository on GitHub
3. Click "Compare & pull request"
4. Fill in the PR template
5. Request reviews from maintainers
6. Wait for CI to pass
7. Address review feedback
8. Once approved, maintainer will merge

### 4. After Merge

```bash
# Update your local main
git checkout main
git pull origin main

# Delete your feature branch
git branch -d feat/add-python-courses
git push origin --delete feat/add-python-courses
```

## 🏷️ Release Process

### Automated Release (via GitHub Actions)

1. Update version in:
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`
   - `CHANGELOG.md`

2. Commit the version bump:
   ```bash
   git add package.json src-tauri/Cargo.toml src-tauri/tauri.conf.json CHANGELOG.md
   git commit -m "chore: bump version to v1.0.0"
   git push origin main
   ```

3. Create and push a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. GitHub Actions will automatically:
   - Build the application for Windows
   - Create a GitHub Release
   - Upload `.msi` and `.exe` installers

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

Examples:
- v1.0.0 - Major release
- v1.1.0 - Minor feature release
- v1.1.1 - Patch bug fix
- v2.0.0-beta.1 - Pre-release
```

## 🤝 Code Review Guidelines

### For Authors

- Keep PRs small and focused
- Write clear commit messages
- Add tests for new functionality
- Update documentation
- Respond to feedback promptly

### For Reviewers

- Be constructive and respectful
- Focus on:
  - Code correctness
  - Security concerns
  - Performance implications
  - Code style and maintainability
- Approve when confident in the changes

## 🚦 CI/CD Pipeline

### On Push to Main/Develop

- ✅ Lint check (`npm run lint`)
- ✅ Type check (`npm run typecheck`)
- ✅ Frontend build (`npm run build`)

### On Pull Request

- ✅ All checks from "push" trigger
- ✅ Windows build check (Tauri)
- ✅ Test suite (when available)

### On Tag Push (v*)

- ✅ All CI checks
- ✅ Build Windows executable (.msi, .exe)
- ✅ Create GitHub Release
- ✅ Upload installers to Release

## 🛡️ Best Practices

### Do's

- ✅ Write meaningful commit messages
- ✅ Keep commits atomic (one logical change per commit)
- ✅ Rebase your branch before merging (`git rebase main`)
- ✅ Use draft PRs for work in progress
- ✅ Link issues in PR description and commit messages

### Don'ts

- ❌ Don't force-push to `main` or `develop`
- ❌ Don't commit secrets or sensitive data
- ❌ Don't ignore linting or type errors
- ❌ Don't leave TODO comments without filing an issue
- ❌ Don't merge your own PR without review (unless emergency)

## 🔧 Useful Git Commands

```bash
# See commit history in a nice format
git log --oneline --graph --decorate

# Interactive rebase to clean up commits
git rebase -i HEAD~3

# Squash last 3 commits
git reset --soft HEAD~3
git commit -m "feat: add complete feature"

# Amend last commit (before pushing)
git commit --amend

# Stash changes temporarily
git stash
git stash pop

# See what changed in a file
git diff -- path/to/file

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes - BE CAREFUL!)
git reset --hard HEAD~1
```

## 🆘 Troubleshooting

### Merge Conflicts

```bash
# Update your branch
git checkout main
git pull origin main

# Rebase your feature branch
git checkout feat/your-feature
git rebase main

# Fix conflicts, then:
git add .
git rebase --continue
```

### Accidentally Committed to Main

```bash
# Move your commit to a new branch
git branch feat/my-feature
git reset --hard HEAD~1
git checkout feat/my-feature
```

### Need to Update a PR

```bash
# Make additional changes
git add .
git commit -m "fix: address review feedback"
git push origin feat/your-feature
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)
- [Tauri Documentation](https://v2.tauri.app/)

---

For questions or clarifications, please open an issue or reach out to the maintainers.
