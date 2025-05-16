# Contributing to LeetAI Assistant

First of all, thank you for taking the time to contribute to **LeetAI Assistant**! 🎉  
We welcome contributions from everyone — whether you're reporting bugs, suggesting features, improving documentation, or submitting code.

This document outlines the guidelines and best practices for contributing to the project.

---

## 📚 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Bug Reports](#bug-reports)
  - [Feature Requests](#feature-requests)
  - [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)
  - [Backend Server](#backend-server)
  - [Electron Client](#electron-client)
- [Style Guide](#style-guide)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Guidelines](#pull-request-guidelines)
- [License](#license)

---

## ✅ Code of Conduct

We expect all contributors to follow our [Code of Conduct](./CODE_OF_CONDUCT.md). Be respectful, inclusive, and constructive. Harassment of any kind will not be tolerated.

---

## 🚀 Getting Started

To get started, fork the repository and clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/leetai.git
cd leetai
Install required dependencies for both client and server (see below for details), and you’ll be ready to build and test locally.

💡 How to Contribute
🐞 Bug Reports
If you encounter any issues, please:

Search the issues to check if it’s already reported.

If not, open a new issue with:

Steps to reproduce

Expected vs actual behavior

Screenshots, logs, or screen recordings (if applicable)

OS/platform/environment details

🌟 Feature Requests
Have an idea to improve LeetAI? Great! Please open an issue and describe:

The problem or use case

Your proposed solution

Alternatives considered

👨‍💻 Code Contributions
We welcome contributions to the codebase. To do this:

Fork the repo and create a new branch:

bash
Copy
Edit
git checkout -b feature/your-feature-name
Make your changes and test them.

Commit your changes with a clear message:

bash
Copy
Edit
git commit -m "feat: Add new keyboard shortcut for XYZ"
Push to your fork and open a pull request.

🛠 Development Setup
Backend Server
bash
Copy
Edit
cd leetai-server
npm install
cp .env.example .env
# Fill in your API keys in the .env file
npm run dev
The backend will start on http://localhost:5000 (or the configured port).

Electron Client
In a separate terminal:

bash
Copy
Edit
cd leetai-client
npm install
# Optional: Add a config.json for custom settings
npm start
🎨 Style Guide
Use clear, consistent variable names

Stick to existing formatting (indentation, spacing)

Use const and let instead of var

Write comments where helpful

Keep UI elements minimal and unobtrusive

📝 Commit Message Convention
Use the Conventional Commits format:

feat: – New feature

fix: – Bug fix

docs: – Documentation changes

refactor: – Code changes that don’t affect behavior

chore: – Build tasks, dependency updates

test: – Adding or updating tests

Example:

sql
Copy
Edit
feat: add scroll shortcut for assistant window
🔀 Pull Request Guidelines
Link related issue(s) in your PR description (e.g., "Closes #42").

Ensure your code builds and runs locally.

Run npm run lint (if applicable) before submitting.

Keep PRs focused on one feature or fix.

Be open to feedback and code review.

📄 License
By contributing, you agree that your contributions will be licensed under the GNU GPL v2.0.

Thanks for helping improve LeetAI Assistant! 🙌
