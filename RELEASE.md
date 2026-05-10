# Release Process

This document describes how to create a new release of CodeStep.

## Prerequisites

- Maintain access to the GitHub repository
- Have proper signing keys configured (if using Tauri signing)
- Ensure all tests pass

## Automated Release (Recommended)

### 1. Prepare the Release

Update the version number in the following files:

- `package.json` - `"version"` field
- `src-tauri/Cargo.toml` - `version` field
- `src-tauri/tauri.conf.json` - `"version"` field
- `CHANGELOG.md` - Move items from `[Unreleased]` to new version section

### 2. Commit Version Bump

```bash
git add package.json src-tauri/Cargo.toml src-tauri/tauri.conf.json CHANGELOG.md
git commit -m "chore: bump version to v1.0.0"
git push origin main
```

### 3. Create and Push Tag

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push tag to trigger GitHub Actions
git push origin v1.0.0
```

### 4. Monitor Build

- Go to GitHub Actions tab
- Monitor the "Release" workflow
- Wait for the workflow to complete (usually 10-15 minutes)

### 5. Verify Release

- Go to the Releases page
- Verify the release was created with correct version
- Download and test the installer
- Verify changelog is correct

## Manual Release (Fallback)

If automated release fails, you can create a release manually:

### 1. Build Locally

```bash
# Install dependencies
npm ci

# Build the application
npm run tauri build
```

### 2. Create Release on GitHub

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `CodeStep v1.0.0`
5. Description: Copy from CHANGELOG.md
6. Attach binaries:
   - `src-tauri/target/release/bundle/msi/*.msi`
   - `src-tauri/target/release/bundle/nsis/*.exe`
7. Click "Publish release"

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

Example: 1.2.3
         |  |  |
         |  |  └─ Patch: Bug fixes (0.1.1, 0.1.2)
         |  └──── Minor: New features (0.2.0, 0.3.0)
         └─────── Major: Breaking changes (1.0.0, 2.0.0)
```

### Pre-release Versions

For beta/alpha releases:

```
v1.0.0-beta.1
v1.0.0-alpha.2
v2.0.0-rc.1
```

These will be automatically marked as "Pre-release" in GitHub.

## Post-Release Tasks

After creating a release:

1. **Announce**: Post about the release on social media, Discord, etc.
2. **Update Docs**: Update documentation if needed
3. **Monitor Issues**: Watch for bug reports related to the release
4. **Start Next Version**: Add new `[Unreleased]` section to CHANGELOG.md

## Troubleshooting

### Build Fails in CI

1. Check the Actions log for errors
2. Try building locally to reproduce
3. Check if dependencies changed
4. Verify the workflow file is correct

### Release Not Created

1. Check if GITHUB_TOKEN has proper permissions
2. Verify tag was pushed correctly
3. Check if there are conflicting releases

### Installer Corrupted

1. Re-download and verify checksum
2. Check build logs for warnings
3. Test on a clean Windows VM

## Quick Reference

```bash
# Full release workflow
npm version patch -m "chore: bump version to %s"
git push && git push --tags

# Or manually
git add -p
git commit -m "chore: bump version to v1.0.0"
git tag v1.0.0
git push origin main --tags
```

## Tauri Signing (Optional)

If you want to sign your Tauri application:

1. Generate signing keys:
   ```bash
   npm run tauri signer generate -- -w ~/.tauri/myapp.key
   ```

2. Add to GitHub Secrets:
   - `TAURI_SIGNING_PRIVATE_KEY`: Content of private key
   - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: Password for the key

3. The workflow will automatically use these for signing

## Checklist

Before creating a release:

- [ ] All tests pass
- [ ] CHANGELOG.md updated
- [ ] Version bumped in all files
- [ ] No uncommitted changes
- [ ] Main branch is stable
- [ ] Documentation is up to date
- [ ] Installer tested locally (optional but recommended)
