# Security Policy

## Reporting a Vulnerability

We take the security of CodeStep seriously. If you discover a security vulnerability, we appreciate your help in disclosing it to us responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **[INSERT SECURITY EMAIL]**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

### Our Commitment

- We will acknowledge your report within 48 hours
- We will investigate and determine the impact and severity
- We will keep you informed of the progress towards a fix
- We will notify you when the fix is released

### Preferred Languages

We prefer all communications to be in English or Chinese.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Best Practices for Contributors

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Keep dependencies up to date
- Follow the principle of least privilege
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Enable GitHub's security features (Dependabot, etc.)

## Dependency Management

We use automated tools to keep dependencies secure:

- **Dependabot**: Automatically creates PRs for dependency updates
- **GitHub Security Advisories**: Monitor for known vulnerabilities
- **npm audit**: Run regularly to check for vulnerabilities

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the issue and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release patched versions as quickly as possible

## Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request.
